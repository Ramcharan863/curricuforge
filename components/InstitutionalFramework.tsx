
import React, { useState } from 'react';
import { generateInstitutionalFramework } from '../services/gemini';
import { GeneratedContent, AppRole, InstitutionalParams } from '../types';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  // Updated onGenerated to match App.tsx addHistory signature (omitting department)
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const InstitutionalFramework: React.FC<Props> = ({ role, collegeName, userName, department, onGenerated }) => {
  // Correctly type and omit collegeName/role/userName from state
  const [params, setParams] = useState<Omit<InstitutionalParams, 'role' | 'collegeName' | 'userName'>>({
    institutionType: 'Engineering College',
    department: '',
    subject: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.department || !params.subject) return;
    
    setLoading(true);
    try {
      // Pass collegeName and userName to service
      const content = await generateInstitutionalFramework({ ...params, role, collegeName, userName });
      onGenerated({
        type: 'institutional',
        title: `Org-Framework: ${params.subject}`,
        content: content || 'Failed to generate framework.'
      });
    } catch (error) {
      console.error(error);
      alert('Error generating institutional framework.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-10">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Governance Framework Architect</h3>
        <p className="text-slate-500 font-medium mb-10">Establish standardized structural protocols across institutional units.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Institutional Entity Type</label>
            <select 
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none transition-all font-semibold appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1.25rem_center] bg-no-repeat shadow-sm"
              value={params.institutionType}
              onChange={e => setParams({...params, institutionType: e.target.value})}
            >
              <option>Engineering College</option>
              <option>Degree College (Arts/Science)</option>
              <option>Polytechnic Diploma</option>
              <option>Vocational Training Center</option>
              <option>Medical School</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
            <input 
              type="text" 
              placeholder="e.g. Mechanical Engineering"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none transition-all font-semibold"
              value={params.department}
              onChange={e => setParams({...params, department: e.target.value})}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
            <input 
              type="text" 
              placeholder="e.g. Thermodynamics"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-slate-500/10 focus:border-slate-500 outline-none transition-all font-semibold"
              value={params.subject}
              onChange={e => setParams({...params, subject: e.target.value})}
              required
            />
          </div>

          <div className="md:col-span-2 mt-6">
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-3xl font-black text-lg text-white shadow-xl transition-all transform active:scale-[0.98] ${
                loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {loading ? 'Executing Standardized Synthesis...' : 'Generate Institutional Framework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstitutionalFramework;
