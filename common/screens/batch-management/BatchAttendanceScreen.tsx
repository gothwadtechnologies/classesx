
import React, { useState } from 'react';
import { Batch, User, UserRole } from '../../types.ts';
import { CalendarCheck, ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react';
import { useAdminView } from '../../context/AdminViewContext.tsx';

interface BatchAttendanceScreenProps {
  batch: Batch;
  user: User;
}

const BatchAttendanceScreen: React.FC<BatchAttendanceScreenProps> = ({ batch, user }) => {
  const { isAdminViewMode } = useAdminView();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Mock data for students
  const students = [
    { id: '1', name: 'Rahul Kumar', status: 'present' },
    { id: '2', name: 'Sneha Singh', status: 'absent' },
    { id: '3', name: 'Amit Sharma', status: 'present' },
    { id: '4', name: 'Priya Verma', status: 'late' },
  ];

  const isAdmin = user.role === UserRole.ADMIN && isAdminViewMode;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-1 text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Attendance Sheet</span>
          </div>
          <button className="p-1 text-slate-400"><ChevronRight className="w-4 h-4" /></button>
        </div>
        {isAdmin && (
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
            Save All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {students.map((student) => (
          <div key={student.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-black text-sm border border-slate-100">
                {student.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{student.name}</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Roll No: 0{student.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                disabled={!isAdmin}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${student.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'}`}
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                disabled={!isAdmin}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${student.status === 'absent' ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-300'}`}
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                disabled={!isAdmin}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${student.status === 'late' ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-300'}`}
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchAttendanceScreen;
