
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { Test, Question, TestResult } from '../../types';

interface TestTakerScreenProps {
  test: Test;
  studentId: string;
  studentName: string;
  onBack: () => void;
  onSubmit: (result: TestResult) => void;
}

const TestTakerScreen: React.FC<TestTakerScreenProps> = ({ test, studentId, studentName, onBack, onSubmit }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const subjects = Array.from(new Set(test.questions.map(q => q.subject || 'General')));
  const [activeSubject, setActiveSubject] = useState(subjects[0]);

  // Filter questions by subject
  const filteredQuestions = test.questions.filter(q => q.subject === activeSubject);
  const currentQuestion = filteredQuestions[currentQuestionIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIdx: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIdx });
  };

  const handleAutoSubmit = () => {
    calculateAndSubmit();
  };

  const calculateAndSubmit = () => {
    setIsSubmitting(true);
    let score = 0;
    const totalMarks = test.totalMarks;

    test.questions.forEach(q => {
      if (answers[q.id] === q.correctOption) {
        score += test.marksPerCorrect;
      } else if (answers[q.id] !== undefined) {
        if (test.negativeMarking) {
          score -= test.marksPerWrong;
        }
      }
    });

    const result: TestResult = {
      id: Math.random().toString(36).substr(2, 9),
      testId: test.id,
      studentId,
      studentName,
      score: Math.max(0, score), // Ensure score doesn't go below 0
      totalMarks,
      answers,
      completedAt: new Date().toISOString()
    };

    setTimeout(() => {
      onSubmit(result);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowConfirmSubmit(true)}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{test.title}</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Live Examination • {studentName}</p>
          </div>
        </div>

        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border-2 transition-all ${
          timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-900'
        }`}>
          <Clock className="w-4 h-4" />
          <span className="text-sm font-black font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Question Navigation */}
        <div className="w-80 bg-white border-r border-slate-200 p-6 flex flex-col hidden lg:flex">
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {subjects.map(subject => (
              <div key={subject} className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{subject}</p>
                <div className="grid grid-cols-5 gap-2">
                  {test.questions.filter(q => q.subject === subject).map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCurrent = currentQuestion?.id === q.id;
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setActiveSubject(subject);
                          const newIdx = test.questions.filter(qu => qu.subject === subject).findIndex(qu => qu.id === q.id);
                          setCurrentQuestionIdx(newIdx);
                        }}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border-2 ${
                          isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110 z-10' :
                          isAnswered ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                          'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={() => setShowConfirmSubmit(true)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Test
            </button>
          </div>
        </div>

        {/* Main Content - Question Display */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center custom-scrollbar">
          <div className="w-full max-w-3xl space-y-10">
            {/* Subject Tabs (Mobile/Tablet) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:hidden no-scrollbar">
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => {
                    setActiveSubject(subject);
                    setCurrentQuestionIdx(0);
                  }}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    activeSubject === subject ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {currentQuestion ? (
              <motion.div 
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Question {currentQuestionIdx + 1}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeSubject} • {currentQuestion.marks || 4} Marks</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-relaxed">
                    {currentQuestion.text}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`group flex items-center gap-4 p-5 rounded-[1.5rem] border-2 text-left transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-500 shadow-md' 
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-sm font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                          {option}
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-8">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    disabled={currentQuestionIdx === filteredQuestions.length - 1}
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-30 transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold">No questions in this section.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isSubmitting && setShowConfirmSubmit(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Submit Test?</h3>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  You have answered {Object.keys(answers).length} out of {test.questions.length} questions. Are you sure you want to end the test?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmSubmit(false)}
                  className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Continue
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={calculateAndSubmit}
                  className="bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center"
                >
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Yes, Submit'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestTakerScreen;
