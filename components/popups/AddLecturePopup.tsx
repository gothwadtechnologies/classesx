
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Calendar, Edit3, Plus, Link, FileText } from 'lucide-react';

interface AddLecturePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading?: boolean;
  initialData?: any | null;
}

const AddLecturePopup: React.FC<AddLecturePopupProps> = ({ isOpen, onClose, onConfirm, loading, initialData }) => {
  const [formData, setFormData] = useState({
    topicName: '',
    date: '',
    youtubeUrl: '',
    notesUrl: '',
    dppUrl: '',
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        topicName: initialData.topicName || '',
        date: initialData.date || '',
        youtubeUrl: initialData.youtubeUrl || '',
        notesUrl: initialData.notesUrl || '',
        dppUrl: initialData.dppUrl || '',
      });
    } else if (!initialData && isOpen) {
      setFormData({
        topicName: '',
        date: new Date().toISOString().split('T')[0],
        youtubeUrl: '',
        notesUrl: '',
        dppUrl: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!formData.topicName.trim() || !formData.date) return;
    onConfirm(formData);
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
            className="relative w-full max-w-[360px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
              <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 border border-rose-100">
                    {initialData ? <Edit3 className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {initialData ? 'Edit Lecture' : 'New Lecture'}
                  </h3>
                </div>
                <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Lecture Topic</p>
                  <div className="relative">
                    <Play className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-rose-500 transition-all" 
                      placeholder="e.g. Newton's First Law" 
                      value={formData.topicName} 
                      onChange={e => setFormData({...formData, topicName: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Lecture Date</p>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-rose-500 transition-all" 
                      value={formData.date} 
                      onChange={e => setFormData({...formData, date: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">YouTube URL</p>
                  <div className="relative">
                    <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-rose-500 transition-all" 
                      placeholder="https://youtube.com/watch?v=..." 
                      value={formData.youtubeUrl} 
                      onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Notes Link</p>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-rose-500 transition-all" 
                      placeholder="PDF URL" 
                      value={formData.notesUrl} 
                      onChange={e => setFormData({...formData, notesUrl: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">DPP Link</p>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-rose-500 transition-all" 
                      placeholder="PDF URL" 
                      value={formData.dppUrl} 
                      onChange={e => setFormData({...formData, dppUrl: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={handleSubmit} 
                disabled={loading || !formData.topicName.trim() || !formData.date} 
                className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  initialData ? 'Update Lecture' : 'Create Lecture'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddLecturePopup;
