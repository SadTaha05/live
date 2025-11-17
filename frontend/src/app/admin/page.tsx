'use client';

import { useState } from 'react';
import ChannelBrowser from '@/components/ChannelBrowser';
import { IPTVChannel, CreateMatchData } from '@/types';

export default function AdminPage() {
  const [selectedChannel, setSelectedChannel] = useState<IPTVChannel>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState<CreateMatchData>({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    streamUrl: '',
    thumbnail: '',
    category: 'football',
    startTime: '',
    endTime: '',
    homeTeam: '',
    awayTeam: '',
    status: 'upcoming',
    quality: '1080p',
    iptvChannelId: ''
  });

  const handleChannelSelect = (channel: IPTVChannel) => {
    setSelectedChannel(channel);
    setFormData(prev => ({
      ...prev,
      streamUrl: channel.url,
      iptvChannelId: channel.id
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('تم إنشاء المباراة بنجاح!');
        setFormData({
          title: '',
          titleAr: '',
          description: '',
          descriptionAr: '',
          streamUrl: '',
          thumbnail: '',
          category: 'football',
          startTime: '',
          endTime: '',
          homeTeam: '',
          awayTeam: '',
          status: 'upcoming',
          quality: '1080p',
          iptvChannelId: ''
        });
        setSelectedChannel(undefined);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في حفظ المباراة');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setMessage(error.message || 'حدث خطأ أثناء إنشاء المباراة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">لوحة التحكم - إضافة مباراة جديدة</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('نجاح') ? 'bg-green-900 bg-opacity-20 border border-green-700' : 'bg-red-900 bg-opacity-20 border border-red-700'
        }`}>
          <p className={message.includes('نجاح') ? 'text-green-400' : 'text-red-400'}>{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel Browser */}
        <div>
          <ChannelBrowser 
            onChannelSelect={handleChannelSelect}
            selectedChannel={selectedChannel}
          />
        </div>

        {/* Match Form */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">معلومات المباراة</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم المباراة (إنجليزية)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="مثال: Real Madrid vs Barcelona"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">اسم المباراة (عربية)</label>
                <input
                  type="text"
                  name="titleAr"
                  value={formData.titleAr}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="مثال: ريال مدريد ضد برشلونة"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">وصف المباراة</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                rows={2}
                placeholder="وصف المباراة..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الفريق المضيف</label>
                <input
                  type="text"
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="اسم الفريق الأول"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الفريق الضيف</label>
                <input
                  type="text"
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="اسم الفريق الثاني"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">وقت البدء</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">وقت النهاية</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">حالة المباراة</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="upcoming">قريباً</option>
                  <option value="live">مباشر</option>
                  <option value="completed">منتهي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الجودة</label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رابط البث</label>
              <input
                type="url"
                name="streamUrl"
                value={formData.streamUrl}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="رابط البث المباشر"
              />
              {selectedChannel && (
                <p className="text-sm text-green-400 mt-1">
                  ✓ تم اختيار القناة: {selectedChannel.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء المباراة'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
