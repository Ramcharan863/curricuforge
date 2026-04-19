
import React from 'react';
import { ICONS } from '../constants';

const StudentReminders: React.FC = () => {
  const reminders = [
    { id: 1, title: "Math Assignment Submission", sub: "Calculus & Linear Algebra", date: "Tomorrow, 10:00 AM", status: "Urgent", color: "bg-red-500" },
    { id: 2, title: "Unit Test: Data Structures", sub: "CSE Core Module", date: "Friday, 2:00 PM", status: "Exam", color: "bg-blue-500" },
    { id: 3, title: "Lab Record Verification", sub: "AI & ML Laboratory", date: "Next Monday", status: "Submission", color: "bg-emerald-500" },
    { id: 4, title: "Course Registration Audit", sub: "Institutional Compliance", date: "By end of week", status: "Task", color: "bg-slate-900" },
    { id: 5, title: "Inter-College Hackathon", sub: "Co-curricular Activity", date: "Sept 15-17", status: "Event", color: "bg-indigo-600" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-emerald-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ICONS.Timetable className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
             <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Time Synchronization</span>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none">Academic Reminders</h2>
          <p className="text-emerald-100 max-w-2xl text-lg font-medium leading-relaxed opacity-80">
            Your personalized academic timeline. Track upcoming deadlines, assessment schedules, 
            and critical institutional events in real-time.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Neural Timeline Vector</h3>
           <div className="flex space-x-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">5 Active Reminders</span>
           </div>
        </div>
        <div className="divide-y divide-slate-50">
           {reminders.map(rem => (
             <div key={rem.id} className="p-10 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center space-x-8">
                   <div className={`${rem.color} w-16 h-16 rounded-2xl shadow-lg text-white flex items-center justify-center shrink-0`}>
                      <ICONS.Timetable className="w-7 h-7" />
                   </div>
                   <div>
                      <div className="flex items-center space-x-3 mb-1">
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{rem.sub}</span>
                         <span className="text-slate-300">•</span>
                         <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${rem.color} text-white`}>{rem.status}</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{rem.title}</h4>
                      <p className="text-slate-400 font-bold text-sm mt-1">{rem.date}</p>
                   </div>
                </div>
                <button className="px-6 py-3 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">Mark Processed</button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default StudentReminders;
