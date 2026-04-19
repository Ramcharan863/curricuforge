
import React, { useState, useCallback, useMemo } from 'react';
import { ICONS } from './constants';
import { AppView, GeneratedContent, AppRole, UserInfo, ApprovalStatus } from './types';
import CurriculumGenerator from './components/CurriculumGenerator';
import LessonPlanner from './components/LessonPlanner';
import AssignmentGenerator from './components/AssessmentGenerator'; 
import CurriculumUpdater from './components/CurriculumUpdater';
import InstitutionalFramework from './components/InstitutionalFramework';
import Login from './components/Login';
import DepartmentDetails from './components/DepartmentDetails';
import CollegeAI from './components/CollegeAI';
import TimetableGenerator from './components/TimetableGenerator';

// Dashboards
import ManagementDashboard from './components/dashboards/ManagementDashboard';
import DepartmentDashboard from './components/dashboards/DepartmentDashboard';
import FacultyDashboard from './components/dashboards/FacultyDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import StudentAnnouncements from './components/StudentAnnouncements';
import StudentReminders from './components/StudentReminders';
import StudentTools from './components/StudentTools';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewItem, setPreviewItem] = useState<GeneratedContent | null>(null);

  const addHistory = useCallback((item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'> & { requestApproval?: boolean }) => {
    if (!currentUser) return;
    
    const { requestApproval, ...contentData } = item;

    // Logic for initial approval status
    let initialStatus: ApprovalStatus = 'Pending';
    
    if (currentUser.role === 'Management') {
      initialStatus = 'Approved_Mgmt';
    } else if (currentUser.role === 'Department') {
      initialStatus = 'Approved_Dept';
    } else if (currentUser.role === 'Student') {
      // If student DOES NOT request approval, it's auto-approved as "Private/Self-Verified"
      // If they DO request it, it stays 'Pending' to show up in HOD queue
      initialStatus = requestApproval ? 'Pending' : 'Approved_Mgmt';
    } else if (currentUser.role === 'Faculty') {
      initialStatus = 'Pending';
    }

    const newItem: GeneratedContent = {
      ...contentData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      role: currentUser.role,
      userName: currentUser.name,
      collegeName: currentUser.collegeName,
      department: currentUser.department,
      approvalStatus: initialStatus,
      isPublished: currentUser.role === 'Management' || currentUser.role === 'Department' || (currentUser.role === 'Student' && !requestApproval),
    };

    setHistory(prev => [newItem, ...prev]);
    setPreviewItem(newItem);
  }, [currentUser]);

  const navItems = useMemo(() => {
    if (!currentUser) return [];
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard Overview', icon: ICONS.Sparkles, roles: ['Faculty', 'Department', 'Management', 'Student'] },
      { id: 'curriculum', label: 'Curriculum Design', icon: ICONS.Curriculum, roles: ['Faculty', 'Department'] },
      { id: 'lesson-plan', label: 'Lesson Planner', icon: ICONS.Lesson, roles: ['Faculty'] },
      { id: 'assignment', label: 'Assignment Builder', icon: ICONS.Assessment, roles: ['Faculty', 'Department'] },
      { id: 'update', label: 'Revision Control', icon: ICONS.Update, roles: ['Faculty', 'Department'] }, 
      { id: 'institutional', label: 'Governance Framework', icon: ICONS.Institution, roles: ['Management'] },
      { id: 'dept-details', label: 'Department Directory', icon: ICONS.Lesson, roles: ['Management'] }, 
      { id: 'college-ai', label: 'Overall College AI', icon: ICONS.Sparkles, roles: ['Management'] }, 
      // Student Specific Sidebar items
      { id: 'student-announcements', label: 'Institutional Notices', icon: ICONS.Institution, roles: ['Student'] },
      { id: 'student-reminders', label: 'Academic Reminders', icon: ICONS.Timetable, roles: ['Student'] },
      { id: 'student-tools', label: 'AI Study Lab', icon: ICONS.Sparkles, roles: ['Student'] },
    ];
    return baseItems.filter(item => item.roles.includes(currentUser.role));
  }, [currentUser]);

  const handleLogin = (name: string, role: AppRole, college: string, department: string, roleSpecificData: Record<string, string>) => {
    setCurrentUser({ name, role, collegeName: college, department, roleSpecificData });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPreviewItem(null);
  };

  const handleApproval = (id: string, status: ApprovalStatus, feedback?: string) => {
    setHistory(prev => prev.map(h => {
      if (h.id === id) {
        return { 
          ...h, 
          approvalStatus: status, 
          feedback, 
          isPublished: status.startsWith('Approved'),
          approvedBy: currentUser?.name
        };
      }
      return h;
    }));
    
    if (previewItem?.id === id) {
      setPreviewItem(prev => prev ? { 
        ...prev, 
        approvalStatus: status, 
        feedback, 
        isPublished: status.startsWith('Approved'),
        approvedBy: currentUser?.name
      } : null);
    }
  };

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case 'Management': return 'slate-900';
      case 'Department': return 'indigo-600';
      case 'Faculty': return 'blue-600';
      case 'Student': return 'emerald-600';
      default: return 'blue-600';
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    if (currentView === 'dashboard') {
      switch (currentUser.role) {
        case 'Management': return <ManagementDashboard history={history} onNavigate={setCurrentView} collegeName={currentUser.collegeName} onApprove={handleApproval} onGenerated={addHistory} />;
        case 'Department': return <DepartmentDashboard history={history} onNavigate={setCurrentView} collegeName={currentUser.collegeName} userDept={currentUser.department} onApprove={handleApproval} />;
        case 'Faculty': return <FacultyDashboard history={history} onNavigate={setCurrentView} collegeName={currentUser.collegeName} userDept={currentUser.department} userName={currentUser.name} />;
        case 'Student': return <StudentDashboard history={history} user={currentUser} onNavigate={setCurrentView} onGenerated={addHistory} />;
        default: return null;
      }
    }

    const commonProps = { 
      role: currentUser.role, 
      collegeName: currentUser.collegeName, 
      userName: currentUser.name, 
      department: currentUser.department,
      roleSpecificData: currentUser.roleSpecificData,
      onGenerated: addHistory 
    };

    switch (currentView) {
      case 'curriculum': return <CurriculumGenerator {...commonProps} />;
      case 'lesson-plan': return <LessonPlanner {...commonProps} />;
      case 'assignment': return <AssignmentGenerator {...commonProps} />;
      case 'update': return <CurriculumUpdater {...commonProps} />;
      case 'institutional': return <InstitutionalFramework {...commonProps} />;
      case 'dept-details': return <DepartmentDetails {...commonProps} />;
      case 'college-ai': return <CollegeAI {...commonProps} />;
      case 'timetable': return <TimetableGenerator {...commonProps} />;
      case 'student-announcements': return <StudentAnnouncements history={history} />;
      case 'student-reminders': return <StudentReminders />;
      case 'student-tools': return <StudentTools user={currentUser} onGenerated={addHistory} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter text-slate-900">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20 shadow-lg`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className={`flex items-center space-x-3 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            <div className="bg-slate-900 p-3 rounded-2xl shadow-xl">
              <ICONS.Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">CurricuForge</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <label className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-2 ${sidebarOpen ? '' : 'hidden'}`}>Capabilities</label>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AppView)}
                className={`w-full flex items-center p-3 rounded-xl transition-all ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 min-w-[20px] ${currentView === item.id ? 'text-white' : 'text-slate-400'}`} />
                {sidebarOpen && <span className="ml-3 font-medium text-sm truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`p-4 mb-4 bg-slate-50 rounded-2xl border border-slate-100 ${sidebarOpen ? '' : 'hidden'}`}>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated User</p>
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[9px] font-medium text-slate-500 truncate mt-1">{currentUser.collegeName}</p>
            <p className="text-[9px] font-medium text-blue-600 truncate mt-0.5">{currentUser.department}</p>
            {currentUser.roleSpecificData.designation && <p className="text-[8px] text-slate-400 italic mt-1">{currentUser.roleSpecificData.designation}</p>}
            {currentUser.roleSpecificData.roll_no && <p className="text-[8px] text-slate-400 italic mt-1">Roll: {currentUser.roleSpecificData.roll_no}</p>}
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all`}
          >
            <svg className="w-5 h-5 min-w-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span className="ml-3 font-medium text-sm">Exit Forge</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center space-x-3">
             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
             <h1 className="text-lg font-bold text-slate-900">
               {navItems.find(n => n.id === currentView)?.label || currentView.replace('-', ' ')}
               <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-mono font-normal">v1.5.0-OBE</span>
             </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex items-center bg-slate-100 px-4 py-1.5 rounded-full text-xs font-bold text-slate-700">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
               {history.length} OBJECTS IN HUB
             </div>
             <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">{currentUser.role}</span>
                <div className={`h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600`}>
                  {currentUser.name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>

      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPreviewItem(null)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
               <div className="flex items-center space-x-4">
                  <div className={`bg-${getRoleColor(previewItem.role)} p-3 rounded-2xl text-white`}>
                    {navItems.find(n => n.id === previewItem.type)?.icon({ className: 'w-6 h-6' }) || <ICONS.Sparkles className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{previewItem.title}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {previewItem.collegeName} • {previewItem.department} • By {previewItem.userName}
                    </p>
                  </div>
               </div>
               <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-50/30">
              <div className={`max-w-3xl mx-auto bg-white p-12 rounded-[2rem] shadow-sm border-l-4 border-${getRoleColor(previewItem.role)} prose text-slate-900 max-w-none`}>
                <div dangerouslySetInnerHTML={{ __html: previewItem.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
               <div className="flex items-center space-x-6">
                  {previewItem.approvalStatus === 'Approved_Mgmt' ? (
                    <div className="flex items-center text-emerald-600 text-xs font-black uppercase tracking-widest">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                      Verified & Saved to Vault
                    </div>
                  ) : previewItem.approvalStatus === 'Approved_Dept' ? (
                    <div className="flex items-center text-indigo-600 text-xs font-black uppercase tracking-widest">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                      Verified by Department
                    </div>
                  ) : previewItem.approvalStatus === 'Rejected' ? (
                    <div className="flex flex-col">
                       <div className="flex items-center text-red-600 text-xs font-black uppercase tracking-widest">Revision Required</div>
                       {previewItem.feedback && <p className="text-[10px] text-slate-400 mt-1 italic">"{previewItem.feedback}"</p>}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] font-black text-amber-500 uppercase flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mr-2"></span>
                        Awaiting Review
                      </span>
                      {currentUser.role === 'Department' && (previewItem.role === 'Faculty' || previewItem.role === 'Student') && (
                        <div className="flex space-x-2">
                          <button onClick={() => handleApproval(previewItem.id, 'Approved_Dept')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase">Verify</button>
                        </div>
                      )}
                      {currentUser.role === 'Management' && (
                        <div className="flex space-x-2">
                          <button onClick={() => handleApproval(previewItem.id, 'Approved_Mgmt')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Authorize</button>
                          <button onClick={() => handleApproval(previewItem.id, 'Rejected', 'Rejected by Management')} className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase">Deny</button>
                        </div>
                      )}
                    </div>
                  )}
               </div>
               <div className="flex items-center space-x-4">
                  <button onClick={() => { navigator.clipboard.writeText(previewItem.content); alert('Copied to clipboard!'); }} className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Copy Source</button>
                  <button onClick={() => window.print()} className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Print Forge</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
