
import React, { useState } from 'react';
import { generateCollegeAIResponse } from '../services/gemini';
import { AppRole, GeneratedContent } from '../types';
import { ICONS } from '../constants';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
  roleSpecificData: Record<string, string>;
  onGenerated: (item: Omit<GeneratedContent, 'id' | 'timestamp' | 'role' | 'collegeName' | 'userName' | 'approvalStatus' | 'department'>) => void;
}

const CollegeAI: React.FC<Props> = ({ role, collegeName, userName, roleSpecificData, onGenerated }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const context = `Institutional Type: ${roleSpecificData?.institutionType || 'University'}, Current Management Strategy: Quality focused, OBE compliant.`;
      const response = await generateCollegeAIResponse({ query, context, role, collegeName, userName, department: 'Institutional Management', roleSpecificData });
      
      onGenerated({
        type: 'college-ai',
        title: `Strategic Insights: ${query.substring(0, 30)}...`,
        content: response || 'Strategic analysis failed to initialize.'
      });
    } catch (error) {
      console.error(error);
      alert('Neural link for Strategic AI interrupted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden relative min-h-[500px] flex flex-col">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ICONS.Sparkles className="w-80 h-80 text-blue-600" />
      </div>

      <div className="p-12 relative z-10 flex-1">
        <div className="flex items-center space-x-5 mb-12">
          <div className="h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-amber-400 shadow-2xl shadow-slate-900/20">
            <ICONS.Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Institutional Oracle</h3>
            <p className="text-slate-500 font-medium tracking-tight mt-1">Strategic AI-driven oversight and college management advisor.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Strategic Inquiry</label>
                <textarea 
                  placeholder="Ask about resource allocation, enrollment growth, faculty performance benchmarks, or curriculum standardization across units..."
                  className="w-full h-64 px-8 py-6 bg-slate-900 rounded-[2.5rem] border border-slate-800 focus:ring-8 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all font-bold text-white placeholder:text-slate-500 shadow-2xl resize-none leading-relaxed"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-6 rounded-[2rem] font-black text-xl text-white shadow-2xl transition-all transform active:scale-[0.98] ${
                  loading ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Synthesizing Strategic Intelligence...
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-3">
                    <span>Analyze Institutional Growth</span>
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" /></svg>
                  </span>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem]">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Suggested Analyses</h4>
              <div className="space-y-4">
                {[
                  "Optimize faculty student ratio for CSE",
                  "Identify high-performing departments",
                  "OBE compliance audit for 2024 Cycle",
                  "Strategic resource allocation for new Lab"
                ].map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setQuery(s)}
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-left text-xs font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">Governance Note</p>
              <p className="text-sm font-medium leading-relaxed opacity-80 italic">
                Strategic advice is generated using real-time institutional metrics and global education trends. Management authorization is required for implementation.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-12 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center shrink-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Strategic AI Core v2.1 • Management Authorized</p>
        <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center">
          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
          Oracle Active
        </span>
      </div>
    </div>
  );
};

export default CollegeAI;
