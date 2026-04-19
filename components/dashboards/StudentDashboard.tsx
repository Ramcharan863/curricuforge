
import React, { useState, useEffect } from 'react';
import { GeneratedContent, UserInfo, AppView } from '../../types';
import { ICONS } from '../../constants';
import { 
  generateStudentStudyPlan, 
  generateStudentTimeMgmt, 
  generatePracticeQuiz,
} from '../../services/gemini';

interface Props {
  history: GeneratedContent[];
  user: UserInfo;
  onNavigate: (view: AppView) => void;
  onGenerated: (item: any) => void;
}

const StudentDashboard: React.FC<Props> = ({ history, user, onNavigate, onGenerated }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [requestApproval, setRequestApproval] = useState(false);

  // Update time for lock logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const reminders = [
    { id: 1, text: "Submit Math Assignment", date: "Tomorrow, 10:00 AM", category: "Critical" },
    { id: 2, text: "Unit Test: Data Structures", date: "Friday, 2:00 PM", category: "Exam" },
  ];

  // Announcements from Management/Higher Authorities
  const announcements = history.filter(h => 
    h.isPublished && h.type === 'announcement' && (h.role === 'Management' || h.role === 'Department')
  );

  // Curriculum materials and section-targeted assignments
  const resourceStream = history.filter(h => 
    h.isPublished && 
    h.type !== 'announcement' &&
    (
      h.department === user.department || 
      h.role === 'Management' || 
      (h.targetSection && h.targetSection === user.roleSpecificData?.section)
    )
  );

  const isAssignmentExpired = (item: GeneratedContent) => {
    if (!item.durationMillis) return true;
    const expiry = item.timestamp + item.durationMillis;
    return currentTime > expiry;
  };

  const getRemainingTimeStr = (item: GeneratedContent) => {
    if (!item.durationMillis) return "Review phase active";
    const expiry = item.timestamp + item.durationMillis;
    const diff = expiry - currentTime;
    if (diff <= 0) return "Duration Complete • Answer Key Revealed";
    
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `Active • Keys locked for ${hours}h ${mins}m`;
  };

  const runPersonalTool = async (tool: 'plan' | 'time' | 'quiz') => {
    setLoading(tool);
    try {
      let content = '';
      let title = '';
      let type: AppView = 'student-study-plan';

      if (tool === 'plan') {
        title = `Study Roadmap: Semester ${user.roleSpecificData?.year || 'Current'}`;
        content = await generateStudentStudyPlan({
          ...user,
          userName: user.name,
          currentCourses: user.department + " Core Subjects",
          goals: "Academic Excellence & Mastery"
        });
      } else if (tool === 'time') {
        type = 'student-time-mgmt';
        title = "Balanced Daily Lifecycle";
        content = await generateStudentTimeMgmt({
          ...user,
          userName: user.name,
          currentCourses: "Engineering Workload",
          goals: "Gaming, Fitness, Professional Networking"
        });
      } else if (tool === 'quiz') {
        type = 'student-practice';
        title = "Self-Practice Arena Quiz";
        content = await generatePracticeQuiz({
          ...user,
          userName: user.name,
          subject: "Departmental Fundamentals",
          topic: "Key Learning Outcomes",
          intensity: 'Challenge'
        });
      }

      onGenerated({
        type,
        title,
        content: content || 'Failed to sync with neural network.',
        requestApproval
      });
    } catch (e) {
      console.error(e);
      alert('Neural link interrupted. Try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      {/* Attendance & Stats Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-emerald-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <ICONS.Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
               <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md text-white">Identity: {user.roleSpecificData?.section || 'Independent'}</span>
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter leading-none text-white">Welcome, {user.name}</h2>
            <p className="text-emerald-100 max-w-lg text-sm font-medium leading-relaxed opacity-90 mb-8">
              Logged into the {user.department} Portal. Review institutional broadcasts and access your academic resources below.
            </p>
            
            <div className="flex items-center space-x-12">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Attendance</p>
                  <div className="flex items-center space-x-4">
                     <span className="text-4xl font-black">92%</span>
                     <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '92%' }}></div>
                     </div>
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Cognitive Rank</p>
                  <span className="text-4xl font-black">L4</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
           <div>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Neural Reminders</h3>
                 <button onClick={() => onNavigate('student-reminders')} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                 {reminders.map(rem => (
                   <div key={rem.id} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${rem.category === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                      <div>
                         <p className="text-xs font-black text-slate-900 leading-none mb-1">{rem.text}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{rem.date}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <button onClick={() => onNavigate('student-reminders')} className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase hover:bg-slate-50 transition-all">Open Timeline</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Institutional Bulletin Board Overview */}
          <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ICONS.Institution className="w-40 h-40" />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg"><ICONS.Update className="w-5 h-5" /></div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Latest Institutional Notices</h3>
                    </div>
                    <button onClick={() => onNavigate('student-announcements')} className="text-[10px] font-black text-blue-300 uppercase tracking-widest hover:text-white transition-colors">Open Board</button>
                  </div>
                  <div className="space-y-4">
                    {announcements.length === 0 ? (
                      <p className="text-indigo-200 font-bold italic opacity-60">No recent announcements from management.</p>
                    ) : (
                      announcements.slice(0, 2).map(ann => (
                        <div key={ann.id} className="p-6 bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl hover:bg-white/20 transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                             <span className="px-2 py-0.5 bg-blue-500 text-[8px] font-black uppercase rounded tracking-widest text-white">Official Management Directive</span>
                             <span className="text-[9px] font-black text-white/40">{new Date(ann.timestamp).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-lg font-black text-white mb-2 group-hover:text-blue-300 transition-colors">{ann.title}</h4>
                          <p className="text-sm text-indigo-100 line-clamp-1 leading-relaxed">{ann.content}</p>
                        </div>
                      ))
                    )}
                  </div>
               </div>
          </div>

          {/* Academic Resource Stream */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Academic Resource Stream</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Instructional Materials</p>
                </div>
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                   <ICONS.Curriculum className="w-5 h-5" />
                </div>
             </div>
             
             <div className="space-y-6">
                {resourceStream.length === 0 ? (
                  <div className="py-20 text-center text-slate-300 font-bold italic border border-dashed border-slate-100 rounded-3xl">
                    Awaiting published resources from Faculty.
                  </div>
                ) : (
                  resourceStream.slice(0, 4).map(item => {
                    const isAssignment = item.type === 'assignment';
                    const expired = isAssignment ? isAssignmentExpired(item) : true;
                    
                    return (
                      <div key={item.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:shadow-lg transition-all group cursor-pointer">
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-4">
                               <div className={`p-3 rounded-2xl ${item.role === 'Management' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}>
                                  {item.type === 'timetable' ? <ICONS.Timetable className="w-5 h-5" /> : <ICONS.Curriculum className="w-5 h-5" />}
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official {item.type}</p>
                                  <p className="font-black text-slate-900 text-xl group-hover:text-emerald-600 transition-colors">{item.title}</p>
                               </div>
                            </div>
                            <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 uppercase hover:bg-slate-900 hover:text-white transition-all">View</button>
                         </div>
                      </div>
                    );
                  })
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-6">
              <div className="flex items-center justify-between mb-1">
                 <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Synthesis Lab</h3>
                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed">AI Study Support</p>
                 </div>
                 <button onClick={() => onNavigate('student-tools')} className="p-2 bg-slate-800 rounded-xl text-amber-400 hover:bg-slate-700 transition-all"><ICONS.Sparkles className="w-5 h-5" /></button>
              </div>

              {/* Quick Verification Selector */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between mb-2">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verification Sync</span>
                 <label className="relative inline-flex items-center cursor-pointer scale-75">
                    <input type="checkbox" className="sr-only peer" checked={requestApproval} onChange={() => setRequestApproval(!requestApproval)} />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                 </label>
              </div>
              
              <div className="space-y-4">
                 <button 
                  onClick={() => runPersonalTool('plan')}
                  disabled={loading !== null}
                  className="w-full p-4 bg-emerald-600 rounded-2xl text-left hover:bg-emerald-500 transition-all group"
                 >
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white">Roadmap Tool</span>
                       <ICONS.Sparkles className="w-4 h-4 text-emerald-300" />
                    </div>
                    <p className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform">Forge Study Plan</p>
                 </button>

                 <button 
                  onClick={() => runPersonalTool('time')}
                  disabled={loading !== null}
                  className="w-full p-4 bg-slate-800 rounded-2xl text-left hover:bg-slate-700 transition-all group"
                 >
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white">Life Optimizer</span>
                       <ICONS.Timetable className="w-4 h-4 text-indigo-400" />
                    </div>
                    <p className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform">Schedule Synthesis</p>
                 </button>
              </div>
              <button onClick={() => onNavigate('student-tools')} className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-all">Open AI Lab Hub</button>
           </div>

           {/* Performance Visualization */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Growth Analytics</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery</span>
                       <span className="text-[10px] font-black text-emerald-600">82%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
