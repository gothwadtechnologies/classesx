
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { Settings, History, Sparkles, Send, ChevronLeft, MessageSquare, Trash2, Cpu, ChevronDown } from 'lucide-react';
import AiSettings from './AiSettings';
import { GlobalSettings } from '../../types';

interface EduAIScreenProps {
  settings: GlobalSettings;
}

const EduAIScreen: React.FC<EduAIScreenProps> = ({ settings }) => {
  const [view, setView] = useState<'CHAT' | 'SETTINGS' | 'HISTORY'>('CHAT');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your AI Study Assistant. Ask me anything about Physics, Chemistry, Maths, or Biology!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const availableModels = [
    { id: settings.aiModel1, label: 'Model 1' },
    { id: settings.aiModel2, label: 'Model 2' },
    { id: settings.aiModel3, label: 'Model 3' },
    { id: settings.aiModel4, label: 'Model 4' },
    { id: settings.aiModel5, label: 'Model 5' },
  ].filter(m => m.id);

  // Fallback if no models configured
  const currentModelId = availableModels[activeModelIndex]?.id || 'gemini-1.5-flash';
  const currentModelLabel = availableModels[activeModelIndex]?.label || 'Default AI';

  useEffect(() => {
    if (view === 'CHAT') {
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages, isTyping, view]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = settings.aiApiKey || process.env.API_KEY;
      if (!apiKey) throw new Error("No API Key configured");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: currentModelId,
        contents: userMsg,
        config: {
          systemInstruction: 'You are an expert, encouraging tutor for JEE and NEET students. Provide concise, clear, and conceptually accurate answers. Use Markdown for formatting and LaTeX-style notation for math if needed.',
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that. Could you rephrase your question?";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error: any) {
      console.error("AI API Error:", error);
      let errorMsg = 'Error connecting to AI Engine. Please check your internet connection or API availability.';
      if (error.message?.includes("API Key")) errorMsg = "Invalid API Key. Please check Admin Settings.";
      if (error.message?.includes("not found")) errorMsg = `Model ID "${currentModelId}" not found or unsupported.`;
      
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (view === 'SETTINGS') return (
    <AiSettings 
      onBack={() => setView('CHAT')} 
      settings={settings} 
      activeModelIndex={activeModelIndex}
      onSelectModel={setActiveModelIndex}
    />
  );

  if (view === 'HISTORY') return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3 shrink-0">
        <button onClick={() => setView('CHAT')} className="p-2 bg-gray-50 rounded-xl text-gray-900 active:scale-95 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h3 className="text-xs font-black uppercase tracking-tight">Chat History</h3>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Previous Sessions</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center opacity-30">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <History className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest">No History Found</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 relative z-[70]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <button 
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-1 group"
            >
              <h3 className="text-xs font-black uppercase tracking-tight group-hover:text-purple-600 transition-colors">{currentModelLabel}</h3>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
            </button>
            <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[100px]">{currentModelId}</p>
          </div>
        </div>

        {/* Model Selector Modal */}
        <AnimatePresence>
          {showModelSelector && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setShowModelSelector(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">AI Engine Hub</h3>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Select Active Model</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModelSelector(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {availableModels.length > 0 ? availableModels.map((m, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setActiveModelIndex(idx); setShowModelSelector(false); }}
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
                      {activeModelIndex === idx && (
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  )) : (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Cpu className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        No AI Models configured.<br/>Please contact Administrator.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center leading-relaxed">
                     Switching models will affect the next message you send.
                   </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setView('HISTORY')}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors active:scale-90"
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setView('SETTINGS')}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors active:scale-90"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center gap-2">
          <button 
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all"
            title="Switch Model"
          >
            <Cpu className="w-5 h-5" />
          </button>
          <input 
            type="text"
            className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder={`Ask ${currentModelLabel}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EduAIScreen;
