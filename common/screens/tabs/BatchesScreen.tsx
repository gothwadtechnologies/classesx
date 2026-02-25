
import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, ChevronRight, BookOpen as BookIcon, Trash2, Edit3, MoreVertical, Calendar, Users, Settings } from 'lucide-react';
import { User, UserRole, Batch, ClassLevel } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { BRANDING_FOOTER } from '../../constants';
import { useAdminView } from '../../context/AdminViewContext';
import AddBatchPopup from '../../components/popups/AddBatchPopup';
import DeleteConfirmPopup from '../../components/popups/DeleteConfirmPopup';
import { motion, AnimatePresence } from 'motion/react';

interface BatchesScreenProps {
  user: User;
  onSelectBatch: (batch: Batch) => void;
  searchQuery?: string;
}

const BatchesScreen: React.FC<BatchesScreenProps> = ({ user, onSelectBatch, searchQuery = '' }) => {
  const { isAdminViewMode } = useAdminView();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState<Batch | null>(null);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'batches'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Batch)));
    });
    return unsubscribe;
  }, []);

  const handleConfirmBatch = async (data: Partial<Batch>) => {
    setIsLoading(true);
    try {
      if (batchToEdit) {
        await updateDoc(doc(db, 'batches', batchToEdit.id), {
          ...data,
        });
        setBatchToEdit(null);
      } else {
        await addDoc(collection(db, 'batches'), {
          ...data,
          instructor: user.name,
          studentIds: [], 
          createdAt: serverTimestamp()
        });
        setIsAddingBatch(false);
      }
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'batches', batchToDelete.id));
      setBatchToDelete(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBatches = batches.filter(b => 
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.classLevel || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.subject || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Available Batches</h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{BRANDING_FOOTER} Academy</p>
        </div>
        {user.role === UserRole.ADMIN && isAdminViewMode && (
          <button 
            onClick={() => setIsAddingBatch(true)}
            className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20 active:scale-90 transition-all"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="bg-blue-50 px-4 py-3 rounded-2xl flex items-center justify-between border border-blue-100 mx-2">
          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Matches found: {filteredBatches.length}</p>
        </div>
      )}

      <div className="space-y-6 pb-32">
        {filteredBatches.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mb-4">
              <LayoutGrid className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">No batches found</p>
          </div>
        ) : (
          filteredBatches.map((batch) => {
            return (
              <motion.div 
                layout
                key={batch.id} 
                onClick={() => onSelectBatch(batch)}
                className="group bg-slate-900 rounded-[2rem] p-5 shadow-2xl shadow-slate-900/40 relative border border-white/5 cursor-pointer active:scale-[0.98] transition-all"
              >
                {/* Android Style Background Accent Container */}
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 rounded-full bg-blue-500 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 -ml-8 -mb-8 rounded-full bg-sky-400 opacity-[0.05] blur-2xl" />
                </div>
                
                {/* Header: Icon, Info, and Actions */}
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-white/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <BookIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[7px] font-black px-2 py-0.5 bg-blue-600 text-white rounded-md uppercase tracking-widest shadow-lg shadow-blue-600/20">
                          {batch.classLevel}
                        </span>
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                          {batch.subjects?.length || 0} Subjects
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight truncate leading-none">
                        {batch.name}
                      </h4>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">Instructor: {batch.instructor || 'Staff'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {user.role === UserRole.ADMIN && isAdminViewMode ? (
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === batch.id ? null : batch.id)}
                          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        <AnimatePresence>
                          {activeMenuId === batch.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9, x: 10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: 10 }}
                                className="absolute right-0 top-full mt-2 w-32 bg-sky-500 rounded-2xl shadow-2xl border border-white/20 py-1.5 z-[100] overflow-hidden"
                              >
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setBatchToEdit(batch); setActiveMenuId(null); }}
                                  className="w-full px-3 py-2.5 text-left flex items-center gap-2.5 hover:bg-white/10 transition-colors border-b border-white/5"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-white" />
                                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Edit</span>
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setBatchToDelete(batch); setActiveMenuId(null); }}
                                  className="w-full px-3 py-2.5 text-left flex items-center gap-2.5 hover:bg-rose-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-white" />
                                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Delete</span>
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : null}

                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectBatch(batch); }}
                      className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center active:scale-90 transition-all"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {batch.description && (
                  <div className="relative z-10">
                    <p className="text-slate-400 text-[10px] font-bold leading-relaxed line-clamp-2 opacity-80">
                      {batch.description}
                    </p>
                  </div>
                )}

                {/* Stats & Info */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shadow-sm">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Starts On</p>
                      <p className="text-[9px] font-black text-white uppercase">{batch.startDate || 'TBA'}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shadow-sm">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Students</p>
                      <p className="text-[9px] font-black text-white uppercase">{batch.studentIds?.length || 0} Total</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AddBatchPopup 
        isOpen={isAddingBatch || !!batchToEdit}
        onClose={() => { setIsAddingBatch(false); setBatchToEdit(null); }}
        onConfirm={handleConfirmBatch}
        initialData={batchToEdit}
      />

      <DeleteConfirmPopup 
        isOpen={!!batchToDelete}
        onClose={() => setBatchToDelete(null)}
        onConfirm={handleDeleteBatch}
        title="Delete Batch?"
        message={`Are you sure you want to permanently delete ${batchToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default BatchesScreen;
