
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Calendar, Clock, BookOpen, Check, Layers, FileText, Hash } from 'lucide-react';
import { Test, Batch } from '../../types';

interface AddTestPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (testData: Partial<Test>) => void;
  batches: Batch[];
  initialData?: Test | null;
}

const AddTestPopup: React.FC<AddTestPopupProps> = ({ isOpen, onClose, onConfirm, batches, initialData }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [totalQuestions, setTotalQuestions] = useState(30);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [subjectSyllabus, setSubjectSyllabus] = useState<{ [subject: string]: string }>({});
  const [marksPerCorrect, setMarksPerCorrect] = useState(4);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [marksPerWrong, setMarksPerWrong] = useState(1);

  // Derived subjects from selected batches
  const availableSubjects = Array.from(new Set(
    batches
      .filter(b => selectedBatchIds.includes(b.id))
      .flatMap(b => b.subjects || [])
  )) as string[];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDate(initialData.date || '');
        setStartTime(initialData.startTime || '');
        setDuration(initialData.duration || 60);
        setTotalQuestions(initialData.totalQuestions || 30);
        setSelectedBatchIds(initialData.batchIds || []);
        setSubjectSyllabus(initialData.subjectSyllabus || {});
        setMarksPerCorrect(initialData.marksPerCorrect || 4);
        setNegativeMarking(initialData.negativeMarking || false);
        setMarksPerWrong(initialData.marksPerWrong || 1);
      } else {
        setTitle('');
        setDate('');
        setStartTime('');
        setDuration(60);
        setTotalQuestions(30);
        setSelectedBatchIds([]);
        setSubjectSyllabus({});
        setMarksPerCorrect(4);
        setNegativeMarking(false);
        setMarksPerWrong(1);
      }
    }
  }, [isOpen, initialData]);

  const toggleBatch = (batchId: string) => {
    setSelectedBatchIds(prev => 
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    );
  };

  const handleSyllabusChange = (subject: string, value: string) => {
    setSubjectSyllabus(prev => ({ ...prev, [subject]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !startTime || selectedBatchIds.length === 0) return;

    onConfirm({
      title,
      date,
      startTime,
      duration,
      totalQuestions,
      batchIds: selectedBatchIds,
      subjectSyllabus,
      status: 'upcoming',
      questions: initialData?.questions || [],
      totalMarks: totalQuestions * marksPerCorrect,
      marksPerCorrect,
      negativeMarking,
      marksPerWrong: negativeMarking ? marksPerWrong : 0,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-[360px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {initialData ? 'Edit Test' : 'Create New Test'}
                  </h3>
                </div>
                <button onClick={onClose} className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Test Title */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Test Title</p>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Weekly Assessment #1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Start Date</p>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Start Time</p>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Duration & Questions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Duration (Min)</p>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Total Questions</p>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="number"
                        value={totalQuestions}
                        onChange={(e) => setTotalQuestions(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Marking Scheme */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Marking Scheme</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Negative Marking</p>
                      <button
                        type="button"
                        onClick={() => setNegativeMarking(!negativeMarking)}
                        className={`w-8 h-4 rounded-full transition-all relative ${negativeMarking ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${negativeMarking ? 'left-4.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Correct (+)</p>
                      <input
                        type="number"
                        value={marksPerCorrect}
                        onChange={(e) => setMarksPerCorrect(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    {negativeMarking && (
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest px-1">Wrong (-)</p>
                        <input
                          type="number"
                          value={marksPerWrong}
                          onChange={(e) => setMarksPerWrong(Number(e.target.value))}
                          className="w-full bg-white border border-rose-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-rose-500 transition-all text-rose-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Batch Selection */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Target Batches</p>
                  <div className="grid grid-cols-1 gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                    {batches.map(batch => (
                      <button
                        key={batch.id}
                        type="button"
                        onClick={() => toggleBatch(batch.id)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${
                          selectedBatchIds.includes(batch.id)
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Layers className={`w-3 h-3 ${selectedBatchIds.includes(batch.id) ? 'text-blue-200' : 'text-slate-400'}`} />
                          <span>{batch.name} ({batch.classLevel})</span>
                        </div>
                        {selectedBatchIds.includes(batch.id) && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Syllabus Section */}
                {availableSubjects.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Subject Syllabus</p>
                    {availableSubjects.map(subject => (
                      <div key={subject} className="space-y-1">
                        <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest px-1">{subject}</p>
                        <textarea
                          value={subjectSyllabus[subject] || ''}
                          onChange={(e) => handleSyllabusChange(subject, e.target.value)}
                          placeholder={`Enter ${subject} syllabus...`}
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[10px] font-bold focus:outline-none focus:border-blue-500 transition-all resize-none"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleSubmit}
                disabled={!title || !date || !startTime || selectedBatchIds.length === 0}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
              >
                {initialData ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {initialData ? 'Update Test' : 'Create Test'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTestPopup;
