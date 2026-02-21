
import React, { useState } from 'react';
import { User, ClassSession } from '../../types';

const MOCK_CLASSES: ClassSession[] = [
  { id: '1', title: 'Mathematics - Trigonometry 101', instructor: 'Dr. Smith', time: 'LIVE - 10:00 AM', youtubeUrl: '#', type: 'live', modality: 'online' },
  { id: '2', title: 'Physics - Newton Laws', instructor: 'Prof. J. Doe', time: 'REPLAY', youtubeUrl: '#', type: 'recorded', modality: 'online' },
  { id: '3', title: 'Chemistry - Organic Bonds', instructor: 'Ms. Sarah', time: 'Upcoming - 2:00 PM', youtubeUrl: '#', type: 'live', modality: 'online' },
];

const ClassesScreen: React.FC<{ user: User }> = () => {
  const [modality, setModality] = useState<'online' | 'offline'>('online');
  const filteredClasses = MOCK_CLASSES.filter(c => c.modality === modality);

  return (
    <div className="p-4 space-y-5 bg-white">
      <div className="bg-gray-100 p-1 rounded-xl flex items-center">
        <button onClick={() => setModality('online')} className={`flex-1 py-2 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${modality === 'online' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-400'}`}>🌐 Online</button>
        <button onClick={() => setModality('offline')} className={`flex-1 py-2 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${modality === 'offline' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>🏫 Offline</button>
      </div>

      <div className={`rounded-2xl p-5 text-white shadow-lg overflow-hidden relative ${modality === 'online' ? 'bg-rose-600 shadow-rose-100' : 'bg-blue-600 shadow-blue-100'}`}>
        <div className="relative z-10"><h3 className="text-lg font-black tracking-tight uppercase">{modality === 'online' ? 'Global Grid' : 'Campus Hub'}</h3><p className="text-white/70 text-[8px] font-bold uppercase tracking-widest mt-0.5">{modality === 'online' ? 'Live Digital Learning' : 'Physical Location'}</p></div>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="space-y-3 pb-20">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${cls.type === 'live' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
              {cls.modality === 'online' ? (cls.type === 'live' ? '🔴' : '🎬') : '📍'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-gray-900 text-xs truncate uppercase tracking-tight leading-none">{cls.title}</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{cls.instructor} • {cls.time}</p>
            </div>
            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${modality === 'online' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesScreen;