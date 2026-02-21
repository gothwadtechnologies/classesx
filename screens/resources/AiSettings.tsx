
import React from 'react';
import { Settings, Sparkles, Brain, Zap, Shield, MessageSquare, Cpu, Check } from 'lucide-react';
import { GlobalSettings } from '../../types';

interface AiSettingsProps {
  onBack: () => void;
  settings: GlobalSettings;
  activeModelIndex: number;
  onSelectModel: (index: number) => void;
}

const AiSettings: React.FC<AiSettingsProps> = ({ onBack, settings, activeModelIndex, onSelectModel }) => {
  const availableModels = [
    { id: settings.aiModel1, label: 'Model 1' },
    { id: settings.aiModel2, label: 'Model 2' },
    { id: settings.aiModel3, label: 'Model 3' },
    { id: settings.aiModel4, label: 'Model 4' },
    { id: settings.aiModel5, label: 'Model 5' },
  ].filter(m => m.id);

  const activeModelId = availableModels[activeModelIndex]?.id || 'gemini-1.5-flash';

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

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-hide pb-32">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-[2.5rem] text-white shadow-xl shadow-purple-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">✨</div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-widest leading-none">Edu AI v3.5</h4>
              <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mt-1.5">Dynamic Engine</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest leading-relaxed">
              Active Model: {activeModelId}
            </p>
            <p className="text-[9px] font-medium text-white/60 uppercase tracking-widest italic">
              API Key: {settings.aiApiKey ? '••••••••••••' : 'Using System Default'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Available Engines</p>
          <div className="grid grid-cols-1 gap-3">
            {availableModels.length > 0 ? availableModels.map((m, idx) => (
              <button 
                key={idx}
                onClick={() => onSelectModel(idx)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between border ${
                  activeModelIndex === idx 
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-200' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${activeModelIndex === idx ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                    M{idx+1}
                  </div>
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-tight ${activeModelIndex === idx ? 'text-white' : 'text-slate-900'}`}>{m.label}</p>
                    <p className={`text-[8px] font-bold truncate max-w-[150px] ${activeModelIndex === idx ? 'text-white/60' : 'text-slate-400'}`}>{m.id}</p>
                  </div>
                </div>
                {activeModelIndex === idx && <Check className="w-4 h-4 text-white" />}
              </button>
            )) : (
              <div className="py-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No models configured</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Performance Tuning</p>
          <div className="bg-gray-50 rounded-[2rem] p-2 space-y-1 border border-gray-100">
            <SettingsOption icon={<Cpu className="w-4 h-4" />} label="Active Engine" value={activeModelId.split('-')[0]} />
            <SettingsOption icon={<Brain className="w-4 h-4" />} label="Reasoning Level" value="High" />
            <SettingsOption icon={<Zap className="w-4 h-4" />} label="Response Speed" value="Fast" />
            <SettingsOption icon={<MessageSquare className="w-4 h-4" />} label="Tone" value="Academic" />
          </div>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-widest">
            AI settings are synchronized across your institute profile. Admin can change these in Control Center.
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
