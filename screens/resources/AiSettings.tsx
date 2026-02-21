
import React from 'react';
import { Settings, Sparkles, Brain, Zap, Shield, MessageSquare } from 'lucide-react';

interface AiSettingsProps {
  onBack: () => void;
}

const AiSettings: React.FC<AiSettingsProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="p-2 bg-gray-50 rounded-xl text-gray-900 active:scale-95 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h3 className="text-xs font-black uppercase tracking-tight">AI Settings</h3>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Configuration & Logic</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-hide">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-[2.5rem] text-white shadow-xl shadow-purple-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">✨</div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest leading-none">Edu AI v3.0</h4>
              <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1.5">Active Engine</p>
            </div>
          </div>
          <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest leading-relaxed">
            Optimized for JEE, NEET, and Board Exam reasoning. Using Gemini 3 Pro Preview model with deep academic context.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Model Configuration</p>
          <div className="bg-gray-50 rounded-[2rem] p-2 space-y-1 border border-gray-100">
            <SettingsOption icon={<Brain className="w-4 h-4" />} label="Reasoning Level" value="High" />
            <SettingsOption icon={<Zap className="w-4 h-4" />} label="Response Speed" value="Fast" />
            <SettingsOption icon={<MessageSquare className="w-4 h-4" />} label="Tone" value="Academic" />
            <SettingsOption icon={<Shield className="w-4 h-4" />} label="Safety Filter" value="Strict" />
          </div>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-widest">
            AI settings are synchronized across your institute profile.
          </p>
        </div>
      </div>
    </div>
  );
};

const SettingsOption: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <span className="text-[10px] font-black uppercase text-gray-700 tracking-tight">{label}</span>
    </div>
    <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{value}</span>
  </div>
);

export default AiSettings;
