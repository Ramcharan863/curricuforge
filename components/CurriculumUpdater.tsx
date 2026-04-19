
import React, { useState } from 'react';
import { updateCurriculum } from '../services/gemini';
import { GeneratedContent, AppRole } from '../types';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const CurriculumUpdater: React.FC<Props> = ({ role, collegeName, userName, department, onGenerated }) => {
  const [existing, setExisting] = useState('');
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existing.trim() || !request.trim()) return;
    
    setLoading(true);
    try {
      const content = await updateCurriculum({ 
        existingCurriculum: existing, 
        changeRequest: request, 
        role,
        collegeName,
        userName,
        department
      });
      onGenerated({
        type: 'update',
        title: `Revision Vector: ${request.substring(0, 20)}...`,
        content: content || 'Failed to update.'
      });
    } catch (error) {
      console.error(error);
      alert('Error updating curriculum.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-10">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Revision & Versioning Control</h3>
        <p className="text-slate-500 font-medium mb-10">Modify live structures while maintaining institutional continuity.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current State Protocol</label>
            <textarea 
              placeholder="Paste existing curriculum source code or text..."
              className="w-full h-48 px-6 py-5 bg-slate-900 text-white placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all resize-none font-mono text-xs leading-relaxed"
              value={existing}
              onChange={e => setExisting(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Transformation Request</label>
            <input 
              type="text"
              placeholder="e.g. Integrate ethical considerations into AI section."
              className="w-full px-6 py-4 bg-slate-900 text-white placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-semibold shadow-sm"
              value={request}
              onChange={e => setRequest(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-3xl font-black text-lg text-white shadow-xl transition-all transform active:scale-[0.98] ${
              loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {loading ? 'Recalibrating Domain...' : 'Update & Branch Version'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CurriculumUpdater;
