
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({ 
  isOpen, onClose, onConfirm, title, message, loading 
}) => {
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
            className="relative w-full max-w-[300px] bg-white rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4 border border-rose-100">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                {message}
              </p>
            </div>
            
            <div className="flex border-t border-slate-100">
              <button 
                onClick={onClose}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 active:bg-slate-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-rose-600 border-l border-slate-100 active:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmPopup;
