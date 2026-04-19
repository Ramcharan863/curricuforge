
import React, { useState } from 'react';
import { generateCurriculum } from '../services/gemini';
import { CurriculumParams, GeneratedContent, AppRole } from '../types';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const CurriculumGenerator: React.FC<Props> = ({ role, collegeName, userName, department, onGenerated }) => {
  const [params, setParams] = useState<Omit<CurriculumParams, 'role' | 'collegeName' | 'userName'>>({
    subject: '',
    level: 'Undergraduate',
    department: '',
    duration: '15 Weeks',
    difficulty: 'Intermediate',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.subject || !params.department) return;
    
    setLoading(true);
    try {
      const content = await generateCurriculum({ ...params, role, collegeName, userName });
      onGenerated({
        type: 'curriculum',
        title: `${params.subject} Curriculum`,
        content: content || 'Failed to generate curriculum.'
      });
    } catch (error: any) {
      console.error(error);
      const isQuota = error.message?.includes('RESOURCE_EXHAUSTED') || error.status === 429;
      alert(isQuota 
        ? "The AI Forge is currently at maximum capacity (Quota Exceeded). Please wait a few minutes and try again." 
        : "Neural link interrupted. Please check your connectivity or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden relative">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="p-10 relative z-10">
        <div className="flex items-center space-x-4 mb-10">
           <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4" /></svg>
           </div>
           <div>
             <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Core Design Module</h3>
             <p className="text-slate-500 font-medium">Construct OBE-compliant academic paths as <span className="text-blue-600 font-bold">{role}</span>.</p>
           </div>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Subject Nomenclature</label>
            <input 
              type="text" 
              placeholder="e.g. Quantum Computing for Engineers"
              className="w-full px-6 py-5 bg-slate-900 text-white placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold shadow-sm"
              value={params.subject}
              onChange={e => setParams({...params, subject: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Responsible Department</label>
            <input 
              type="text" 
              placeholder="e.g. Physics & Applied Sciences"
              className="w-full px-6 py-5 bg-slate-900 text-white placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold shadow-sm"
              value={params.department}
              onChange={e => setParams({...params, department: e.target.value})}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Stratum</label>
            <div className="relative">
              <select 
                className="w-full px-6 py-5 bg-slate-900 text-white rounded-2xl border border-slate-800 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none cursor-pointer shadow-sm"
                value={params.level}
                onChange={e => setParams({...params, level: e.target.value})}
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD / Doctorate">PhD / Doctorate</option>
                <option value="Professional Diploma">Professional Diploma</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Curricular Duration</label>
            <div className="relative">
              <select 
                className="w-full px-6 py-5 bg-slate-900 text-white rounded-2xl border border-slate-800 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none cursor-pointer shadow-sm"
                value={params.duration}
                onChange={e => setParams({...params, duration: e.target.value})}
              >
                <option value="8 Weeks">8 Weeks</option>
                <option value="12 Weeks">12 Weeks</option>
                <option value="15 Weeks">15 Weeks</option>
                <option value="1 Semester">1 Semester</option>
                <option value="Full Year">Full Year</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Intensity Level</label>
            <div className="relative">
              <select 
                className="w-full px-6 py-5 bg-slate-900 text-white rounded-2xl border border-slate-800 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none cursor-pointer shadow-sm"
                value={params.difficulty}
                onChange={e => setParams({...params, difficulty: e.target.value})}
              >
                <option value="Introductory">Introductory</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Mastery">Mastery</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-8">
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-6 rounded-3xl font-black text-xl text-white shadow-xl transition-all transform active:scale-[0.98] ${
                loading ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Forging Academic Standards...
                </span>
              ) : `Execute Curriculum Synthesis`}
            </button>
          </div>
        </form>
      </div>
      
      <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">CurricuForge Protocol v1.5 • Advanced Logic Core</p>
      </div>
    </div>
  );
};

export default CurriculumGenerator;
