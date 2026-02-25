
import React, { useState, useEffect } from 'react';
import { Batch, GlobalSettings, User, UserRole, Chapter, Lecture } from '../types.ts';
import { db } from '../firebase.ts';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import VideoPlayer from '../VideoPlayer.tsx';
import { useAdminView } from '../context/AdminViewContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  FileText, 
  BarChart3, 
  History, 
  CalendarCheck, 
  CreditCard, 
  ChevronRight,
  Plus,
  Play,
  FileCode,
  LayoutGrid,
  MoreVertical,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Eye
} from 'lucide-react';

// Import new batch management screens
import BatchStudentsScreen from './batch-management/BatchStudentsScreen.tsx';
import BatchTestsScreen from './batch-management/BatchTestsScreen.tsx';
import BatchResultsScreen from './batch-management/BatchResultsScreen.tsx';
import BatchPYQScreen from './batch-management/BatchPYQScreen.tsx';
import BatchAttendanceScreen from './batch-management/BatchAttendanceScreen.tsx';
import BatchFeesScreen from './batch-management/BatchFeesScreen.tsx';

// Import new popups
import AddChapterPopup from '../components/popups/AddChapterPopup.tsx';
import AddLecturePopup from '../components/popups/AddLecturePopup.tsx';
import DeleteConfirmPopup from '../components/popups/DeleteConfirmPopup.tsx';

type ViewState = 'MAIN' | 'SUBJECTS' | 'CHAPTERS' | 'LECTURES' | 'LECTURE_MANAGE' | 'LECTURE_WATCH' | 'STUDENTS' | 'TESTS' | 'RESULTS' | 'PYQS' | 'ATTENDANCE' | 'FEES';

