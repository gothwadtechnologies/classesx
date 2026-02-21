
import React from 'react';
import { Batch, User } from '../../types.ts';
import { Trophy, Medal, Target, ChevronRight, BarChart3 } from 'lucide-react';

interface BatchResultsScreenProps {
  batch: Batch;
  user: User;
}

const BatchResultsScreen: React.FC<BatchResultsScreenProps> = ({ batch, user }) => {
  // Mock data
  const recentTests = [
    { id: '1', title: 'Full Syllabus Mock 01', date: '20 Oct 2024', avgScore: 72, topScore: 98 },
    { id: '2', title: 'Physics: Mechanics Part 2', date: '15 Oct 2024', avgScore: 54, topScore: 88 },
    { id: '3', title: 'Chemistry: Organic Intro', date: '10 Oct 2024', avgScore: 65, topScore: 92 },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🏆</div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest leading-none">Batch Performance</h4>
              <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1.5">Overall Analytics</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
              <p className="text-[7px] font-black uppercase tracking-widest text-white/60 mb-1">Average Accuracy</p>
              <p className="text-xl font-black">68.4%</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
              <p className="text-[7px] font-black uppercase tracking-widest text-white/60 mb-1">Top Percentile</p>
              <p className="text-xl font-black">99.2</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Recent Test Results</h3>
          {recentTests.map((test) => (
            <div key={test.id} className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{test.title}</h4>
                  <div className="flex items-center gap-3">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Avg: {test.avgScore}%</p>
                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Top: {test.topScore}%</p>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchResultsScreen;
