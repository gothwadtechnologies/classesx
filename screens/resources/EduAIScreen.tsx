
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Settings, History, Sparkles, Send, ChevronLeft, MessageSquare, Trash2 } from 'lucide-react';
import AiSettings from './AiSettings';

const EduAIScreen: React.FC = () => {
  const [view, setView] = useState<'CHAT' | 'SETTINGS' | 'HISTORY'>('CHAT');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your AI Study Assistant. Ask me anything about Physics, Chemistry, Maths, or Biology!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are an expert, encouraging tutor for JEE and NEET students. Provide concise, clear, and conceptually accurate answers. Use Markdown for formatting and LaTeX-style notation for math if needed.',
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that. Could you rephrase your question?";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Error connecting to Study Brain. Please check your internet connection or API availability.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (view === 'SETTINGS') return <AiSettings onBack={() => setView('CHAT')} />;

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
      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-tight">Edu AI Tutor</h3>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Powered by Gemini Pro</p>
          </div>
        </div>
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
          <input 
            type="text"
            className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Ask a doubt..."
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
