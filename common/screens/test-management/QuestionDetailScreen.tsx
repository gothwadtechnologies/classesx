
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, CheckCircle2, HelpCircle } from 'lucide-react';
import { Question, Test } from '../../types';

interface QuestionDetailScreenProps {
  question: Question;
  test: Test;
  onBack: () => void;
  onSave: (updatedQuestion: Question) => void;
}

const QuestionDetailScreen: React.FC<QuestionDetailScreenProps> = ({ question, test, onBack, onSave }) => {
  const [localQuestion, setLocalQuestion] = useState<Question>({ ...question });

  const updateField = (updates: Partial<Question>) => {
    setLocalQuestion(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    onSave(localQuestion);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col">
      {/* Sky Blue Header */}
      <div className="bg-sky-500 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white transition-colors active:scale-90"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">
              {question.id.startsWith('new') ? 'Add Question' : 'Edit Question'}
            </h2>
            <p className="text-[8px] font-bold text-sky-100 uppercase tracking-widest">
              {localQuestion.subject} • {test.marksPerCorrect} Marks
            </p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="bg-white text-sky-600 px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Question Statement</p>
            <textarea
              value={localQuestion.text}
              onChange={(e) => updateField({ text: e.target.value })}
              placeholder="Type your question here..."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-sky-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Options & Correct Answer</p>
            {localQuestion.options.map((opt, optIdx) => (
              <div key={optIdx} className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Option {String.fromCharCode(65 + optIdx)}</p>
                  <button 
                    onClick={() => updateField({ correctOption: optIdx })}
                    className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-tight transition-colors ${
                      localQuestion.correctOption === optIdx ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-400'
                    }`}
                  >
                    {localQuestion.correctOption === optIdx ? <CheckCircle2 className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                    {localQuestion.correctOption === optIdx ? 'Correct' : 'Mark Correct'}
                  </button>
                </div>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...localQuestion.options];
                    newOptions[optIdx] = e.target.value;
                    updateField({ options: newOptions });
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                  className={`w-full border rounded-xl py-2.5 px-4 text-xs font-bold focus:outline-none transition-all ${
                    localQuestion.correctOption === optIdx 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 focus:border-emerald-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-500'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
          <p className="text-[9px] text-sky-800 font-bold leading-relaxed">
            Tip: Make sure to provide clear options. The correct answer will be used for automated grading.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailScreen;
