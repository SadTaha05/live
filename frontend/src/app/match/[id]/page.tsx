'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import IPTVPlayer from '@/components/IPTVPlayer';
import { Match } from '@/types';

export default function MatchPage() {
  const params = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchMatch(params.id as string);
    }
  }, [params.id]);

  const fetchMatch = async (id: string) => {
    try {
      const response = await fetch(`/api/matches/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMatch(data);
      } else {
        setError('لم يتم العثور على المباراة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المباراة');
      console.error('Error fetching match:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">خطأ</h2>
          <p className="text-gray-400">{error || 'لم يتم العثور على المباراة'}</p>
          <a href="/" className="inline-block mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
            العودة للرئيسية
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">{match.title}</h1>
        <p className="text-gray-400 text-center mb-4">{match.description}</p>
        
        <div className="flex justify-center items-center space-x-8 space-x-reverse mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{match.homeTeam}</div>
            <div className="text-4xl font-bold text-green-400 mt-2">{match.homeScore}</div>
          </div>
          
          <div className="text-2xl text-gray-400 font-bold">VS</div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{match.awayTeam}</div>
            <div className="text-4xl font-bold text-green-400 mt-2">{match.awayScore}</div>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-6 space-x-reverse text-sm text-gray-400">
          <span className={`px-3 py-1 rounded-full ${
            match.status === 'live' ? 'bg-red-500 text-white' :
            match.status === 'upcoming' ? 'bg-yellow-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {match.status === 'live' ? '🔴 مباشر' :
             match.status === 'upcoming' ? '⏳ قريباً' : '✅ منتهي'}
          </span>
          <span>الجودة: {match.quality}</span>
          <span>المشاهدين: {match.viewers}</span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        {match.status === 'live' ? (
          <IPTVPlayer 
            streamUrl={match.streamUrl}
            className="h-[60vh]"
          />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {match.status === 'upcoming' ? '⏰' : '✅'}
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              {match.status === 'upcoming' ? 'المباراة لم تبدأ بعد' : 'المباراة انتهت'}
            </h3>
            <p className="text-gray-500">
              {match.status === 'upcoming' 
                ? `ستبدأ المباراة في ${new Date(match.startTime).toLocaleString('ar-EG')}`
                : `انتهت المباراة في ${new Date(match.endTime).toLocaleString('ar-EG')}`
              }
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">معلومات البث</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">نوع البث:</span>
            <span className="text-white mr-2"> HLS</span>
          </div>
          <div>
            <span className="text-gray-400">حالة الخادم:</span>
            <span className="text-green-400 mr-2"> ● نشط</span>
          </div>
          <div>
            <span className="text-gray-400">رابط البث:</span>
            <span className="text-white mr-2 truncate block">{match.streamUrl}</span>
          </div>
          <div>
            <span className="text-gray-400">آخر تحديث:</span>
            <span className="text-white mr-2">{new Date().toLocaleString('ar-EG')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
