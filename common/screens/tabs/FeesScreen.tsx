
import React from 'react';
import { User, FeeRecord } from '../../types';

const MOCK_FEES: FeeRecord = {
  total: 25000,
  paid: 15000,
  history: [{ amount: 10000, date: '05 Dec', method: 'UPI' }, { amount: 5000, date: '28 Nov', method: 'UPI' }]
};

const FeesScreen: React.FC<{ user: User }> = () => {
  const pending = MOCK_FEES.total - MOCK_FEES.paid;

  return (
    <div className="p-4 space-y-5">
      <div className="bg-gray-900 p-6 rounded-2xl shadow-xl text-center relative overflow-hidden">
        <p className="text-rose-400 text-[9px] font-black uppercase tracking-widest mb-1">Pending Balance</p>
        <h2 className="text-3xl font-black text-white tracking-tight italic">₹{pending.toLocaleString()}</h2>
        
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="text-left"><p className="text-white/40 text-[8px] font-black uppercase">Total</p><p className="font-black text-white text-xs">₹{MOCK_FEES.total.toLocaleString()}</p></div>
          <div className="text-right"><p className="text-white/40 text-[8px] font-black uppercase">Paid</p><p className="font-black text-emerald-400 text-xs">₹{MOCK_FEES.paid.toLocaleString()}</p></div>
        </div>
        
        <button className="w-full bg-rose-600 text-white font-black py-3 mt-5 rounded-xl shadow-lg uppercase text-[9px] tracking-widest active:scale-95 transition-all">Pay Fees</button>
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-rose-600/10 rounded-full blur-2xl"></div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Ledger History</h3>
        {MOCK_FEES.history.map((tx, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-black text-lg">₹</div>
              <div><p className="text-xs font-black text-gray-900 uppercase tracking-tight">Sync</p><p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{tx.date}</p></div>
            </div>
            <p className="text-xs font-black text-emerald-600">+₹{tx.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeesScreen;