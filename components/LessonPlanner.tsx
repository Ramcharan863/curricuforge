
import React, { useState } from 'react';
import { generateLessonPlan } from '../services/gemini';
import { GeneratedContent, AppRole } from '../types';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const LessonPlanner: React.FC<Props> = ({ role, collegeName, userName, department, onGenerated }) => {
  const [syllabus, setSyllabus] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabus.trim()) return;
    
    setLoading(true);
    try {
      const content = await generateLessonPlan({ syllabus, prerequisites, role, collegeName, userName, department });
      onGenerated({
        type: 'lesson-plan',
        title: `Lesson Plan Synthesis`,
        content: content || 'Failed to generate plan.'
      });
    } catch (error) {
      console.error(error);
      alert('Error generating lesson plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-10">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Chronological Planning</h3>
        <p className="text-slate-500 font-medium mb-10">Deconstruct structural syllabi into weekly pedagogical units for <span className="text-slate-900">{collegeName}</span>.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Necessary Prerequisites</label>
            <input 
              type="text"
              placeholder="e.g. Basic Calculus, Linear Algebra, Introduction to Algorithms"
              className="w-full px-6 py-4 bg-slate-900 text-white placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-semibold"
              value={prerequisites}
              onChange={e => setPrerequisites(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Syllabus Input Vector</label>
            <textarea 
              placeholder="Paste week-by-week topics here for pedagogical processing..."
              className="w-full h-48 px-6 py-5 bg-slate-900 text-white placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
              value={syllabus}
              onChange={e => setSyllabus(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-3xl font-black text-lg text-white shadow-xl transition-all transform active:scale-[0.98] ${
              loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading ? 'Synthesizing Instructional Steps...' : 'Generate Faculty-Ready Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LessonPlanner;