const BatchDetailsScreen: React.FC<{batch: Batch, settings: GlobalSettings, user: User, onBack: () => void}> = ({ batch, settings, user, onBack }) => {
  const { isAdminViewMode } = useAdminView();
  const [currentView, setCurrentView] = useState<ViewState>('MAIN');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  
  // Chapter management state
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [chapterToEdit, setChapterToEdit] = useState<Chapter | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  
  // Lecture management state
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [lectureToEdit, setLectureToEdit] = useState<Lecture | null>(null);
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const isAdmin = user.role === UserRole.ADMIN && isAdminViewMode;

  useEffect(() => {
    if (currentView === 'CHAPTERS' && selectedSubject) {
      const q = query(collection(db, 'batches', batch.id, 'subjects', selectedSubject, 'chapters'), orderBy('createdAt', 'asc'));
      const unsub = onSnapshot(q, snap => setChapters(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chapter))));
      return unsub;
    }
  }, [currentView, selectedSubject, batch.id]);

  useEffect(() => {
    if ((currentView === 'LECTURES' || currentView === 'LECTURE_WATCH') && selectedChapter && selectedSubject) {
      const q = query(collection(db, 'batches', batch.id, 'subjects', selectedSubject, 'chapters', selectedChapter.id, 'lectures'), orderBy('createdAt', 'asc'));
      const unsub = onSnapshot(q, snap => setLectures(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lecture))));
      return unsub;
    }
  }, [currentView, selectedChapter, selectedSubject, batch.id]);

  const handleConfirmChapter = async (data: { title: string; startDate: string }) => {
    setIsLoading(true);
    try {
      if (chapterToEdit) {
        await updateDoc(doc(db, 'batches', batch.id, 'subjects', selectedSubject, 'chapters', chapterToEdit.id), {
          ...data
        });
        setChapterToEdit(null);
      } else {
        await addDoc(collection(db, 'batches', batch.id, 'subjects', selectedSubject, 'chapters'), {
          ...data,
          createdAt: serverTimestamp()
        });
        setIsAddingChapter(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChapter = async () => {
    if (!chapterToDelete) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'batches', batch.id, 'subjects', selectedSubject, 'chapters', chapterToDelete.id));
      setChapterToDelete(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLecture = async (data: any) => {
    if (!selectedChapter) return;
    setIsLoading(true);
    try {
      if (lectureToEdit) {
        await updateDoc(doc(db, 'batches', batch.id, 'subjects', selectedSubject, 'chapters', selectedChapter.id, 'lectures', lectureToEdit.id), {
          ...data
        });
        setLectureToEdit(null);
      } else {
        await addDoc(collection(db, 'batches', batch.id, 'subjects', selectedSubject, 'chapters', selectedChapter.id, 'lectures'), {
          ...data,
          createdAt: serverTimestamp()
        });
        setIsAddingLecture(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLecture = async () => {
    if (!lectureToDelete || !selectedChapter) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'batches', batch.id, 'subjects', selectedSubject, 'chapters', selectedChapter.id, 'lectures', lectureToDelete.id));
      setLectureToDelete(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateBack = () => {
    if (currentView === 'LECTURE_WATCH' || currentView === 'LECTURE_MANAGE') setCurrentView('LECTURES');
    else if (currentView === 'LECTURES') setCurrentView('CHAPTERS');
    else if (currentView === 'CHAPTERS') setCurrentView('SUBJECTS');
    else if (currentView === 'SUBJECTS' || currentView === 'STUDENTS' || currentView === 'TESTS' || currentView === 'RESULTS' || currentView === 'PYQS' || currentView === 'ATTENDANCE' || currentView === 'FEES') setCurrentView('MAIN');
    else onBack();
  };

  const menuOptions = [
    { id: 'SUBJECTS', label: 'Curriculum', desc: 'Chapters & Lectures', icon: <BookOpen className="w-5 h-5" />, color: 'bg-blue-600' },
    { id: 'STUDENTS', label: 'Students', desc: 'Batch Directory', icon: <Users className="w-5 h-5" />, color: 'bg-indigo-600' },
    { id: 'TESTS', label: 'Tests', desc: 'Mock & Practice', icon: <FileText className="w-5 h-5" />, color: 'bg-rose-600' },
    { id: 'RESULTS', label: 'Results', desc: 'Performance Analytics', icon: <BarChart3 className="w-5 h-5" />, color: 'bg-emerald-600' },
    { id: 'PYQS', label: 'PYQs', desc: 'Previous Year Papers', icon: <History className="w-5 h-5" />, color: 'bg-amber-600' },
    { id: 'ATTENDANCE', label: 'Attendance', desc: 'Daily Tracking', icon: <CalendarCheck className="w-5 h-5" />, color: 'bg-violet-600' },
    { id: 'FEES', label: 'Fees', desc: 'Payment Records', icon: <CreditCard className="w-5 h-5" />, color: 'bg-slate-900' },
  ];

  const getSubjectIcon = (sub: string) => {
    const s = sub.toLowerCase();
    if (s.includes('math')) return '📐';
    if (s.includes('physic')) return '⚛️';
    if (s.includes('chemist')) return '🧪';
    if (s.includes('biolog')) return '🧬';
    return '📚';
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
      <div className="p-4 bg-blue-800 border-b border-blue-900 flex items-center gap-4 shrink-0 shadow-lg">
        <button onClick={navigateBack} className="p-2 bg-white/10 backdrop-blur-md rounded-xl transition-all active:scale-90 text-white border border-white/10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-black text-white tracking-tight truncate uppercase leading-none">
            {currentView === 'MAIN' ? batch.name : currentView}
          </h2>
          <p className="text-[8px] font-bold text-blue-200 uppercase tracking-widest truncate mt-1.5">Batch Navigator</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide p-4 space-y-4 pb-10">
        {currentView === 'MAIN' && (
          <div className="grid grid-cols-1 gap-3">
            {menuOptions.map((opt) => (
              <button 
                key={opt.id} 
                onClick={() => setCurrentView(opt.id as ViewState)}
                className={`${opt.color} p-5 rounded-[2.5rem] shadow-lg shadow-slate-200 flex items-center gap-5 active:scale-[0.98] transition-all text-left relative overflow-hidden group`}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white border border-white/10 shrink-0">
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{opt.label}</h4>
                  <p className="text-white/60 text-[8px] font-black uppercase tracking-[0.2em] mt-1">{opt.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </button>
            ))}
          </div>
        )}

        {currentView === 'SUBJECTS' && (
          <div className="grid grid-cols-1 gap-3">
            {batch.subjects.map(sub => (
              <button 
                key={sub} 
                onClick={() => { setSelectedSubject(sub); setCurrentView('CHAPTERS'); }} 
                className="w-full bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-xl shadow-slate-200 flex items-center gap-5 transition-all active:scale-[0.98] text-left group relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                <div className="w-14 h-14 bg-white/10 text-white rounded-[1.5rem] flex items-center justify-center text-2xl border border-white/10 shrink-0 shadow-inner">
                  {getSubjectIcon(sub)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-white text-sm truncate uppercase tracking-tight leading-none mb-2">{sub}</h4>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Explore Curriculum</p>
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/30 group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            ))}
          </div>
        )}

        {currentView === 'STUDENTS' && <BatchStudentsScreen batch={batch} user={user} />}
        {currentView === 'TESTS' && <BatchTestsScreen batch={batch} user={user} />}
        {currentView === 'RESULTS' && <BatchResultsScreen batch={batch} user={user} />}
        {currentView === 'PYQS' && <BatchPYQScreen batch={batch} user={user} />}
        {currentView === 'ATTENDANCE' && <BatchAttendanceScreen batch={batch} user={user} />}
        {currentView === 'FEES' && <BatchFeesScreen batch={batch} user={user} />}

        {currentView === 'CHAPTERS' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedSubject} Modules</p>
              {isAdmin && (
                <button 
                  onClick={() => setIsAddingChapter(true)} 
                  className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100"
                >
                  <Plus className="w-3 h-3" />
                  Add Module
                </button>
              )}
            </div>
            
            {chapters.map((ch, idx) => {
              const colors = [
                'bg-emerald-600 shadow-emerald-100',
                'bg-indigo-600 shadow-indigo-100',
                'bg-violet-600 shadow-violet-100',
                'bg-blue-600 shadow-blue-100'
              ];
              const colorClass = colors[idx % colors.length];
              
              return (
                <div key={ch.id} className="relative">
                  <button 
                    onClick={() => { setSelectedChapter(ch); setCurrentView('LECTURES'); }} 
                    className={`w-full ${colorClass} p-5 rounded-[2.5rem] shadow-lg flex items-center gap-4 active:scale-[0.98] transition-all text-left group relative overflow-hidden`}
                  >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                    <div className="w-10 h-10 bg-white/20 text-white rounded-xl flex items-center justify-center text-lg border border-white/10 shrink-0">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-white text-xs truncate uppercase tracking-tight leading-none mb-1.5">{ch.title}</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-white/60" />
                        <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Starts: {ch.startDate || 'TBA'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === ch.id ? null : ch.id); }}
                            className="p-2 text-white/60 hover:text-white transition-colors active:scale-90"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <AnimatePresence>
                            {activeMenuId === ch.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                  className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                                >
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setChapterToEdit(ch); setActiveMenuId(null); }}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 hover:bg-slate-50 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Edit</span>
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setChapterToDelete(ch); setActiveMenuId(null); }}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 hover:bg-rose-50 transition-colors border-t border-slate-50"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Delete</span>
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {currentView === 'LECTURES' && (
           <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lectures Log</p>
                {isAdmin && (
                  <button 
                    onClick={() => setIsAddingLecture(true)} 
                    className="flex items-center gap-1 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-100"
                  >
                    <Plus className="w-3 h-3" />
                    Add Lecture
                  </button>
                )}
              </div>
              {lectures.map((lec, idx) => {
                const colors = [
                  'bg-rose-600 shadow-rose-100',
                  'bg-blue-600 shadow-blue-100',
                  'bg-amber-600 shadow-amber-100',
                  'bg-slate-900 shadow-slate-200'
                ];
                const colorClass = colors[idx % colors.length];

                return (
                  <div key={lec.id} className={`p-4 rounded-[2rem] ${colorClass} shadow-lg flex items-center gap-4 relative group overflow-hidden`}>
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                    <div className="w-12 h-12 bg-white/20 text-white rounded-[1.25rem] flex flex-col items-center justify-center border border-white/10 shrink-0 shadow-lg">
                      <span className="text-[8px] font-black uppercase leading-none opacity-60">LEC</span>
                      <span className="text-lg font-black leading-none">{idx+1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-white text-xs truncate uppercase tracking-tight leading-none mb-1.5">{lec.topicName}</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[8px] text-white/60 font-black uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          {lec.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <div className="relative">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === lec.id ? null : lec.id)}
                            className="p-2 text-white/60 hover:text-white transition-colors active:scale-90"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <AnimatePresence>
                            {activeMenuId === lec.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)} />
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                  className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                                >
                                  <button 
                                    onClick={() => { setLectureToEdit(lec); setActiveMenuId(null); }}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 hover:bg-slate-50 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Edit</span>
                                  </button>
                                  <button 
                                    onClick={() => { setLectureToDelete(lec); setActiveMenuId(null); }}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 hover:bg-rose-50 transition-colors border-t border-slate-50"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Delete</span>
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                      <button 
                        onClick={() => { setSelectedLecture(lec); setCurrentView('LECTURE_WATCH'); }} 
                        className="bg-white text-slate-900 text-[9px] font-black px-4 py-2.5 rounded-xl uppercase shadow-lg active:scale-90 transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Watch
                      </button>
                    </div>
                  </div>
                );
              })}
           </div>
        )}

        {currentView === 'LECTURE_WATCH' && selectedLecture && (
           <div className="-mx-4 -mt-4 bg-slate-50 flex flex-col min-h-full">
              <VideoPlayer url={selectedLecture.youtubeUrl} title={selectedLecture.topicName} />
              <div className="p-4 space-y-4">
                 <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight leading-tight">{selectedLecture.topicName}</h3>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Recorded: {selectedLecture.date}</p>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                    <button className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📄</div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Notes</span>
                    </button>
                    <button className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all">
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-xl">📝</div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">DPP</span>
                    </button>
                    <button className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 flex flex-col items-center gap-2 active:scale-95 transition-all">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🎯</div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-white">Test</span>
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Popups */}
      <AddChapterPopup 
        isOpen={isAddingChapter || !!chapterToEdit}
        onClose={() => { setIsAddingChapter(false); setChapterToEdit(null); }}
        onConfirm={handleConfirmChapter}
        loading={isLoading}
        initialData={chapterToEdit ? { title: chapterToEdit.title, startDate: chapterToEdit.startDate || '' } : null}
      />

      <AddLecturePopup 
        isOpen={isAddingLecture || !!lectureToEdit}
        onClose={() => { setIsAddingLecture(false); setLectureToEdit(null); }}
        onConfirm={handleConfirmLecture}
        loading={isLoading}
        initialData={lectureToEdit}
      />

      <DeleteConfirmPopup 
        isOpen={!!chapterToDelete}
        onClose={() => setChapterToDelete(null)}
        onConfirm={handleDeleteChapter}
        title="Delete Module"
        message={`Are you sure you want to delete "${chapterToDelete?.title}"? This will remove all lectures inside.`}
        loading={isLoading}
      />

      <DeleteConfirmPopup 
        isOpen={!!lectureToDelete}
        onClose={() => setLectureToDelete(null)}
        onConfirm={handleDeleteLecture}
        title="Delete Lecture"
        message={`Are you sure you want to delete "${lectureToDelete?.topicName}"?`}
        loading={isLoading}
      />
    </div>
  );
};

export default BatchDetailsScreen;
