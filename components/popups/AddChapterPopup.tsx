
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Calendar, Edit3, Plus } from 'lucide-react';

interface AddChapterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { title: string; startDate: string }) => void;
  loading?: boolean;
  initialData?: { title: string; startDate: string } | null;
}

const AddChapterPopup: React.FC<AddChapterPopupProps> = ({ isOpen, onClose, onConfirm, loading, initialData }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title);
      setStartDate(initialData.startDate || '');
    } else if (!initialData && isOpen) {
      setTitle('');
      setStartDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onConfirm({ title, startDate });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
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
            className="relative w-full max-w-[340px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
                    {initialData ? <Edit3 className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {initialData ? 'Edit Module' : 'New Module'}
                  </h3>
                </div>
                <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Module Title</p>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-emerald-500 transition-all" 
                      placeholder="e.g. Kinematics" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Starting Date</p>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-emerald-500 transition-all" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={handleSubmit} 
                disabled={loading || !title.trim()} 
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  initialData ? 'Update Module' : 'Create Module'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddChapterPopup;
