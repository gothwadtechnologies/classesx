
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Check, Eye, EyeOff, BookOpen } from 'lucide-react';
import { Batch } from '../../types';

interface AddStudentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  batches: Batch[];
  loading?: boolean;
  initialData?: any | null;
}

const AddStudentPopup: React.FC<AddStudentPopupProps> = ({ isOpen, onClose, onConfirm, batches, loading, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    fatherName: '',
  });
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          password: '', // Don't show password for editing
          phone: initialData.phone || '',
          fatherName: initialData.fatherName || '',
        });
        setSelectedBatches(initialData.batchIds || []);
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          fatherName: '',
        });
        setSelectedBatches([]);
      }
    }
  }, [isOpen, initialData]);

  const toggleBatch = (batchId: string) => {
    if (selectedBatches.includes(batchId)) {
      setSelectedBatches(selectedBatches.filter(id => id !== batchId));
    } else {
      setSelectedBatches([...selectedBatches, batchId]);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.email) return;
    if (!initialData && !formData.password) return;
    
    const payload: any = { ...formData, batchIds: selectedBatches };
    if (initialData && !formData.password) {
      delete payload.password;
    }
    onConfirm(payload);
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[360px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {initialData ? 'Edit Student' : 'Add Student'}
                  </h3>
                </div>
                <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</p>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-blue-500 transition-all" 
                      placeholder="Student Name" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Father's Name (Optional)</p>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-blue-500 transition-all" 
                      placeholder="Father's Name" 
                      value={formData.fatherName} 
                      onChange={e => setFormData({...formData, fatherName: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile Number</p>
                    <input 
                      type="tel"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-blue-500 transition-all" 
                      placeholder="10-digit number" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</p>
                    <input 
                      type="email"
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-blue-500 transition-all" 
                      placeholder="student@example.com" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                    {initialData ? 'New Password (Leave blank to keep current)' : 'Create Password'}
                  </p>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-xs outline-none text-slate-900 focus:border-blue-500 transition-all pr-10" 
                      placeholder={initialData ? "Optional" : "Min 6 characters"} 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Batch Allocation */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Assign Batches</p>
                  <div className="grid grid-cols-1 gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                    {batches.map(batch => (
                      <button 
                        key={batch.id}
                        onClick={() => toggleBatch(batch.id)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${
                          selectedBatches.includes(batch.id) 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className={`w-3 h-3 ${selectedBatches.includes(batch.id) ? 'text-blue-200' : 'text-slate-400'}`} />
                          <span>{batch.name}</span>
                        </div>
                        {selectedBatches.includes(batch.id) && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={handleSubmit} 
                disabled={loading || !formData.name || !formData.phone || !formData.email || (!initialData && formData.password.length < 6)} 
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  initialData ? 'Update Student' : 'Register Student'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddStudentPopup;
