export interface Match {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  streamUrl: string;
  thumbnail: string;
  category: string;
  startTime: string;
  endTime: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'upcoming' | 'completed';
  viewers: number;
  quality: string;
  isLive: boolean;
  iptvChannelId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPTVChannel {
  id: string;
  name: string;
  url: string;
  group: string;
}

export interface CreateMatchData {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  streamUrl: string;
  thumbnail: string;
  category: string;
  startTime: string;
  endTime: string;
  homeTeam: string;
  awayTeam: string;
  status: 'live' | 'upcoming' | 'completed';
  quality: string;
  iptvChannelId?: string;
}
