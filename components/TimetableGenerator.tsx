
import React, { useState } from 'react';
import { generateTimetable } from '../services/gemini';
import { GeneratedContent, AppRole, TimetableParams } from '../types';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  // Updated onGenerated to match App.tsx addHistory signature (omitting department)
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const TimetableGenerator: React.FC<Props> = ({ role, collegeName, userName, department, onGenerated }) => {
  // Correctly type and omit collegeName/role/userName from state
  const [params, setParams] = useState<Omit<TimetableParams, 'role' | 'collegeName' | 'userName'>>({
    department: '',
    subjectsAndFaculty: '',
    sections: 'Section A, Section B, Section C',
    workingDays: 'Monday - Friday',
    periodsPerDay: 7,
  });
  const [loading, setLoading] = useState(false);

  const loadSampleData = () => {
    setParams({
      department: 'Computer Science & Engineering',
      sections: 'CSE-1A, CSE-1B, CSE-2A',
      subjectsAndFaculty: `Data Structures: Dr. Alan Turing (CSE-1A, CSE-1B)
Database Systems: Prof. Grace Hopper (CSE-2A)
Machine Learning: Dr. Geoffrey Hinton (CSE-1A)
Algorithms: Prof. Donald Knuth (CSE-1B, CSE-2A)
Web Tech: Ms. Ada Lovelace (CSE-1A, CSE-2A)`,
      workingDays: 'Monday - Friday',
      periodsPerDay: 7,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.department || !params.subjectsAndFaculty) return;
    
    setLoading(true);
    try {
      // Pass collegeName and userName to service
      const content = await generateTimetable({ ...params, role, collegeName, userName });
      onGenerated({
        type: 'timetable',
        title: `Academic Timetable: ${params.department}`,
        content: content || 'Failed to generate timetable.'
      });
    } catch (error) {
      console.error(error);
      alert('Error generating timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Class & Faculty Scheduler</h3>
            <p className="text-slate-500 font-medium">Automate conflict-free departmental scheduling for classes and faculty.</p>
          </div>
          <button 
            type="button"
            onClick={loadSampleData}
            className="text-[10px] font-black bg-slate-100 text-slate-600 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors uppercase tracking-widest"
          >
            Load Sample Logic
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Department</label>
              <input 
                type="text" 
                placeholder="e.g. Information Technology"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                value={params.department}
                onChange={e => setParams({...params, department: e.target.value})}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sections / Classes</label>
              <input 
                type="text" 
                placeholder="e.g. IT-A, IT-B, IT-C"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                value={params.sections}
                onChange={e => setParams({...params, sections: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subjects, Faculty & Section Load</label>
            <textarea 
              placeholder="Provide subject, faculty name, and which sections they handle...&#10;e.g. Java - Dr. Miller (IT-A, IT-B)"
              className="w-full h-44 px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none font-medium leading-relaxed"
              value={params.subjectsAndFaculty}
              onChange={e => setParams({...params, subjectsAndFaculty: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Active Instructional Days</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-semibold appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1.25rem_center] bg-no-repeat"
                value={params.workingDays}
                onChange={e => setParams({...params, workingDays: e.target.value})}
              >
                <option>Monday - Friday</option>
                <option>Monday - Saturday</option>
                <option>Monday - Thursday</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Daily Period Count</label>
              <input 
                type="number" 
                min="1" max="10"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-semibold"
                value={params.periodsPerDay}
                onChange={e => setParams({...params, periodsPerDay: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-3xl font-black text-lg text-white shadow-xl transition-all transform active:scale-[0.98] ${
              loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resolving Timetable Constraints...
              </span>
            ) : 'Generate Conflict-Free Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimetableGenerator;
