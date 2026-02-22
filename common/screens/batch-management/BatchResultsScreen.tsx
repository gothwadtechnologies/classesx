
import React, { useState } from 'react';
import { Batch, User } from '../../types';
import { BarChart3, Search, TrendingUp, Award, Clock } from 'lucide-react';

interface BatchResultsScreenProps {
  batch: Batch;
  user: User;
}

const BatchResultsScreen: React.FC<BatchResultsScreenProps> = ({ batch, user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock results data
  const mockResults = [
    { id: '1', studentName: 'Aman Sharma', testTitle: 'Physics Midterm', score: 85, total: 100, rank: 1, date: 'Dec 01' },
    { id: '2', studentName: 'Priya Patel', testTitle: 'Physics Midterm', score: 82, total: 100, rank: 2, date: 'Dec 01' },
    { id: '3', studentName: 'Rahul Verma', testTitle: 'Physics Midterm', score: 78, total: 100, rank: 3, date: 'Dec 01' },
    { id: '4', studentName: 'Sneha Gupta', testTitle: 'Physics Midterm', score: 75, total: 100, rank: 4, date: 'Dec 01' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Performance Analytics</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Batch Rankings & Scores</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
            <p className="text-lg font-black text-slate-900">78%</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Highest</p>
            <p className="text-lg font-black text-slate-900">92%</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Passing</p>
            <p className="text-lg font-black text-slate-900">100%</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {mockResults.map((result) => (
          <div key={result.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${
              result.rank === 1 ? 'bg-amber-50 text-amber-600' : 
              result.rank === 2 ? 'bg-slate-50 text-slate-400' : 
              result.rank === 3 ? 'bg-orange-50 text-orange-600' : 
              'bg-blue-50 text-blue-600'
            }`}>
              #{result.rank}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{result.studentName}</h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <Award className="w-3 h-3" />
                  {result.testTitle}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {result.date}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-slate-900 leading-none">{result.score}/{result.total}</p>
              <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1">Passed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchResultsScreen;
