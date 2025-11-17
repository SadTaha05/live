import { Match } from '@/types';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-red-500';
      case 'upcoming': return 'text-yellow-500';
      case 'completed': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'مباشر';
      case 'upcoming': return 'قريباً';
      case 'completed': return 'منتهي';
      default: return status;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-green-500 transition-colors">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)} bg-opacity-20`}>
            {getStatusText(match.status)}
          </span>
          <span className="text-gray-400 text-sm">{match.quality}</span>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{match.title}</h3>
          <p className="text-gray-400 text-sm">{match.description}</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{match.homeTeam}</div>
            <div className="text-2xl font-bold text-green-400">{match.homeScore}</div>
          </div>
          
          <div className="text-gray-400 mx-4">VS</div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-white">{match.awayTeam}</div>
            <div className="text-2xl font-bold text-green-400">{match.awayScore}</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>المشاهدين: {match.viewers}</span>
          <span>{new Date(match.startTime).toLocaleDateString('ar-EG')}</span>
        </div>
      </div>

      {match.status === 'live' && (
        <div className="bg-gray-900 border-t border-gray-700 p-4">
          <a
            href={`/match/${match.id}`}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center font-semibold"
          >
            <span className="ml-2">▶</span>
            مشاهدة المباراة
          </a>
        </div>
      )}
    </div>
  );
}
