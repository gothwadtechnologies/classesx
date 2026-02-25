
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            className="relative bg-slate-900 w-full max-w-[320px] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/10">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">{title}</h3>
              <p className="text-slate-400 text-[10px] font-bold leading-relaxed px-2 uppercase tracking-wide">{message}</p>
            </div>
            
            <div className="flex p-4 gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white bg-rose-600 shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all active:scale-95"
              >
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
