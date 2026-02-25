
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Trash2, Save, Search, Settings, ChevronRight, FileText } from 'lucide-react';
import { Test, Question } from '../../types';
import QuestionDetailScreen from './QuestionDetailScreen';

interface TestBuilderScreenProps {
  test: Test;
  onBack: () => void;
  onSave: (updatedTest: Test) => void;
}

const TestBuilderScreen: React.FC<TestBuilderScreenProps> = ({ test, onBack, onSave }) => {
  const [questions, setQuestions] = useState<Question[]>(test.questions || []);
  const subjects = Object.keys(test.subjectSyllabus || {});
  const [activeSubject, setActiveSubject] = useState<string>(subjects[0] || 'General');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: 'new-' + Math.random().toString(36).substr(2, 9),
      text: '',
      options: ['', '', '', ''],
      correctOption: 0,
      subject: activeSubject,
      marks: test.marksPerCorrect || 4
    };
    setEditingQuestion(newQuestion);
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    if (updatedQuestion.id.startsWith('new-')) {
      const finalQuestion = { ...updatedQuestion, id: Math.random().toString(36).substr(2, 9) };
      setQuestions([...questions, finalQuestion]);
    } else {
      setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    }
    setEditingQuestion(null);
  };

  const deleteQuestion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSaveTest = () => {
    onSave({ ...test, questions });
  };

  const filteredQuestions = questions
    .filter(q => q.subject === activeSubject)
    .filter(q => q.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[150] bg-slate-50 flex flex-col">
      {/* Sky Blue Header */}
      <div className="bg-sky-500 px-4 py-3 flex flex-col sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white transition-colors active:scale-90"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[120px]">{test.title}</h2>
              <p className="text-[8px] font-bold text-sky-100 uppercase tracking-widest">
                Manage • {questions.length} Qs
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setIsSearchActive(!isSearchActive)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${isSearchActive ? 'bg-white text-sky-500' : 'bg-white/20 text-white'}`}
            >
              <Search className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-90">
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSaveTest}
              className="bg-white text-sky-600 px-3 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>

        {isSearchActive && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-2"
          >
            <input 
              autoFocus
              type="text"
              placeholder="Search questions..."
              className="w-full bg-white/20 border border-white/30 px-3 py-2 rounded-xl text-[10px] font-bold text-white placeholder:text-sky-100 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Compact Subject Sidebar */}
        <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-4 overflow-y-auto custom-scrollbar">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-[8px] font-black uppercase transition-all border-2 ${
                activeSubject === subject 
                  ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-200 scale-110' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
              }`}
              title={subject}
            >
              {subject.substring(0, 2)}
            </button>
          ))}
          <button 
            onClick={addQuestion}
            className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Question List View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <div className="flex items-center justify-between px-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activeSubject} Questions</p>
            <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest">{filteredQuestions.length} Found</p>
          </div>

          {filteredQuestions.map((q, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={q.id} 
              onClick={() => setEditingQuestion(q)}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3 hover:border-sky-300 transition-all active:scale-[0.98] cursor-pointer group"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">{q.text || 'Empty question text...'}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                  {q.options.filter(o => o).length} Options • Correct: {String.fromCharCode(65 + q.correctOption)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => deleteQuestion(q.id, e)}
                  className="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </motion.div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">No questions found</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Add a question to this subject</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question Detail Screen Overlay */}
      <AnimatePresence>
        {editingQuestion && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200]"
          >
            <QuestionDetailScreen 
              question={editingQuestion}
              test={test}
              onBack={() => setEditingQuestion(null)}
              onSave={handleSaveQuestion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestBuilderScreen;
