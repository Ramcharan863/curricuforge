
import React, { useState } from 'react';
import { generateAssignment } from '../services/gemini';
import { GeneratedContent, AppRole } from '../types';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const AssignmentGenerator: React.FC<Props> = ({ role, collegeName, userName, department, onGenerated }) => {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('3 Hours');
  const [targetSection, setTargetSection] = useState('CSE-1A');
  const [loading, setLoading] = useState(false);

  const durationMap: Record<string, number> = {
    '1 Hour': 3600000,
    '2 Hours': 7200000,
    '3 Hours': 10800000,
    '24 Hours': 86400000,
    '7 Days': 604800000
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    
    setLoading(true);
    try {
      const content = await generateAssignment({ 
        subject, 
        durationHours: duration, 
        role, 
        collegeName, 
        userName, 
        department,
        targetSection
      });
      
      onGenerated({
        type: 'assignment',
        title: `Assignment: ${subject} (${targetSection})`,
        content: content || 'Failed to generate assignment.',
        targetSection: targetSection,
        durationMillis: durationMap[duration] || 10800000
      });
    } catch (error) {
      console.error(error);
      alert('Error generating assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-10">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Assignment Builder</h3>
        <p className="text-slate-500 font-medium mb-10">Forge comprehensive assignments for <span className="text-slate-900">{collegeName}</span>.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
              <input 
                type="text" 
                placeholder="e.g. Statistical Inference"
                className="w-full px-6 py-4 bg-slate-900 text-white placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold shadow-sm"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Section</label>
              <div className="relative">
                <select 
                  className="w-full px-6 py-4 bg-slate-900 text-white rounded-2xl border border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold appearance-none cursor-pointer shadow-sm"
                  value={targetSection}
                  onChange={e => setTargetSection(e.target.value)}
                >
                  <option value="CSE-1A">CSE-1A</option>
                  <option value="CSE-1B">CSE-1B</option>
                  <option value="CSE-2A">CSE-2A</option>
                  <option value="IT-A">IT-A</option>
                  <option value="ECE-B">ECE-B</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Submission Limit</label>
              <div className="relative">
                <select 
                  className="w-full px-6 py-4 bg-slate-900 text-white rounded-2xl border border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold appearance-none cursor-pointer shadow-sm"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                >
                  <option value="1 Hour">1 Hour</option>
                  <option value="2 Hours">2 Hours</option>
                  <option value="3 Hours">3 Hours</option>
                  <option value="24 Hours">24 Hours</option>
                  <option value="7 Days">7 Days</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-3xl font-black text-lg text-white shadow-xl transition-all transform active:scale-[0.98] ${
              loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Synthesizing Assignment...' : 'Generate & Release Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentGenerator;
