
import React from 'react';
import { AppRole } from '../types';
import { ICONS } from '../constants';

interface Props {
  role: AppRole;
  collegeName: string;
  userName: string;
  department: string;
}

const DepartmentDetails: React.FC<Props> = ({ role, collegeName, userName }) => {
  // Mock data for the institutional directory
  const departments = [
    { name: 'Computer Science & Engineering', hod: 'Dr. Alan Turing', faculty: 24, students: 480, status: 'Active' },
    { name: 'Mechanical Engineering', hod: 'Prof. James Watt', faculty: 18, students: 360, status: 'Active' },
    { name: 'Electrical & Electronics', hod: 'Dr. Nikola Tesla', faculty: 20, students: 400, status: 'Active' },
    { name: 'Physics & Applied Sciences', hod: 'Dr. Marie Curie', faculty: 12, students: 240, status: 'Audit Pending' },
    { name: 'Business Administration', hod: 'Prof. Peter Drucker', faculty: 15, students: 300, status: 'Active' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <ICONS.Lesson className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Department Directory</h3>
            <p className="text-slate-500 font-medium tracking-tight">Institutional oversight of all academic units at <span className="text-indigo-600 font-bold">{collegeName}</span>.</p>
          </div>
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-[2rem]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Head of Department</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Faculty</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Students</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {departments.map((dept, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{dept.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">Verified Unit</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{dept.hod}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-400 text-center">{dept.faculty}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-400 text-center">{dept.students}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${dept.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Faculty Load</p>
          <p className="text-4xl font-black text-slate-900">8900 <span className="text-sm text-slate-300">HRS</span></p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Campus Population</p>
          <p className="text-4xl font-black text-slate-900">1780 <span className="text-sm text-slate-300">STD</span></p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Compliance Rate</p>
          <p className="text-4xl font-black text-indigo-600">98.2%</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
