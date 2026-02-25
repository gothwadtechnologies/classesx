
import React, { useState, useEffect } from 'react';
import { User, UserRole, Test, TestResult } from '../../types';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Trophy, User as UserIcon, Calendar, ArrowRight, Search, Filter } from 'lucide-react';

interface ResultsScreenProps {
  user: User;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ user }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [tests, setTests] = useState<{ [id: string]: Test }>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!db) return;

    // Fetch all tests to get titles
    const unsubTests = onSnapshot(collection(db, 'tests'), (snap) => {
      const testMap: { [id: string]: Test } = {};
      snap.docs.forEach(d => {
        testMap[d.id] = { id: d.id, ...d.data() } as Test;
      });
      setTests(testMap);
    });

    // Fetch results
    let qResults;
    if (user.role === UserRole.ADMIN) {
      qResults = query(collection(db, 'testResults'), orderBy('completedAt', 'desc'));
    } else {
      qResults = query(collection(db, 'testResults'), where('studentId', '==', user.uid), orderBy('completedAt', 'desc'));
    }

    const unsubResults = onSnapshot(qResults, (snap) => {
      setResults(snap.docs.map(d => ({ id: d.id, ...d.data() } as TestResult)));
    });

    return () => {
      unsubTests();
      unsubResults();
    };
  }, [user]);

  const filteredResults = results.filter(r => 
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tests[r.testId]?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Performance</h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">Results & Analytics</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder="Search by test or student..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* Results List */}
      <div className="space-y-4 pb-24">
        {filteredResults.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-300 mx-auto shadow-sm">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">No results found</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Complete a test to see performance data</p>
            </div>
          </div>
        ) : (
          filteredResults.map(result => {
            const test = tests[result.testId];
            const percentage = Math.round((result.score / result.totalMarks) * 100);
            
            return (
              <motion.div 
                layout
                key={result.id} 
                className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
              >
                {/* Android Style Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] pointer-events-none ${
                  percentage >= 80 ? 'bg-emerald-500' :
                  percentage >= 50 ? 'bg-blue-500' :
                  'bg-rose-500'
                }`} />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm ${
                      percentage >= 80 ? 'bg-emerald-500 shadow-emerald-200' :
                      percentage >= 50 ? 'bg-blue-500 shadow-blue-200' :
                      'bg-rose-500 shadow-rose-200'
                    } shadow-lg group-hover:scale-110 transition-transform`}>
                      {percentage}%
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight truncate max-w-[180px]">
                        {test?.title || 'Unknown Test'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <UserIcon className="w-3 h-3 text-slate-400" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{result.studentName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">{result.score}<span className="text-[10px] text-slate-400 ml-1">/ {result.totalMarks}</span></p>
                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Total Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {new Date(result.completedAt).toLocaleDateString()}
                  </div>
                  <button className="flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:gap-2 transition-all">
                    View Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ResultsScreen;
