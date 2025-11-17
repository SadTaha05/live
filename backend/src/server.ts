import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all matches
app.get('/api/matches', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { startTime: 'asc' }
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Get single match
app.get('/api/matches/:id', async (req, res) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id }
    });
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

// Create match
app.post('/api/matches', async (req, res) => {
  try {
    const {
      title, titleAr, description, descriptionAr, streamUrl,
      thumbnail, category, startTime, endTime, homeTeam, awayTeam,
      status, quality, iptvChannelId
    } = req.body;

    const match = await prisma.match.create({
      data: {
        title,
        titleAr,
        description,
        descriptionAr,
        streamUrl,
        thumbnail,
        category,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeTeam,
        awayTeam,
        status,
        quality,
        iptvChannelId,
        isLive: status === 'live'
      }
    });

    res.json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

// Fetch IPTV channels with better error handling and retries
app.get('/api/iptv/channels', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'IPTV URL is required' });
    }

    console.log('Fetching IPTV channels from:', url);

    // Try multiple approaches
    let channels = [];
    
    // Approach 1: Direct fetch with longer timeout
    try {
      const response = await axios.get(url as string, {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Accept-Encoding': 'identity'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Resolve only if status code < 500
        }
      });

      if (response.status === 200 && response.data) {
        console.log('IPTV response received, length:', response.data.length);
        channels = parseM3UContent(response.data);
      } else {
        console.log('IPTV server returned status:', response.status);
        throw new Error(`Server returned status: ${response.status}`);
      }
    } catch (fetchError: any) {
      console.log('Direct fetch failed:', fetchError.message);
      
      // Approach 2: Try with different parameters
      try {
        const altUrl = (url as string).replace('&type=m3u_plus', '') + '&type=m3u';
        console.log('Trying alternative URL:', altUrl);
        
        const altResponse = await axios.get(altUrl, {
          timeout: 30000,
          headers: {
            'User-Agent': 'VLC/3.0.0',
            'Accept': '*/*'
          }
        });
        
        if (altResponse.status === 200 && altResponse.data) {
          channels = parseM3UContent(altResponse.data);
        }
      } catch (altError) {
        console.log('Alternative fetch also failed:', altError.message);
        throw new Error('All fetch attempts failed: ' + fetchError.message);
      }
    }

    console.log(`Successfully parsed ${channels.length} channels`);
    
    if (channels.length === 0) {
      return res.status(500).json({ 
        error: 'No channels found in the playlist. The IPTV URL might be invalid or the server returned empty data.' 
      });
    }
    
    res.json(channels);
  } catch (error: any) {
    console.error('Final IPTV fetch error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch IPTV channels: ' + error.message 
    });
  }
});

function parseM3UContent(content: string) {
  const channels = [];
  const lines = content.split('\n');
  
  let currentChannel: any = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Parse channel info
      const infoLine = line;
      const nameMatch = infoLine.match(/,(.*)$/);
      const groupMatch = infoLine.match(/group-title="([^"]*)"/);
      const tvgNameMatch = infoLine.match(/tvg-name="([^"]*)"/);
      const tvgIdMatch = infoLine.match(/tvg-id="([^"]*)"/);
      const tvgLogoMatch = infoLine.match(/tvg-logo="([^"]*)"/);

      currentChannel = {
        id: generateChannelId(infoLine + i),
        name: tvgNameMatch ? tvgNameMatch[1] : (nameMatch ? nameMatch[1].trim() : 'Unknown Channel'),
        url: '',
        group: groupMatch ? groupMatch[1] : 'General',
        tvgId: tvgIdMatch ? tvgIdMatch[1] : '',
        logo: tvgLogoMatch ? tvgLogoMatch[1] : '',
        rawInfo: infoLine
      };
    } else if (line && !line.startsWith('#') && currentChannel.name) {
      // This is the stream URL
      currentChannel.url = line.trim();
      
      // Only add if URL looks valid
      if (currentChannel.url && (currentChannel.url.startsWith('http') || currentChannel.url.startsWith('rtmp'))) {
        channels.push(currentChannel);
      }
      currentChannel = {};
    }
  }
  
  return channels;
}

function generateChannelId(infoLine: string) {
  return Buffer.from(infoLine).toString('base64').slice(0, 15).replace(/[^a-zA-Z0-9]/g, '');
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL}`);
});
