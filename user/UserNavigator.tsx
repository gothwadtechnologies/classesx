
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, 
  Search, 
  Bell, 
  LayoutGrid, 
  Video, 
  FileText, 
  CreditCard, 
  CalendarCheck,
  Zap,
  X,
  ShieldCheck,
  BookOpen,
  History,
  Sparkles,
  FileCode,
  Trophy
} from 'lucide-react';
import { User, TabName, GlobalSettings, Batch, UserRole, Test } from '../common/types.ts';
import FeesScreen from '../common/screens/tabs/FeesScreen.tsx';
import ClassesScreen from '../common/screens/tabs/ClassesScreen.tsx';
import TestsScreen from '../common/screens/tabs/TestsScreen.tsx';
import AttendanceScreen from '../common/screens/tabs/AttendanceScreen.tsx';
import BatchesScreen from '../common/screens/tabs/BatchesScreen.tsx';
import ResultsScreen from '../common/screens/tabs/ResultsScreen.tsx';
import { APP_NAME, BRANDING_FOOTER } from '../common/constants.ts';

// Resource Screens
import LibraryScreen from '../common/screens/resources/LibraryScreen.tsx';
import PYQScreen from '../common/screens/resources/PYQScreen.tsx';
import EduAIScreen from '../common/screens/resources/EduAIScreen.tsx';
import SamplePaperScreen from '../common/screens/resources/SamplePaperScreen.tsx';
import TestSeriesScreen from '../common/screens/resources/TestSeriesScreen.tsx';

interface UserNavigatorProps {
  user: User;
  onOpenDrawer: () => void;
  settings: GlobalSettings;
  onSelectBatch: (batch: Batch) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  forcedResource?: string | null;
  onTabPress: () => void;
  onSelectResource: (id: string | null) => void;
  isAdminViewMode: boolean;
  onToggleViewMode: () => void;
  onSelectTest: (test: Test, screen: 'TEST_BUILDER' | 'TEST_TAKER') => void;
}

