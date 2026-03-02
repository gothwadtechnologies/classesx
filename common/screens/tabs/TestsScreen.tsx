
import React, { useState, useEffect } from 'react';
import { User, UserRole, Test, Batch } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Plus, FileText, Calendar, Clock, Layers, Settings, Play, Trophy, ChevronRight, MoreVertical, Trash2, Edit3, Info } from 'lucide-react';
import AddTestPopup from '../../components/popups/AddTestPopup.tsx';
import { motion, AnimatePresence } from 'motion/react';
import ManagementOptionsScreen from '../ManagementOptionsScreen.tsx';

interface TestsScreenProps {
  user: User;
  onSelectTest: (test: Test, screen: 'TEST_BUILDER' | 'TEST_TAKER') => void;
}

const TestsScreen: React.FC<TestsScreenProps> = ({ user, onSelectTest }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    
    const qTests = query(collection(db, 'tests'), orderBy('createdAt', 'desc'));
    const unsubTests = onSnapshot(qTests, (snap) => {
      setTests(snap.docs.map(d => ({ id: d.id, ...d.data() } as Test)));
    });

    const qBatches = query(collection(db, 'batches'), orderBy('name', 'asc'));
    const unsubBatches = onSnapshot(qBatches, (snap) => {
      setBatches(snap.docs.map(d => ({ id: d.id, ...d.data() } as Batch)));
    });

    return () => {
      unsubTests();
      unsubBatches();
    };
  }, []);

  const handleCreateOrUpdate = async (testData: Partial<Test>) => {
    if (!db) return;
    try {
      if (editingTest) {
        await updateDoc(doc(db, 'tests', editingTest.id), {
          ...testData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'tests'), {
          ...testData,
          createdAt: serverTimestamp()
        });
      }
      setIsAdding(false);
      setEditingTest(null);
    } catch (e) {
      console.error("Error saving test:", e);
      alert("Failed to save test");
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await deleteDoc(doc(db, 'tests', id));
      setActiveMenu(null);
    } catch (e) {
      alert("Failed to delete test");
    }
  };

  const toggleStatus = async (test: Test) => {
    if (!db) return;
    const nextStatus = test.status === 'upcoming' ? 'live' : test.status === 'live' ? 'completed' : 'upcoming';
    try {
      await updateDoc(doc(db, 'tests', test.id), { status: nextStatus });
    } catch (e) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Exam Hub</h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">Assessment Portal</p>
        </div>
        {user.role === UserRole.ADMIN && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Test
          </button>
        )}
      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 gap-5 pb-24">
        {tests.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">No tests scheduled</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Create your first assessment to begin</p>
            </div>
          </div>
        ) : (
          tests.map(test => (
            <motion.div 
              layout
              key={test.id} 
              onClick={() => user.role === UserRole.ADMIN && onSelectTest(test, 'TEST_BUILDER')}
              className="group bg-slate-900 rounded-[2rem] p-5 shadow-2xl shadow-slate-900/40 relative border border-white/5 cursor-pointer active:scale-[0.98] transition-all"
            >
              {/* Android Style Background Accent Container */}
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className={`absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 rounded-full opacity-10 blur-3xl ${
                  test.status === 'live' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
              </div>
              
              <div className="flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    test.status === 'live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${
                        test.status === 'live' ? 'bg-emerald-500 text-white animate-pulse' :
                        test.status === 'completed' ? 'bg-slate-700 text-slate-300' :
                        'bg-blue-600 text-white'
                      }`}>
                        {test.status}
                      </span>
                      <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                        {test.totalQuestions} Questions
                      </span>
                    </div>
                    <h4 className="font-black text-white text-sm uppercase tracking-tight truncate">{test.title}</h4>
                    <div className="flex items-center gap-3 mt-1 opacity-60">
                      <div className="flex items-center gap-1 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                        <Calendar className="w-2.5 h-2.5" />
                        {test.date}
                      </div>
                      <div className="flex items-center gap-1 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                        <Clock className="w-2.5 h-2.5" />
                        {test.startTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {user.role === UserRole.ADMIN ? (
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setActiveMenu(test.id)}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null}
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectTest(test, user.role === UserRole.ADMIN ? 'TEST_BUILDER' : 'TEST_TAKER'); }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                      test.status === 'live' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/10 text-white'
                    }`}
                  >
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {activeMenu && (
          (() => {
            const test = tests.find(t => t.id === activeMenu);
            if (!test) return null;
            return (
              <ManagementOptionsScreen 
                title={test.title}
                subtitle={`${test.totalQuestions} Questions • ${test.date}`}
                onBack={() => setActiveMenu(null)}
                onEdit={() => { setEditingTest(test); setIsAdding(true); setActiveMenu(null); }}
                onDelete={() => { handleDelete(test.id); setActiveMenu(null); }}
                onAbout={() => { alert(`Test: ${test.title}\nStatus: ${test.status}\nQuestions: ${test.totalQuestions}`); setActiveMenu(null); }}
              />
            );
          })()
        )}
      </AnimatePresence>

      <AddTestPopup 
        isOpen={isAdding}
        onClose={() => { setIsAdding(false); setEditingTest(null); }}
        onConfirm={handleCreateOrUpdate}
        batches={batches}
        initialData={editingTest}
      />
    </div>
  );
};

export default TestsScreen;
