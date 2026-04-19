
import React, { useState } from 'react';
import { UserInfo, AppView } from '../types';
import { ICONS } from '../constants';
import { 
  generateStudentStudyPlan, 
  generateStudentTimeMgmt, 
  generatePracticeQuiz,
  generatePersonalInterestRoadmap
} from '../services/gemini';

interface Props {
  user: UserInfo;
  onGenerated: (item: any) => void;
}

const StudentTools: React.FC<Props> = ({ user, onGenerated }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [requestApproval, setRequestApproval] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    subject: '',
    hours: '9:00 AM - 4:00 PM',
    knowledge: 'Beginner'
  });

  const runPersonalTool = async (tool: 'plan' | 'time' | 'quiz' | 'interest') => {
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
      } else if (tool === 'interest') {
        type = 'student-interest-course';
        title = `Personal Roadmap: ${personalForm.subject}`;
        content = await generatePersonalInterestRoadmap({
          ...user,
          userName: user.name,
          interestSubject: personalForm.subject,
          collegeHours: personalForm.hours,
          priorKnowledge: personalForm.knowledge
        });
        setShowPersonalModal(false);
      }

      onGenerated({
        type,
        title,
        content: content || 'Failed to sync with neural network.',
        requestApproval // PASS THE FLAG TO APP.TSX
      });
    } catch (e) {
      console.error(e);
      alert('Neural link interrupted. Try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ICONS.Sparkles className="w-64 h-64 text-amber-400" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
             <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Cognitive Enhancement</span>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none">AI Study Lab</h2>
          <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed opacity-80">
            Synthesize personalized learning frameworks. Generate custom study paths, 
            optimize your academic schedule, and benchmark your mastery with AI-driven practice.
          </p>
        </div>
      </div>

      {/* Global Approval Selection Toggle */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
         <div className="flex items-center space-x-5">
            <div className={`p-4 rounded-2xl transition-colors ${requestApproval ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
               <ICONS.Institution className="w-6 h-6" />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Institutional Sync Mode</h4>
               <p className="text-xs font-medium text-slate-500 mt-1">
                 {requestApproval 
                   ? "Items will be submitted to the HOD for official verification and certification." 
                   : "Items are saved privately to your academic vault (No institutional review)."}
               </p>
            </div>
         </div>
         <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={requestApproval}
              onChange={() => setRequestApproval(!requestApproval)}
            />
            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
         </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => runPersonalTool('plan')}>
           <div className="flex items-center space-x-5 mb-8">
              <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                 <ICONS.Sparkles className="w-7 h-7" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Study Roadmap</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Academic Strategic Plan</p>
              </div>
           </div>
           <p className="text-slate-500 leading-relaxed font-medium mb-8">Generate a prioritized 4-week learning framework based on your current course load and academic goals.</p>
           <button className="w-full py-4 bg-slate-50 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
             {loading === 'plan' ? 'Synthesizing Roadmap...' : 'Execute Generation'}
           </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => runPersonalTool('time')}>
           <div className="flex items-center space-x-5 mb-8">
              <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                 <ICONS.Timetable className="w-7 h-7" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Time Manager</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Optimized Lifecycle</p>
              </div>
           </div>
           <p className="text-slate-500 leading-relaxed font-medium mb-8">Construct a balanced daily routine that synchronizes academic commitments with personal growth and rest.</p>
           <button className="w-full py-4 bg-slate-50 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
             {loading === 'time' ? 'Synchronizing Schedule...' : 'Optimize Routine'}
           </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => runPersonalTool('quiz')}>
           <div className="flex items-center space-x-5 mb-8">
              <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                 <ICONS.Assessment className="w-7 h-7" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Practice Arena</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Mastery Benchmarking</p>
              </div>
           </div>
           <p className="text-slate-500 leading-relaxed font-medium mb-8">Forge instant, department-aligned self-assessment quizzes to validate your understanding of core concepts.</p>
           <button className="w-full py-4 bg-slate-50 rounded-xl text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
             {loading === 'quiz' ? 'Forging Quiz Matrix...' : 'Enter Arena'}
           </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => setShowPersonalModal(true)}>
           <div className="flex items-center space-x-5 mb-8">
              <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-110 transition-transform">
                 <ICONS.Institution className="w-7 h-7" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Interest Lab</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Parallel Learning</p>
              </div>
           </div>
           <p className="text-slate-500 leading-relaxed font-medium mb-8">Design an extra-curricular learning roadmap for any subject that interests you beyond your official degree.</p>
           <button className="w-full py-4 bg-slate-50 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
             Launch Personal Studio
           </button>
        </div>
      </div>

      {showPersonalModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowPersonalModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Personal Course Studio</h3>
            <p className="text-slate-500 mb-8 font-medium">Design a private learning roadmap that bypasses your college schedule.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">What do you want to learn?</label>
                <input 
                  type="text" 
                  placeholder="e.g. Modern UI/UX Design, Python Automation"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                  value={personalForm.subject}
                  onChange={e => setPersonalForm({...personalForm, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Standard College Hours (to exclude)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 9:00 AM - 4:00 PM"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                  value={personalForm.hours}
                  onChange={e => setPersonalForm({...personalForm, hours: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Knowledge Level</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 appearance-none"
                  value={personalForm.knowledge}
                  onChange={e => setPersonalForm({...personalForm, knowledge: e.target.value})}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <button 
                onClick={() => runPersonalTool('interest')}
                disabled={loading === 'interest' || !personalForm.subject}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-600/20"
              >
                {loading === 'interest' ? 'Synthesizing Path...' : 'Forge Personal Roadmap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTools;
