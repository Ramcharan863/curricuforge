
import React, { useState } from 'react';
import { GeneratedContent } from '../../types';
import { ICONS } from '../../constants';

interface Props {
  history: GeneratedContent[];
  onNavigate: (view: any) => void;
  collegeName: string;
  userDept: string;
  userName: string;
}

type FacultyTab = 'studio' | 'students' | 'analytics';

const FacultyDashboard: React.FC<Props> = ({ history, onNavigate, collegeName, userDept, userName }) => {
  const [activeTab, setActiveTab] = useState<FacultyTab>('studio');
  const myWork = history.filter(h => h.userName === userName);
  
  // Prioritized notices: Management first, then departmental
  const globalNotices = history.filter(h => h.isPublished && h.role === 'Management' && h.type === 'announcement');
  const deptNotices = history.filter(h => h.isPublished && h.department === userDept && h.role === 'Department');

  // Mock Student Data
  const myStudents = [
    { id: 'S101', name: 'Alice Smith', section: 'CSE-1A', performance: 'Excellent', attendance: '95%' },
    { id: 'S102', name: 'Bob Johnson', section: 'CSE-1A', performance: 'Good', attendance: '88%' },
    { id: 'S103', name: 'Charlie Davis', section: 'CSE-1B', performance: 'Needs Work', attendance: '74%' },
    { id: 'S104', name: 'Dana White', section: 'CSE-1A', performance: 'Average', attendance: '82%' },
    { id: 'S105', name: 'Edward Norton', section: 'CSE-1B', performance: 'Excellent', attendance: '98%' },
  ];

  // Mock Performance Data
  const sectionMetrics = [
    { section: 'CSE-1A', avgGpa: '3.8', completion: '92%', topTopic: 'Data Structures' },
    { section: 'CSE-1B', avgGpa: '3.4', completion: '85%', topTopic: 'Calculus' },
  ];

  const getStatusBadge = (item: GeneratedContent) => {
    switch (item.approvalStatus) {
      case 'Approved_Mgmt': return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[8px] font-black uppercase">Finalized</span>;
      case 'Approved_Dept': return <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-[8px] font-black uppercase">Dept Verified</span>;
      case 'Rejected': return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[8px] font-black uppercase">Rejected</span>;
      default: return <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[8px] font-black uppercase">Pending</span>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ICONS.Curriculum className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
             <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white">Faculty Command Terminal</span>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none text-white">{userName}</h2>
          <p className="text-blue-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
            {collegeName} • {userDept} Faculty. Orchestrate curricula, manage student neural growth, 
            and analyze pedagogical outcomes.
          </p>
        </div>
      </div>

      {/* Faculty Sub-Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-1">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'studio' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <ICONS.Sparkles className="w-4 h-4" />
          <span>Neural Studio</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'students' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <ICONS.Institution className="w-4 h-4" />
          <span>Student Registry</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <ICONS.Update className="w-4 h-4" />
          <span>Performance Insights</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          {activeTab === 'studio' && (
            <>
              {/* Submission Tracker */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Artifacts</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{myWork.length} TOTAL</span>
                </div>
                <div className="space-y-4">
                    {myWork.length === 0 ? (
                      <div className="py-12 text-center text-slate-300 font-bold italic">No active submissions initiated.</div>
                    ) : (
                      myWork.map(h => (
                        <div key={h.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group">
                          <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                {ICONS.Curriculum({ className: 'w-5 h-5' })}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{h.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                  {h.type} • {h.targetSection || 'Global'} • {new Date(h.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                          </div>
                          <div className="flex items-center space-x-4">
                              {getStatusBadge(h)}
                              <button className="text-slate-300 hover:text-slate-900 transition-colors"><ICONS.Update className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))
                    )}
                </div>
              </div>

              {/* Notice Stream */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">Institutional Authorized Stream</h3>
                <div className="space-y-5">
                    {[...globalNotices, ...deptNotices].length === 0 ? (
                      <div className="p-10 border border-dashed border-slate-200 rounded-3xl text-center text-slate-400 font-bold italic">No authorized broadcasts currently active.</div>
                    ) : (
                      [...globalNotices, ...deptNotices].slice(0, 5).map(n => (
                        <div key={n.id} className={`p-6 border rounded-3xl ${n.role === 'Management' ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center justify-between mb-2">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${n.role === 'Management' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}>
                                {n.role === 'Management' ? 'Official Global Directive' : `From ${userDept} HOD`}
                              </span>
                              <span className="text-[9px] font-black text-slate-400">{new Date(n.timestamp).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-black text-slate-900 text-lg mb-2">{n.title}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{n.content}</p>
                        </div>
                      ))
                    )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'students' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Neural Growth Monitor (Student Registry)</h3>
              <div className="overflow-hidden border border-slate-100 rounded-3xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Student</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Section</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Attendance</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 text-sm">{s.name}</td>
                        <td className="px-6 py-4 text-xs font-black text-slate-400 text-center">{s.section}</td>
                        <td className="px-6 py-4 text-xs font-bold text-blue-600 text-center">{s.attendance}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                            s.performance === 'Excellent' ? 'bg-emerald-100 text-emerald-600' : 
                            s.performance === 'Good' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {s.performance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Section-Wise Neural Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sectionMetrics.map(m => (
                    <div key={m.section} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <ICONS.Sparkles className="w-24 h-24" />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2">{m.section}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Performance Profile</p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Average GPA</span>
                          <span className="text-2xl font-black text-blue-600">{m.avgGpa}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Submission Completion</span>
                          <span className="text-2xl font-black text-emerald-600">{m.completion}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Critical Mastery Area</p>
                          <p className="text-sm font-bold text-slate-900">{m.topTopic}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Option Analysis (Insight Panel) */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
                 <div className="flex items-center space-x-3 mb-8">
                    <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg"><ICONS.Update className="w-5 h-5" /></div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Assignment Insights (Option Analysis)</h3>
                 </div>
                 <div className="space-y-6">
                    <div className="p-6 bg-slate-800 rounded-3xl border border-slate-700">
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Recent Assignment: Data Structures Quiz</p>
                       <h4 className="text-lg font-black text-white mb-4">Critical Question Failure Detected</h4>
                       <p className="text-sm text-slate-400 leading-relaxed mb-6">
                          Analysis shows that <strong>68% of students in CSE-1A</strong> failed to correctly answer Question 4 (Time Complexity of Heapsort). 
                          Recommendation: Brief re-instruction during next session.
                       </p>
                       <div className="flex space-x-4">
                          <div className="flex-1 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                             <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Correct %</p>
                             <p className="text-xl font-black text-emerald-500">32%</p>
                          </div>
                          <div className="flex-1 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                             <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Most Picked Distractor</p>
                             <p className="text-xl font-black text-red-500">Option C</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
              <h3 className="text-lg font-black uppercase tracking-tight mb-6 text-white text-white">Action Hub</h3>
              <div className="grid grid-cols-1 gap-4">
                 <button onClick={() => onNavigate('curriculum')} className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all">New Curriculum</button>
                 <button onClick={() => onNavigate('lesson-plan')} className="w-full py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-700 transition-all">New Lesson Plan</button>
                 <button onClick={() => onNavigate('assignment')} className="w-full py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-700 transition-all">New Assessment</button>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Institutional Stats</h4>
              <div className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assigned Students</p>
                    <p className="text-2xl font-black text-slate-900">128</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Performance</p>
                    <p className="text-2xl font-black text-blue-600">84%</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
