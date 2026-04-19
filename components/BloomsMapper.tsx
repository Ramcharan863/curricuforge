
import React, { useState } from 'react';
import { mapBlooms } from '../services/gemini';
import { GeneratedContent, AppRole } from '../types';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  // Updated onGenerated to match App.tsx addHistory signature (omitting department)
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const BloomsMapper: React.FC<Props> = ({ role, collegeName, userName, department, onGenerated }) => {
  const [outcomes, setOutcomes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcomes.trim()) return;
    
    setLoading(true);
    try {
      // Pass collegeName, userName, and department to mapBlooms service
      const content = await mapBlooms({ outcomes, role, collegeName, userName, department });
      onGenerated({
        type: 'blooms',
        title: `Bloom's Cognitive Alignment`,
        content: content || 'Failed to map outcomes.'
      });
    } catch (error) {
      console.error(error);
      alert('Error mapping outcomes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-10">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Cognitive Domain Mapper</h3>
        <p className="text-slate-500 font-medium mb-10">Align learning outcomes with the established levels of Bloom's Taxonomy.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Learning Outcome Stream</label>
            <textarea 
              placeholder="Paste COs for cognitive validation..."
              className="w-full h-48 px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all resize-none font-medium leading-relaxed"
              value={outcomes}
              onChange={e => setOutcomes(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-3xl font-black text-lg text-white shadow-xl transition-all transform active:scale-[0.98] ${
              loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Calibrating Taxonomy...' : 'Execute Cognitive Mapping'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BloomsMapper;
