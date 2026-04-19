
import React from 'react';
import { GeneratedContent } from '../types';
import { ICONS } from '../constants';

interface Props {
  history: GeneratedContent[];
}

const StudentAnnouncements: React.FC<Props> = ({ history }) => {
  const announcements = history.filter(h => 
    h.isPublished && h.type === 'announcement' && (h.role === 'Management' || h.role === 'Department')
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ICONS.Institution className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
             <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Institutional Stream</span>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none">Official Notices</h2>
          <p className="text-indigo-100 max-w-2xl text-lg font-medium leading-relaxed opacity-80">
            Authenticated broadcasts from Management and Department Heads. Stay informed about 
            policy changes, academic calendars, and campus directives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 text-center flex flex-col items-center">
            <ICONS.Update className="w-16 h-16 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">No active announcements detected in the neural buffer.</p>
          </div>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${ann.role === 'Management' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}>
                    <ICONS.Institution className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{ann.role} Broadcast</span>
                       <span className="text-slate-300">•</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(ann.timestamp).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">{ann.title}</h3>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase rounded-full tracking-widest">Official</span>
              </div>
              <div className="pl-20">
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{ann.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
