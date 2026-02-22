
import React, { useState, useEffect } from 'react';
import { Batch, User, UserRole } from '../../types.ts';
import { db } from '../../firebase.ts';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Users, Search, UserPlus, Mail, Phone, MoreVertical } from 'lucide-react';
import { useAdminView } from '../../context/AdminViewContext.tsx';

interface BatchStudentsScreenProps {
  batch: Batch;
  user: User;
}

const BatchStudentsScreen: React.FC<BatchStudentsScreenProps> = ({ batch, user }) => {
  const { isAdminViewMode } = useAdminView();
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd filter by batch.studentIds
    // For now, let's fetch students who have this batchId in their batchIds array
    // We remove the role filter from the query to avoid index requirement
    const q = query(
      collection(db, 'users'), 
      where('batchIds', 'array-contains', batch.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Filter by role client-side
        if (data.role === UserRole.STUDENT) {
          list.push({ uid: doc.id, ...data } as User);
        }
      });
      setStudents(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [batch.id]);

  const filteredStudents = students.filter(s => 
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.phone || '').includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search students in this batch..."
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Loading Students...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div 
              key={student.uid}
              className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black border border-blue-100 shrink-0">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate leading-none mb-1.5">{student.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                    <Phone className="w-3 h-3" />
                    <span>{student.phone}</span>
                  </div>
                </div>
              </div>
              {isAdminViewMode && (
                <button className="w-8 h-8 text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">No Students in this Batch</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchStudentsScreen;
