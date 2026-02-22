
import React, { useState, useEffect } from 'react';
import { Batch, User, Test, UserRole } from '../../types.ts';
import { db } from '../../firebase.ts';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { FileText, Plus, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useAdminView } from '../../context/AdminViewContext.tsx';

interface BatchTestsScreenProps {
  batch: Batch;
  user: User;
}

const BatchTestsScreen: React.FC<BatchTestsScreenProps> = ({ batch, user }) => {
  const { isAdminViewMode } = useAdminView();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'tests'), 
      where('batchId', '==', batch.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Test[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Test);
      });
      
      // Sort client-side to avoid index requirement
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setTests(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [batch.id]);

  const isAdmin = user.role === UserRole.ADMIN && isAdminViewMode;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Scheduled Tests</h3>
        {isAdmin && (
          <button className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all">
            <Plus className="w-3 h-3" />
            Create
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Loading Tests...</p>
          </div>
        ) : tests.length > 0 ? (
          tests.map((test) => (
            <div 
              key={test.id}
              className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{test.title}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {test.date}
                      </div>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {test.duration || 180} MIN
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                  {test.totalMarks} MARKS
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Physics • Chemistry • Maths</p>
                <button className="flex items-center gap-1 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                  {isAdmin ? 'Manage' : 'Start Test'}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">No Tests Scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchTestsScreen;
