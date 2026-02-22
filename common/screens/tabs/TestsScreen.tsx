
import React, { useState, useEffect } from 'react';
import { User, UserRole, Test } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const TestsScreen: React.FC<{ user: User }> = ({ user }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'tests'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTests(snap.docs.map(d => ({ id: d.id, ...d.data() } as Test)));
    });
    return unsub;
  }, []);

  const handleCreate = async () => {
    if (!title || !date) return;
    try {
      await addDoc(collection(db, 'tests'), { title, date, createdAt: serverTimestamp() });
      setIsAdding(false); setTitle(''); setDate('');
    } catch (e) { alert("Error"); }
  };

  return (
    <div className="p-4 space-y-5 bg-white">
      <div className="flex justify-between items-center">
        <div><h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Exam Hub</h3><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Portal Grid</p></div>
        {user.role === UserRole.ADMIN && (
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all">New Test</button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xl space-y-3">
           <input className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg font-bold text-xs outline-none" placeholder="TITLE" value={title} onChange={e => setTitle(e.target.value.toUpperCase())} />
           <input type="date" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-lg font-bold text-xs outline-none" value={date} onChange={e => setDate(e.target.value)} />
           <div className="flex gap-2">
              <button onClick={handleCreate} className="flex-1 bg-gray-900 text-white py-2 rounded-lg font-black text-[9px] uppercase">Launch</button>
              <button onClick={() => setIsAdding(false)} className="px-4 bg-gray-100 text-gray-400 py-2 rounded-lg font-black text-[9px] uppercase">Cancel</button>
           </div>
        </div>
      )}

      <div className="space-y-3 pb-20">
        {tests.map(test => (
          <div key={test.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 active:scale-[0.98] transition-all">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center text-lg shadow-md shadow-blue-100">📝</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900 text-xs uppercase tracking-tight leading-tight truncate">{test.title}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{test.date}</p>
                </div>
             </div>
             <button className="w-full bg-gray-900 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md">Attempt Exam</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestsScreen;