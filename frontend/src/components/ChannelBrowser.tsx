'use client';

import { useState, useEffect } from 'react';
import { IPTVChannel } from '@/types';

interface ChannelBrowserProps {
  onChannelSelect: (channel: IPTVChannel) => void;
  selectedChannel?: IPTVChannel;
}

export default function ChannelBrowser({ onChannelSelect, selectedChannel }: ChannelBrowserProps) {
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<IPTVChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [iptvUrl, setIptvUrl] = useState('http://myiptvdeals.ottct.pro:80/get.php?username=SUVVPMU0DJ&password=CUG1BBYQNN&output=ts&type=m3u_plus');

  const fetchChannels = async (url?: string) => {
    const targetUrl = url || iptvUrl;
    
    if (!targetUrl) {
      setError('يرجى إدخال رابط IPTV');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/iptv/channels?url=${encodeURIComponent(targetUrl)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch channels');
      }
      
      const data = await response.json();
      setChannels(data);
      setFilteredChannels(data);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل القنوات. يرجى التحقق من رابط IPTV.');
      console.error('Error fetching channels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-load channels on component mount with default URL
    fetchChannels();
  }, []);

  useEffect(() => {
    let filtered = channels;
    
    if (searchTerm) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.group.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGroup) {
      filtered = filtered.filter(channel => channel.group === selectedGroup);
    }
    
    setFilteredChannels(filtered);
  }, [searchTerm, selectedGroup, channels]);

  const groups = Array.from(new Set(channels.map(channel => channel.group)));

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchChannels(iptvUrl);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">إعدادات IPTV</h3>
        <button
          onClick={() => fetchChannels()}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
        >
          {loading ? 'جاري التحميل...' : 'تحديث القنوات'}
        </button>
      </div>

      {/* IPTV URL Input */}
      <form onSubmit={handleUrlSubmit} className="mb-4">
        <label className="block text-sm font-medium mb-2">رابط IPTV</label>
        <div className="flex space-x-2 space-x-reverse">
          <input
            type="text"
            value={iptvUrl}
            onChange={(e) => setIptvUrl(e.target.value)}
            placeholder="أدخل رابط قنوات IPTV"
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            تحميل
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          أدخل رابط M3U الخاص بمزود IPTV الخاص بك
        </p>
      </form>

      {error && (
        <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {channels.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium">القنوات المتاحة ({channels.length})</h4>
            <span className="text-sm text-green-400">
              ✓ تم تحميل {channels.length} قناة
            </span>
          </div>

          <div className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="ابحث عن قناة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
            />
            
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="">كل المجموعات</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className={`p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors ${
                  selectedChannel?.id === channel.id ? 'bg-green-900 bg-opacity-20 border-green-500' : ''
                }`}
                onClick={() => onChannelSelect(channel)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm mb-1">{channel.name}</h4>
                    <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-400">
                      <span>{channel.group}</span>
                      {channel.tvgId && <span>• {channel.tvgId}</span>}
                    </div>
                  </div>
                  {selectedChannel?.id === channel.id && (
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredChannels.length === 0 && searchTerm && (
              <div className="text-center py-8 text-gray-400">
                لا توجد قنوات مطابقة للبحث
              </div>
            )}
          </div>
        </>
      )}

      {channels.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">📺</div>
          <p>أدخل رابط IPTV واضغط على تحميل لعرض القنوات</p>
        </div>
      )}
    </div>
  );
}
