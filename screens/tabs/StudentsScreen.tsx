
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, UserPlus, Filter, MoreVertical, Phone, Mail } from 'lucide-react';
import { User, UserRole } from '../../types';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface StudentsScreenProps {
  user: User;
}

const StudentsScreen: React.FC<StudentsScreenProps> = ({ user }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', UserRole.STUDENT));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: User[] = [];
      snapshot.forEach((doc) => {
        list.push({ uid: doc.id, ...doc.data() } as User);
      });
      setStudents(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter(s => 
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.phone || '').includes(searchQuery) ||
    (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Students</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Directory</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-blue-900 shadow-sm active:scale-90 transition-all">
            <UserPlus className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by name, phone or email..."
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-900/20 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Loading Students...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={student.uid}
              className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center text-xl font-black border border-blue-100 shrink-0">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate leading-none mb-1.5">{student.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                    <Phone className="w-3 h-3" />
                    <span>{student.phone}</span>
                  </div>
                  {student.email && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{student.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <button className="w-8 h-8 text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">No Students Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsScreen;
