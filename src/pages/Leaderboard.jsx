import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { Trophy, Medal, Star } from 'lucide-react';

// Simulated leaderboard data
const mockLeaderboard = [
  { id: '1', name: 'Arjun Sharma', xp: 4200, streak: 21, accuracy: 87, avatar: 'A', badge: '🥇' },
  { id: '2', name: 'Priya Patel', xp: 3800, streak: 15, accuracy: 91, avatar: 'P', badge: '🥈' },
  { id: '3', name: 'Rohit Kumar', xp: 3500, streak: 12, accuracy: 85, avatar: 'R', badge: '🥉' },
  { id: '4', name: 'Sneha Gupta', xp: 3100, streak: 9, accuracy: 83, avatar: 'S', badge: null },
  { id: '5', name: 'Vikram Singh', xp: 2900, streak: 7, accuracy: 79, avatar: 'V', badge: null },
  { id: '6', name: 'Kavya Reddy', xp: 2600, streak: 5, accuracy: 88, avatar: 'K', badge: null },
  { id: '7', name: 'Aditya Nair', xp: 2400, streak: 6, accuracy: 75, avatar: 'A', badge: null },
  { id: '8', name: 'Meera Joshi', xp: 2200, streak: 3, accuracy: 82, avatar: 'M', badge: null },
];

export default function Leaderboard() {
  const { progress } = useProgress();
  const myXP = progress.xp || 0;
  const myEntry = { id: 'me', name: 'You', xp: myXP, streak: progress.streak?.count || 0, accuracy: progress.totalAttempts > 0 ? Math.round((progress.totalCorrect / progress.totalAttempts) * 100) : 0, avatar: '⭐', badge: null };
  const allEntries = [...mockLeaderboard, myEntry].sort((a, b) => b.xp - a.xp);
  const myRank = allEntries.findIndex(e => e.id === 'me') + 1;

  const top3 = allEntries.slice(0, 3);
  const rest = allEntries.slice(3);

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="section-title mb-2">🏆 Leaderboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Top NEET Aspirants This Week</p>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-2">Your Rank: #{myRank}</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-3 mb-8">
        {[top3[1], top3[0], top3[2]].map((entry, i) => {
          const heights = [28, 36, 20];
          const ranks = [2, 1, 3];
          const colors = ['bg-slate-400', 'bg-amber-400', 'bg-orange-400'];
          if (!entry) return null;
          return (
            <div key={entry.id} className="flex flex-col items-center flex-1 max-w-28">
              <div className="text-3xl mb-1">{entry.badge || ''}</div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-white mb-2">
                {entry.avatar}
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white text-center mb-1 truncate max-w-full">{entry.name}</div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">{entry.xp} XP</div>
              <div className={`w-full rounded-t-xl flex items-center justify-center text-white font-bold text-lg ${colors[i]}`}
                style={{ height: `${heights[i] * 2.5}px` }}>
                #{ranks[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="card overflow-hidden">
        {rest.map((entry, i) => {
          const rank = i + 4;
          const isMe = entry.id === 'me';
          return (
            <div key={entry.id} className={`flex items-center gap-4 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 last:border-0 ${isMe ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'} transition-colors`}>
              <div className="w-7 text-center text-sm font-bold text-slate-400">#{rank}</div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-white">
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm truncate ${isMe ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                  {entry.name} {isMe && <span className="text-xs">(You)</span>}
                </div>
                <div className="text-xs text-slate-400">🔥 {entry.streak} day streak · {entry.accuracy}% accuracy</div>
              </div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400">{entry.xp} XP</div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-center text-slate-400 mt-4">
        Leaderboard updates daily. Keep studying to climb up! 🚀
      </p>
    </div>
  );
}
