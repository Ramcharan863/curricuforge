
import React, { useState } from 'react';
import { 
  GeneratedContent, 
  ApprovalStatus, 
  FacultyAsset, 
  StudentAsset, 
  SectionAsset, 
  ClassroomAsset, 
  SyllabusDocument 
} from '../../types';
import { ICONS } from '../../constants';

interface Props {
  history: GeneratedContent[];
  onNavigate: (view: any) => void;
  collegeName: string;
  userDept: string;
  onApprove: (id: string, status: ApprovalStatus, feedback?: string) => void;
}

type DeptTab = 'queue' | 'faculty' | 'students' | 'sections' | 'classes' | 'syllabus';

const DepartmentDashboard: React.FC<Props> = ({ history, onNavigate, collegeName, userDept, onApprove }) => {
  const [activeTab, setActiveTab] = useState<DeptTab>('queue');
  const [deptMsg, setDeptMsg] = useState('');
  
  // Mock Department Data
  const faculty: FacultyAsset[] = [
    { id: 'F001', name: 'Dr. Alan Turing', designation: 'Professor', specialization: 'Theory of Computation', load: '12 Hours' },
    { id: 'F002', name: 'Prof. Grace Hopper', designation: 'Asst. Professor', specialization: 'Compiler Design', load: '16 Hours' },
    { id: 'F003', name: 'Dr. Geoffrey Hinton', designation: 'Head of Research', specialization: 'Neural Networks', load: '8 Hours' },
  ];

  const students: StudentAsset[] = [
    { id: 'S101', name: 'Alice Smith', rollNo: 'CSE-2024-001', year: '3rd Year', section: 'CSE-A' },
    { id: 'S102', name: 'Bob Johnson', rollNo: 'CSE-2024-002', year: '3rd Year', section: 'CSE-A' },
    { id: 'S103', name: 'Charlie Davis', rollNo: 'CSE-2024-003', year: '3rd Year', section: 'CSE-B' },
  ];

  const sections: SectionAsset[] = [
    { id: 'SEC-A', name: 'CSE-A', strength: 60, classTeacher: 'Dr. Alan Turing' },
    { id: 'SEC-B', name: 'CSE-B', strength: 58, classTeacher: 'Prof. Grace Hopper' },
  ];

  const classrooms: ClassroomAsset[] = [
    { id: 'R101', roomNo: 'Room 101', type: 'Theory', capacity: 70 },
    { id: 'R102', roomNo: 'Room 102', type: 'Theory', capacity: 70 },
    { id: 'L304', roomNo: 'AI & ML Lab', type: 'Lab', capacity: 40 },
  ];

  const syllabusRepo: SyllabusDocument[] = [
    { id: 'DOC1', title: 'Data Structures Core Syllabus', type: 'pdf', postedAt: Date.now() - 86400000, author: 'Dr. Turing' },
    { id: 'DOC2', title: 'Mid-Term Lab Schedule (Image)', type: 'image', postedAt: Date.now() - 172800000, author: 'HOD Office' },
    { id: 'DOC3', title: 'Algorithm Assessment Guidelines', type: 'doc', postedAt: Date.now() - 259200000, author: 'Prof. Hopper' },
  ];

  const deptQueue = history.filter(h => h.department === userDept && h.approvalStatus === 'Pending');
  const myVerified = history.filter(h => h.department === userDept && h.approvalStatus.startsWith('Approved')).length;
  const institutionalDirectives = history.filter(h => h.isPublished && h.role === 'Management' && h.type === 'announcement');

  const handleDeptBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptMsg.trim()) return;
    alert(`Department Broadcast Published for ${userDept}: ${deptMsg}`);
    setDeptMsg('');
  };

  const getDocIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <div className="p-2 bg-red-100 text-red-600 rounded-lg"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg></div>;
      case 'image': return <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>;
      default: return <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg></div>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ICONS.Update className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
             <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Department Control</span>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none">{userDept}</h2>
          <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-90">
            {collegeName} Operational Center. Managing Faculty resources, Student records, 
            infrastructure allocations, and authenticated syllabus repositories.
          </p>
        </div>
      </div>

      {/* Primary Management Sub-Nav */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-1">
        {[
          { id: 'queue', label: 'Review Queue', icon: ICONS.Update },
          { id: 'faculty', label: 'Faculty Directory', icon: ICONS.Lesson },
          { id: 'students', label: 'Student Records', icon: ICONS.Sparkles },
          { id: 'sections', label: 'Academic Sections', icon: ICONS.Timetable },
          { id: 'classes', label: 'Infrastructure', icon: ICONS.Institution },
          { id: 'syllabus', label: 'Syllabus Repository', icon: ICONS.Curriculum },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DeptTab)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Dynamic Content Area based on Tab */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm min-h-[600px]">
             
             {/* Tab 1: Review Queue */}
             {activeTab === 'queue' && (
                <div>
                   <div className="flex items-center justify-between mb-8">
                      <div>
                         <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Validation Queue</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reviewing Faculty & Student Work</p>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">{deptQueue.length} PENDING</span>
                   </div>
                   <div className="space-y-4">
                      {deptQueue.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center opacity-30">
                          <ICONS.Update className="w-12 h-12 mb-4" />
                          <p className="text-sm font-black uppercase tracking-widest">Queue Processed</p>
                        </div>
                      ) : (
                        deptQueue.map(item => (
                          <div key={item.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group">
                             <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{item.type} Submission</p>
                             <p className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors mb-1">{item.title}</p>
                             <p className="text-xs font-bold text-slate-500 mb-4 italic">By {item.userName} ({item.role})</p>
                             <div className="flex space-x-2">
                                <button onClick={() => onApprove(item.id, 'Approved_Dept')} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 transition-all shadow-md">Verify & Publish</button>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             )}

             {/* Tab 2: Faculty Directory */}
             {activeTab === 'faculty' && (
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Faculty Matrix</h3>
                   <div className="overflow-hidden border border-slate-100 rounded-3xl">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Faculty Name</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Designation</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Specialization</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Load</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {faculty.map(f => (
                            <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-900 text-sm">{f.name}</td>
                              <td className="px-6 py-4 text-xs font-bold text-slate-500">{f.designation}</td>
                              <td className="px-6 py-4 text-xs font-bold text-indigo-600">{f.specialization}</td>
                              <td className="px-6 py-4 text-xs font-black text-slate-400">{f.load}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
             )}

             {/* Tab 3: Student Records */}
             {activeTab === 'students' && (
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Enrolled Students</h3>
                   <div className="overflow-hidden border border-slate-100 rounded-3xl">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Student Name</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Roll Number</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Batch</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Section</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {students.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-900 text-sm">{s.name}</td>
                              <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500">{s.rollNo}</td>
                              <td className="px-6 py-4 text-xs font-bold text-slate-500">{s.year}</td>
                              <td className="px-6 py-4 text-xs font-black text-emerald-600">{s.section}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
             )}

             {/* Tab 4: Sections & Timetables */}
             {activeTab === 'sections' && (
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Section-Wise Timetables</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sections.map(sec => (
                        <div key={sec.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                              <ICONS.Timetable className="w-24 h-24" />
                           </div>
                           <h4 className="text-2xl font-black text-slate-900 mb-2">{sec.name}</h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-6">Strength: {sec.strength} Students</p>
                           <div className="flex items-center space-x-3 mb-6">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black">HT</div>
                              <p className="text-xs font-bold text-slate-600">Mentor: {sec.classTeacher}</p>
                           </div>
                           <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Review Weekly Schedule</button>
                        </div>
                      ))}
                   </div>
                </div>
             )}

             {/* Tab 5: Infrastructure (Classes) */}
             {activeTab === 'classes' && (
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Resource Allocation</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {classrooms.map(room => (
                        <div key={room.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center">
                           <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${room.type === 'Lab' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                              <ICONS.Institution className="w-6 h-6" />
                           </div>
                           <h4 className="font-black text-slate-900 text-lg mb-1">{room.roomNo}</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">{room.type} Block</p>
                           <div className="px-4 py-2 bg-white rounded-full text-[10px] font-black text-slate-600 border border-slate-100 inline-block">CAPACITY: {room.capacity}</div>
                        </div>
                      ))}
                   </div>
                </div>
             )}

             {/* Tab 6: Syllabus Repository */}
             {activeTab === 'syllabus' && (
                <div>
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-slate-900 uppercase">Syllabus Repository</h3>
                      <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 transition-all shadow-lg flex items-center space-x-2">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                         <span className="text-white">Post Document</span>
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {syllabusRepo.map(doc => (
                        <div key={doc.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center space-x-4 hover:border-indigo-200 transition-all cursor-pointer group">
                           {getDocIcon(doc.type)}
                           <div className="flex-1">
                              <h4 className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{doc.title}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                                 Posted by {doc.author} • {new Date(doc.postedAt).toLocaleDateString()}
                              </p>
                           </div>
                           <button className="p-2 text-slate-300 hover:text-indigo-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
                        </div>
                      ))}
                   </div>
                   <div className="mt-8 p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-4 text-slate-300"><ICONS.Update className="w-10 h-10" /></div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drag & Drop Syllabus Assets Here</p>
                      <p className="text-[10px] text-slate-300 mt-2 italic">PDF, Word (DOCX), and Reference Images supported (Max 25MB)</p>
                   </div>
                </div>
             )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           {/* Action Hub */}
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
              <h3 className="text-lg font-black uppercase tracking-tight mb-6 text-white">Action Hub</h3>
              <div className="grid grid-cols-1 gap-4">
                 <button onClick={() => onNavigate('curriculum')} className="w-full py-4 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all">New Curriculum</button>
                 <button onClick={() => onNavigate('timetable')} className="w-full py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-700 transition-all">New Timetable</button>
              </div>
           </div>

           {/* Institutional Directives Section */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Institutional Directives</h4>
              <div className="space-y-4">
                 {institutionalDirectives.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No global directives issued by Management.</p>
                 ) : (
                    institutionalDirectives.slice(0, 3).map(directive => (
                       <div key={directive.id} className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                          <p className="text-[9px] font-black text-blue-600 uppercase mb-1">Management Broadcast</p>
                          <p className="text-xs font-bold text-slate-900 leading-tight">{directive.content}</p>
                          <p className="text-[8px] text-slate-400 mt-2 font-medium">{new Date(directive.timestamp).toLocaleDateString()}</p>
                       </div>
                    ))
                 )}
              </div>
           </div>

           {/* Dept Broadcast Tool */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm bg-gradient-to-br from-white to-indigo-50/30">
             <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg"><ICONS.Sparkles className="w-5 h-5" /></div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Department Notice</h3>
             </div>
             <form onSubmit={handleDeptBroadcast} className="space-y-4">
                <p className="text-xs font-bold text-slate-500 leading-relaxed">Publish department-specific notices, unit tests, or lab schedules to your students.</p>
                <textarea 
                   placeholder="Enter departmental announcement..."
                   className="w-full h-32 px-6 py-4 bg-white rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none transition-all font-medium text-sm resize-none"
                   value={deptMsg}
                   onChange={e => setDeptMsg(e.target.value)}
                />
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl">Push to Dept Notice Board</button>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
