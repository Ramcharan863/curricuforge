
import React, { useState } from 'react';
import { GeneratedContent, ApprovalStatus } from '../../types';
import { ICONS } from '../../constants';

interface Props {
  history: GeneratedContent[];
  onNavigate: (view: any) => void;
  collegeName: string;
  onApprove: (id: string, status: ApprovalStatus, feedback?: string) => void;
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const ManagementDashboard: React.FC<Props> = ({ history, onNavigate, collegeName, onApprove, onGenerated }) => {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  
  // Management sees EVERYTHING that is not yet fully authorized by Management
  const masterQueue = history.filter(h => h.approvalStatus === 'Pending' || h.approvalStatus === 'Approved_Dept');
  const authorizedCount = history.filter(h => h.approvalStatus === 'Approved_Mgmt').length;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    
    // Inject the broadcast into the central history stream
    onGenerated({
      type: 'announcement',
      title: 'OFFICIAL INSTITUTIONAL BROADCAST',
      content: broadcastMsg,
      isPublished: true,
      targetAudience: 'All'
    });
    
    setBroadcastMsg('');
    alert('Strategic Directive propagated to all departmental and student boards.');
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ICONS.Institution className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
             <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Global Governance Hub</span>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none">{collegeName}</h2>
          <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed opacity-80">
            Supreme academic authority. Verify departmental frameworks, broadcast institutional updates, 
            and authorize mission-critical syllabi for global distribution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hierarchical Approval Queue */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Master Authorization Queue</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-Departmental Oversight</p>
             </div>
             <span className="text-[10px] font-black text-white bg-slate-900 px-3 py-1 rounded-full uppercase tracking-tighter">{masterQueue.length} TASKS</span>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
             {masterQueue.length === 0 ? (
               <div className="py-20 text-center flex flex-col items-center opacity-30">
                 <ICONS.Sparkles className="w-12 h-12 mb-4" />
                 <p className="text-sm font-black uppercase tracking-widest">Institution Synchronized</p>
               </div>
             ) : (
               masterQueue.map(item => (
                 <div key={item.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="flex items-center space-x-2 mb-1">
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.approvalStatus === 'Approved_Dept' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                              {item.approvalStatus === 'Approved_Dept' ? 'Dept Verified' : 'Initial Submission'}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.department}</span>
                        </div>
                        <p className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{item.title}</p>
                        <p className="text-xs font-bold text-slate-500 mt-1">Submitted by: {item.userName} ({item.role})</p>
                     </div>
                   </div>
                   <div className="flex space-x-2">
                     <button onClick={() => onApprove(item.id, 'Approved_Mgmt')} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 transition-all shadow-md">Authorize Final</button>
                     <button onClick={() => onApprove(item.id, 'Rejected', 'Rejected by Management')} className="px-5 py-3 border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-red-50 hover:text-red-600 transition-all">Deny</button>
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>

        <div className="space-y-8">
           {/* Broadcast Tool */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm bg-gradient-to-br from-white to-blue-50/30">
             <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg"><ICONS.Update className="w-5 h-5" /></div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Institutional Broadcast</h3>
             </div>
             <form onSubmit={handleBroadcast} className="space-y-4">
                <p className="text-xs font-bold text-slate-500 leading-relaxed">Publish mandatory announcements, academic calendars, or global timetables to the entire institution notice board.</p>
                <textarea 
                   placeholder="Enter official institutional notice..."
                   className="w-full h-32 px-6 py-4 bg-white rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium text-sm resize-none"
                   value={broadcastMsg}
                   onChange={e => setBroadcastMsg(e.target.value)}
                />
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl">Transmit to Notice Board</button>
             </form>
           </div>

           {/* Metrics */}
           <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-xl">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Authorized Frameworks</p>
                 <p className="text-4xl font-black">{authorizedCount}</p>
                 <ICONS.Sparkles className="w-12 h-12 absolute bottom-4 right-4 opacity-20" />
              </div>
              <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Active Departments</p>
                 <p className="text-4xl font-black">12</p>
                 <ICONS.Institution className="w-12 h-12 absolute bottom-4 right-4 opacity-20" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