const UserNavigator: React.FC<UserNavigatorProps> = ({ 
  user, 
  onOpenDrawer, 
  settings, 
  onSelectBatch, 
  onOpenNotifications, 
  onOpenProfile, 
  onLogout,
  forcedResource,
  onTabPress,
  onSelectResource,
  isAdminViewMode,
  onToggleViewMode,
  onSelectTest
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('Batches');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    if (forcedResource) {
      switch (forcedResource) {
        case 'Library': return <LibraryScreen />;
        case 'PYQs': return <PYQScreen />;
        case 'Edu AI': return <EduAIScreen settings={settings} />;
        case 'Papers': return <SamplePaperScreen />;
        case 'Series': return <TestSeriesScreen />;
        case 'Notes': return <div className="p-12 text-center text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] leading-loose">Notes Repository<br/>Coming Soon</div>;
        case 'Results': return <ResultsScreen user={user} />;
        default: break;
      }
    }
    switch (activeTab) {
      case 'Batches': return <BatchesScreen user={user} onSelectBatch={onSelectBatch} searchQuery={searchQuery} />;
      case 'Classes': return <ClassesScreen user={user} />;
      case 'Tests': return <TestsScreen user={user} onSelectTest={onSelectTest} />;
      case 'Fees': return <FeesScreen user={user} />;
      case 'Attendance': return <AttendanceScreen user={user} />;
      default: return null;
    }
  };

  const mainTabs: { name: TabName; icon: React.ReactNode }[] = [
    { name: 'Batches', icon: <LayoutGrid className="w-7 h-7" /> },
    { name: 'Classes', icon: <Video className="w-7 h-7" /> },
    { name: 'Tests', icon: <FileText className="w-7 h-7" /> },
    { name: 'Fees', icon: <CreditCard className="w-7 h-7" /> },
    { name: 'Attendance', icon: <CalendarCheck className="w-7 h-7" /> },
  ];

  const visibleResources = [
    { id: 'Library', icon: <BookOpen className="w-6 h-6" />, label: 'LIB' },
    { id: 'PYQs', icon: <History className="w-6 h-6" />, label: 'PYQ' },
    { id: 'Edu AI', icon: <Sparkles className="w-6 h-6" />, label: 'AI' },
    { id: 'Papers', icon: <FileCode className="w-6 h-6" />, label: 'PAPER' },
    { id: 'Series', icon: <Trophy className="w-6 h-6" />, label: 'SERIES' },
  ];

  const handleTabClick = (tabName: TabName) => {
    setActiveTab(tabName);
    onTabPress();
    setIsMoreMenuOpen(false);
    setIsSearchActive(false);
  };

  const handleResourceClick = (id: string) => {
    const nextVal = forcedResource === id ? null : id;
    onSelectResource(nextVal);
    setIsMoreMenuOpen(false);
    setIsSearchActive(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
      {/* Deep Blue Header - Matching Admin */}
      <header className="bg-blue-800 px-4 py-4 shadow-lg shadow-blue-900/20 shrink-0 z-[60] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onOpenDrawer} className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center transition-all active:scale-90 text-white border border-white/10">
              <Menu className="w-7 h-7" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tight uppercase text-white leading-none">{APP_NAME}</h1>
              <p className="text-[9px] font-bold text-blue-200 uppercase tracking-[0.2em] mt-1">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {user.role === UserRole.ADMIN && (
              <button 
                onClick={onToggleViewMode}
                className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all border border-white/10"
                title="Switch to Admin View"
              >
                <ShieldCheck className="w-6 h-6" />
              </button>
            )}
            <button 
              onClick={() => { setIsSearchActive(!isSearchActive); if(isSearchActive) setSearchQuery(''); }}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${isSearchActive ? 'bg-white text-blue-800' : 'bg-white/10 text-white border border-white/10'}`}
            >
              {isSearchActive ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
            </button>
            <button onClick={onOpenNotifications} className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all relative border border-white/10">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border border-blue-800"></span>
            </button>
            <button onClick={onOpenProfile} className="w-11 h-11 rounded-full bg-white text-blue-800 font-black text-sm shadow-md active:scale-90 transition-all flex items-center justify-center border border-blue-200 overflow-hidden">
               {user.name.charAt(0)}
            </button>
          </div>
        </div>

        {isSearchActive && (
          <div className="pb-1">
            <div className="relative">
              <input 
                autoFocus
                type="text"
                placeholder="Search Batches, Exams..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3.5 rounded-xl text-xs font-bold text-white placeholder:text-blue-200 outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </header>

      {/* Sub-header for resources - Matching Admin */}
      <div className="bg-blue-900 border-b border-blue-950 shrink-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-3 py-3 gap-2">
          {visibleResources.map((res) => (
            <button 
              key={res.id} 
              onClick={() => handleResourceClick(res.id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all relative ${
                forcedResource === res.id 
                  ? 'bg-white text-blue-900 shadow-lg scale-105 z-10' 
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <div className="mb-1">{res.icon}</div>
              <span className={`text-[8px] font-black uppercase tracking-tight ${forcedResource === res.id ? 'text-blue-900' : 'text-blue-300'}`}>
                {res.label}
              </span>
            </button>
          ))}
          <button 
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all relative ${
              isMoreMenuOpen ? 'bg-slate-900 text-white shadow-lg' : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Zap className="w-6 h-6 mb-1" />
            <span className={`text-[8px] font-black uppercase tracking-tight ${isMoreMenuOpen ? 'text-white' : 'text-blue-300'}`}>
              MORE
            </span>
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto scroll-hide bg-white relative">
        <div className="pb-32">
          {renderContent()}
        </div>
      </main>

      {/* Deep Blue Bottom Navigation - Matching Admin */}
      <nav className="bg-blue-800 px-4 py-2 shrink-0 flex items-center justify-around z-[60] shadow-[0_-4px_20px_rgba(30,58,138,0.3)]">
        {mainTabs.map((tab) => (
          <button 
            key={tab.name} 
            onClick={() => handleTabClick(tab.name)} 
            className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all relative ${
              (activeTab === tab.name && !forcedResource) ? 'text-white scale-105' : 'text-blue-300 opacity-60'
            }`}
          >
            {(activeTab === tab.name && !forcedResource) && (
              <div 
                className="absolute -top-1 w-10 h-0.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              />
            )}
            <div className="mb-1">{tab.icon}</div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};


export default UserNavigator;
