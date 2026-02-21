
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Edit3 } from 'lucide-react';
import { ClassLevel } from '../../types';

interface AddBatchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; classLevel: ClassLevel; subjects: string[] }) => void;
  loading?: boolean;
  initialData?: { name: string; classLevel: ClassLevel; subjects: string[] } | null;
}

const SUBJECTS = ['Maths', 'Physics', 'Chemistry', 'Biology'];
const CLASSES: ClassLevel[] = ['9th', '10th', '11th', '12th', 'Dropper'];

const AddBatchPopup: React.FC<AddBatchPopupProps> = ({ isOpen, onClose, onConfirm, loading, initialData }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('10th');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Maths', 'Physics', 'Chemistry']);

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || '');
      setSelectedClass(initialData.classLevel || '10th');
      setSelectedSubjects(initialData.subjects || ['Maths', 'Physics', 'Chemistry']);
    } else if (!initialData && isOpen) {
      setName('');
      setSelectedClass('10th');
      setSelectedSubjects(['Maths', 'Physics', 'Chemistry']);
    }
  }, [initialData, isOpen]);

  const toggleSubject = (sub: string) => {
    const currentSubjects = selectedSubjects || [];
    if (currentSubjects.includes(sub)) {
      setSelectedSubjects(currentSubjects.filter(s => s !== sub));
    } else {
      setSelectedSubjects([...currentSubjects, sub]);
    }
  };

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm({ name: name.toUpperCase(), classLevel: selectedClass, subjects: selectedSubjects });
    setName('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[320px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 border border-sky-100">
                    {initialData ? <Edit3 className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {initialData ? 'Edit Batch' : 'New Batch'}
                  </h3>
                </div>
                <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Batch Name</p>
                  <input 
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-black text-xs outline-none text-slate-900 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 transition-all" 
                    placeholder="E.G. TARGET 2026" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Class Level</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CLASSES.map(lvl => (
                      <button 
                        key={lvl}
                        onClick={() => setSelectedClass(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                          selectedClass === lvl ? 'bg-sky-500 border-sky-400 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Subjects</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SUBJECTS.map(sub => (
                      <button 
                        key={sub}
                        onClick={() => toggleSubject(sub)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                          (selectedSubjects || []).includes(sub) ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {sub}
                        {(selectedSubjects || []).includes(sub) && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={handleConfirm} 
                disabled={loading || !name.trim()} 
                className="w-full bg-sky-500 text-white font-black py-3.5 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-sky-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  initialData ? 'Update Batch' : 'Create Batch'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddBatchPopup;
