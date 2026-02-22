
import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, ChevronRight, BookOpen as BookIcon, Trash2, Edit3, MoreVertical } from 'lucide-react';
import { User, UserRole, Batch, ClassLevel } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { BRANDING_FOOTER } from '../../constants';
import { useAdminView } from '../../context/AdminViewContext';
import AddBatchPopup from '../../components/popups/AddBatchPopup';
import DeleteConfirmPopup from '../../components/popups/DeleteConfirmPopup';

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

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'batches'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Batch)));
    });
    return unsubscribe;
  }, []);

  const handleConfirmBatch = async (data: { name: string; classLevel: ClassLevel; subjects: string[] }) => {
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
    (b.classLevel || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 bg-white min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Available Batches</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Managed By {BRANDING_FOOTER}</p>
        </div>
        {user.role === UserRole.ADMIN && isAdminViewMode && (
          <button 
            onClick={() => setIsAddingBatch(true)}
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm active:scale-90 transition-all"
          >
            <Plus className="w-6 h-6 text-sky-400" />
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="bg-sky-50 px-4 py-2 rounded-xl flex items-center justify-between border border-sky-100">
          <p className="text-[8px] font-black text-sky-600 uppercase tracking-widest">Matches found: {filteredBatches.length}</p>
        </div>
      )}

      <div className="space-y-4 pb-32">
        {filteredBatches.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <LayoutGrid className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">No batches found</p>
          </div>
        ) : (
          filteredBatches.map((batch, index) => {
            return (
              <div 
                key={batch.id} 
                className="bg-slate-900 border border-slate-800 p-5 rounded-[2.5rem] flex flex-col gap-4 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
              >
                {/* Header: Icon, Class Badge, and Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
                      <BookIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full uppercase tracking-widest border border-sky-500/30">
                          {batch.classLevel}
                        </span>
                        <span className="text-[8px] font-black px-2 py-0.5 bg-white/5 text-slate-400 rounded-full uppercase tracking-widest border border-white/5">
                          ID: {batch.id.slice(-4)}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight truncate leading-none">
                        {batch.name}
                      </h4>
                    </div>
                  </div>
                  
                  {user.role === UserRole.ADMIN && isAdminViewMode && (
                    <button className="p-2 text-slate-500 hover:text-white transition-colors active:scale-90">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Content: Subjects */}
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Academic Core</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(batch.subjects || ['Mathematics', 'Physics', 'Chemistry']).map((sub, sIdx) => (
                      <span key={sIdx} className="text-[9px] font-bold text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: View Button and Management Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {user.role === UserRole.ADMIN && isAdminViewMode && (
                      <>
                        <button 
                          onClick={() => setBatchToDelete(batch)}
                          className="w-9 h-9 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20 active:bg-rose-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setBatchToEdit(batch)}
                          className="w-9 h-9 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center border border-sky-500/20 active:bg-sky-500/20 transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => onSelectBatch(batch)}
                    className="flex items-center gap-2 bg-sky-500 text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                  >
                    {isAdminViewMode ? 'Manage Batch' : 'View Batch'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddBatchPopup 
        isOpen={isAddingBatch || !!batchToEdit}
        onClose={() => { setIsAddingBatch(false); setBatchToEdit(null); }}
        onConfirm={handleConfirmBatch}
        loading={isLoading}
        initialData={batchToEdit ? { name: batchToEdit.name, classLevel: batchToEdit.classLevel, subjects: batchToEdit.subjects } : null}
      />

      <DeleteConfirmPopup 
        isOpen={!!batchToDelete}
        onClose={() => setBatchToDelete(null)}
        onConfirm={handleDeleteBatch}
        title="Delete Batch?"
        message={`Are you sure you want to permanently delete ${batchToDelete?.name}? This action cannot be undone.`}
        loading={isLoading}
      />
    </div>
  );
};

export default BatchesScreen;
