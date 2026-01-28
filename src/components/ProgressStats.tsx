import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { DailyStats } from '../types/flashcard';
import { Flame, Layers, Calendar, TrendingUp } from 'lucide-react';
interface ProgressStatsProps {
  stats: {
    totalCards: number;
    dueCount: number;
    reviewedToday: number;
    streak: number;
  };
}
export function ProgressStats({ stats }: ProgressStatsProps) {
  const statItems = [
  {
    label: 'Day Streak',
    value: stats.streak,
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  },
  {
    label: 'Reviewed Today',
    value: stats.reviewedToday,
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    label: 'Due Now',
    value: stats.dueCount,
    icon: Layers,
    color: 'text-red-500',
    bg: 'bg-red-50'
  },
  {
    label: 'Total Cards',
    value: stats.totalCards,
    icon: TrendingUp,
    color: 'text-stone-600',
    bg: 'bg-stone-100'
  }];

  return (
    <div className="h-full p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Your Progress
        </h2>
        <p className="text-stone-500">Keep up the momentum!</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) =>
        <motion.div
          key={item.label}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: index * 0.1
          }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-start">

            <div className={`p-3 rounded-2xl ${item.bg} ${item.color} mb-4`}>
              <item.icon size={24} />
            </div>
            <span className="text-3xl font-bold text-stone-900 mb-1">
              {item.value}
            </span>
            <span className="text-sm font-medium text-stone-400">
              {item.label}
            </span>
          </motion.div>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <h3 className="font-bold text-stone-800 mb-4">Study Tips</h3>
        <ul className="space-y-3 text-sm text-stone-600">
          <li className="flex items-start">
            <span className="mr-2 text-red-500">•</span>
            Review cards daily to maintain your streak and optimize memory
            retention.
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-red-500">•</span>
            Use the Voice Practice mode to improve your pronunciation tones.
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-red-500">•</span>
            Add your own cards for vocabulary you encounter in daily life.
          </li>
        </ul>
      </div>
    </div>);

}