
import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Edit3, Trash2, Info, ChevronRight, Settings } from 'lucide-react';

export interface ManagementOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'danger' | 'default';
  description?: string;
}

interface ManagementOptionsScreenProps {
  title: string;
  subtitle?: string;
  options?: ManagementOption[]; // Optional: if not provided, use default Edit/Delete/About
  onEdit?: () => void;
  onDelete?: () => void;
  onAbout?: () => void;
  onBack: () => void;
}

const ManagementOptionsScreen: React.FC<ManagementOptionsScreenProps> = ({ 
  title, 
  subtitle, 
  options,
  onEdit,
  onDelete,
  onAbout,
  onBack 
}) => {
  
  // Default options if none provided
  const defaultOptions: ManagementOption[] = [
    {
      id: 'edit',
      label: 'Edit Details',
      description: 'Modify information and settings',
      icon: <Edit3 className="w-5 h-5" />,
      onClick: onEdit || (() => {}),
      variant: 'default' as const,
    },
    {
      id: 'about',
      label: 'About',
      description: 'View detailed information',
      icon: <Info className="w-5 h-5" />,
      onClick: onAbout || (() => {}),
      variant: 'default' as const,
    },
    {
      id: 'delete',
      label: 'Delete',
      description: 'Permanently remove this item',
      icon: <Trash2 className="w-5 h-5" />,
      onClick: onDelete || (() => {}),
      variant: 'danger' as const,
    }
  ].filter(opt => {
    if (opt.id === 'edit') return !!onEdit;
    if (opt.id === 'delete') return !!onDelete;
    if (opt.id === 'about') return !!onAbout;
    return true;
  });

  const displayOptions = options || defaultOptions;

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col"
    >
      {/* Sky Blue Header */}
      <div className="bg-sky-500 px-4 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-md">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white transition-colors active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black text-white uppercase tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[10px] font-bold text-sky-100 uppercase tracking-widest truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* Options List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <div className="px-2 mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management Options</p>
        </div>

        {displayOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              option.onClick();
              // We don't automatically call onBack here to let the parent decide
            }}
            className={`w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all active:scale-[0.98] text-left group relative overflow-hidden ${
              option.variant === 'danger' 
                ? 'bg-rose-50 border border-rose-100' 
                : 'bg-white border border-slate-100 shadow-sm'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${
              option.variant === 'danger' 
                ? 'bg-rose-500 text-white' 
                : 'bg-sky-500 text-white'
            }`}>
              {option.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-black uppercase tracking-tight ${
                option.variant === 'danger' ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {option.label}
              </h4>
              {option.description && (
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {option.description}
                </p>
              )}
            </div>

            <ChevronRight className={`w-5 h-5 ${
              option.variant === 'danger' ? 'text-rose-300' : 'text-slate-300'
            }`} />
          </button>
        ))}

        {/* Footer Info */}
        <div className="mt-10 p-6 bg-slate-100 rounded-[2.5rem] border border-slate-200 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Settings className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
            Select an action to manage this item. Changes are applied immediately to the database.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagementOptionsScreen;
