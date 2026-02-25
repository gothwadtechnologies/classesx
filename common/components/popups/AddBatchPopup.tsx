
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, BookOpen, Users, Check, Layers } from 'lucide-react';
import { Batch, ClassLevel } from '../../types';

interface AddBatchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (batchData: Partial<Batch>) => void;
  initialData?: Batch | null;
}

const SUBJECTS = ['Physics', 'Chemistry', 'Biology', 'Mathematics'];

const AddBatchPopup: React.FC<AddBatchPopupProps> = ({ isOpen, onClose, onConfirm, initialData }) => {
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(ClassLevel.CLASS_10);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setClassLevel(initialData.classLevel || ClassLevel.CLASS_10);
        setSelectedSubjects(initialData.subjects || []);
        setDescription(initialData.description || '');
      } else {
        setName('');
        setClassLevel(ClassLevel.CLASS_10);
        setSelectedSubjects([]);
        setDescription('');
      }
    }
  }, [isOpen, initialData]);

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedSubjects.length === 0) return;
    
    onConfirm({
      name,
      classLevel,
      subjects: selectedSubjects,
      description,
      studentIds: initialData?.studentIds || [],
      teacherIds: initialData?.teacherIds || [],
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-[360px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {initialData ? 'Edit Batch' : 'Create Batch'}
                  </h3>
                </div>
                <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Batch Name</p>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Morning Warriors"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Class Level</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(ClassLevel).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setClassLevel(level)}
                        className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tight border transition-all ${
                          classLevel === level 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Select Subjects</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SUBJECTS.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => toggleSubject(subject)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tight border transition-all ${
                          selectedSubjects.includes(subject) 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <span>{subject}</span>
                        {selectedSubjects.includes(subject) && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Description (Optional)</p>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief details about the batch..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleSubmit}
                disabled={!name || selectedSubjects.length === 0}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
              >
                {initialData ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {initialData ? 'Update Batch' : 'Create Batch'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddBatchPopup;
