
import React from 'react';
import { Batch, User } from '../../types.ts';
import { CreditCard, TrendingUp, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

interface BatchFeesScreenProps {
  batch: Batch;
  user: User;
}

const BatchFeesScreen: React.FC<BatchFeesScreenProps> = ({ batch, user }) => {
  // Mock data
  const feeStats = {
    totalExpected: 450000,
    totalCollected: 320000,
    pending: 130000
  };

  const students = [
    { id: '1', name: 'Rahul Kumar', total: 15000, paid: 15000, status: 'paid' },
    { id: '2', name: 'Sneha Singh', total: 15000, paid: 8000, status: 'partial' },
    { id: '3', name: 'Amit Sharma', total: 15000, paid: 0, status: 'unpaid' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 grid grid-cols-3 gap-2">
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
          <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1">Total</p>
          <p className="text-xs font-black">₹4.5L</p>
        </div>
        <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
          <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1">Collected</p>
          <p className="text-xs font-black">₹3.2L</p>
        </div>
        <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-100">
          <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-1">Pending</p>
          <p className="text-xs font-black">₹1.3L</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        <div className="flex items-center justify-between py-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Ledger</h3>
          <button className="text-[9px] font-black text-blue-600 uppercase">Filter by Status</button>
        </div>

        {students.map((student) => (
          <div key={student.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-black text-sm border border-slate-100">
                {student.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{student.name}</h4>
                <div className="flex items-center gap-2">
                  <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                    student.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 
                    student.status === 'partial' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {student.status}
                  </span>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">₹{student.paid} / ₹{student.total}</p>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchFeesScreen;
