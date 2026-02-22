
import React from 'react';
import { Batch, User } from '../../types.ts';
import { History, FileText, Download, ExternalLink, Search } from 'lucide-react';

interface BatchPYQScreenProps {
  batch: Batch;
  user: User;
}

const BatchPYQScreen: React.FC<BatchPYQScreenProps> = ({ batch, user }) => {
  const pyqs = [
    { id: '1', title: 'JEE Main 2024 Session 1', subject: 'Full Syllabus', year: '2024' },
    { id: '2', title: 'JEE Advanced 2023 Paper 1', subject: 'Full Syllabus', year: '2023' },
    { id: '3', title: 'NEET 2023 Phase 1', subject: 'Biology Focus', year: '2023' },
    { id: '4', title: 'CBSE Boards 2024', subject: 'Physics', year: '2024' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search PYQs by year or exam..."
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {pyqs.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{item.title}</h4>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.subject} • {item.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-blue-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchPYQScreen;
