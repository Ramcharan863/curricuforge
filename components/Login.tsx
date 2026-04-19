
import React, { useState } from 'react';
import { AppRole, UserInfo } from '../types';
import { ICONS } from '../constants';

interface Props {
  onLogin: (name: string, role: AppRole, college: string, department: string, roleSpecificData: Record<string, string>) => void;
}

const COLLEGES = [
  "Indian Institute of Technology (IIT) Bombay",
  "Indian Institute of Technology (IIT) Delhi",
  "Indian Institute of Science (IISc) Bangalore",
  "University of Delhi",
  "Anna University, Chennai",
  "Jawaharlal Nehru University (JNU)",
  "Stanford University",
  "Massachusetts Institute of Technology (MIT)",
  "University of Oxford",
  "National University of Singapore (NUS)",
  "Other / Private Institution"
];

const COLLEGE_TYPES = [
  "Engineering College",
  "Degree College (Arts/Science)",
  "Polytechnic Diploma",
  "Vocational Training Center",
  "Medical School",
  "Business School",
  "Law School",
  "Research Institute"
];

type LoginStep = 'identity' | 'role' | 'details';

const Login: React.FC<Props> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('identity');
  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  
  // Role specific form state
  const [roleData, setRoleData] = useState<Record<string, string>>({});

  const roles: { 
    id: AppRole; 
    title: string; 
    desc: string; 
    icon: any; 
    color: string; 
    deptLabel: string; 
    deptType: 'text' | 'select';
    deptOptions?: string[];
    fields: { label: string; key: string; type: 'text' | 'select'; options?: string[] }[] 
  }[] = [
    {
      id: 'Management',
      title: 'Institutional Management',
      desc: 'Govern frameworks, oversee compliance, and define organizational standards.',
      icon: ICONS.Institution,
      color: 'bg-slate-900',
      deptLabel: 'Type of College',
      deptType: 'select',
      deptOptions: COLLEGE_TYPES,
      fields: [
        { label: 'Designation', key: 'designation', type: 'select', options: ['Principal', 'Director', 'Dean', 'Registrar', 'Trustee'] },
        { label: 'Management ID', key: 'admin_id', type: 'text' }
      ]
    },
    {
      id: 'Department',
      title: 'Academic Department',
      desc: 'Review faculty submissions, validate Bloom\'s mapping, and maintain balance.',
      icon: ICONS.Update,
      color: 'bg-indigo-600',
      deptLabel: 'Official Department Name',
      deptType: 'text',
      fields: [
        { label: 'Head of Department Name', key: 'hod_name', type: 'text' },
        { label: 'Department Code', key: 'dept_code', type: 'text' }
      ]
    },
    {
      id: 'Faculty',
      title: 'Teaching Faculty',
      desc: 'Forge detailed curricula, lesson plans, and OBE-aligned assessments.',
      icon: ICONS.Curriculum,
      color: 'bg-blue-600',
      deptLabel: 'Assigned Academic Department',
      deptType: 'text',
      fields: [
        { label: 'Employee ID', key: 'emp_id', type: 'text' },
        { label: 'Qualification', key: 'qualification', type: 'text' },
        { label: 'Research Specialization', key: 'specialization', type: 'text' }
      ]
    },
    {
      id: 'Student',
      title: 'Student / Learner',
      desc: 'Access published learning resources, outcomes, and assessment guides.',
      icon: ICONS.Sparkles,
      color: 'bg-emerald-600',
      deptLabel: 'Enrolled Academic Department',
      deptType: 'text',
      fields: [
        { label: 'Register / Roll Number', key: 'roll_no', type: 'text' },
        { label: 'Current Academic Year', key: 'year', type: 'select', options: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'] },
        { label: 'Section / Batch', key: 'section', type: 'text' }
      ]
    }
  ];

  const handleNextStep = () => {
    if (step === 'identity') {
      if (!name.trim() || !collegeName) {
        alert('Please complete all identity information fields.');
        return;
      }
      setStep('role');
    } else if (step === 'role') {
      if (!selectedRole) {
        alert('Please select an access role.');
        return;
      }
      // Reset department when switching to Management to ensure they pick from dropdown
      if (selectedRole === 'Management' && !COLLEGE_TYPES.includes(department)) {
        setDepartment('');
      }
      setStep('details');
    }
  };

  const handleFinishLogin = () => {
    if (!selectedRole) return;
    if (!department.trim()) {
      alert('Please provide the department or college type.');
      return;
    }
    const currentRoleConfig = roles.find(r => r.id === selectedRole);
    const missing = currentRoleConfig?.fields.find(f => !roleData[f.key]?.trim());
    if (missing) {
      alert(`Please provide: ${missing.label}`);
      return;
    }
    onLogin(name, selectedRole, collegeName, department, roleData);
  };

  const currentRoleConfig = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600"></div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl w-full space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-slate-900 p-3 rounded-2xl shadow-xl">
              <ICONS.Sparkles className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">CurricuForge</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
            Step {step === 'identity' ? '1' : step === 'role' ? '2' : '3'}: {step === 'identity' ? 'Establish Identity' : step === 'role' ? 'Select Access Role' : 'Confirm Role Details'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-10 md:p-12 rounded-[3rem] border border-slate-200 shadow-2xl transition-all duration-500 overflow-hidden">
           
           {/* Step 1: Identity */}
           {step === 'identity' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Robert Forge"
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Affiliated Institution</label>
                    <div className="relative">
                        <select 
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                        >
                          <option value="" disabled>Select your Institution</option>
                          {COLLEGES.map((college, index) => (
                            <option key={index} value={college}>{college}</option>
                          ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleNextStep}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
                >
                  Confirm & Choose Role
                </button>
             </div>
           )}

           {/* Step 2: Role Selection */}
           {step === 'role' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`group relative p-6 rounded-[2rem] text-left transition-all duration-300 border-2 flex flex-col h-full ${
                          isSelected 
                            ? 'bg-white border-slate-900 shadow-2xl scale-[1.02]' 
                            : 'bg-slate-50 border-transparent hover:border-slate-200'
                        }`}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className={`${role.color} w-12 h-12 rounded-xl shadow-lg text-white flex items-center justify-center transition-transform group-hover:rotate-6`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {isSelected && <div className="h-4 w-4 rounded-full bg-slate-900 ring-4 ring-slate-100"></div>}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">{role.id}</h3>
                        <p className="text-slate-500 text-[10px] font-medium leading-relaxed flex-1">
                          {role.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setStep('identity')}
                    className="px-8 py-5 border border-slate-200 text-slate-500 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNextStep}
                    className="flex-1 py-5 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
                  >
                    Enter Role Profile
                  </button>
                </div>
             </div>
           )}

           {/* Step 3: Role Details */}
           {step === 'details' && currentRoleConfig && (
             <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center space-x-4 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <div className={`${currentRoleConfig.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {currentRoleConfig.icon({ className: 'w-6 h-6' })}
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Profile</p>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{currentRoleConfig.title}</h3>
                   </div>
                </div>

                <div className="space-y-6">
                   {/* Conditional Department/College Type Input */}
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{currentRoleConfig.deptLabel}</label>
                      {currentRoleConfig.deptType === 'select' ? (
                        <div className="relative">
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                          >
                            <option value="" disabled>Select {currentRoleConfig.deptLabel}</option>
                            {currentRoleConfig.deptOptions?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="e.g. Computer Science & Engineering"
                          className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                      )}
                   </div>

                   {currentRoleConfig.fields.map((field) => (
                     <div key={field.key} className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{field.label}</label>
                        {field.type === 'select' ? (
                          <div className="relative">
                            <select 
                              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                              value={roleData[field.key] || ''}
                              onChange={(e) => setRoleData({...roleData, [field.key]: e.target.value})}
                            >
                              <option value="" disabled>Choose {field.label}</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        ) : (
                          <input 
                            type="text" 
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                            value={roleData[field.key] || ''}
                            onChange={(e) => setRoleData({...roleData, [field.key]: e.target.value})}
                          />
                        )}
                     </div>
                   ))}
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={() => setStep('role')}
                    className="px-8 py-5 border border-slate-200 text-slate-500 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Change Role
                  </button>
                  <button 
                    onClick={handleFinishLogin}
                    className="flex-1 py-5 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
                  >
                    Initialize Neural Matrix
                  </button>
                </div>
             </div>
           )}
        </div>

        <div className="pt-8 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            CurricuForge Identity Protocol v1.5 • Step {step === 'identity' ? '1' : step === 'role' ? '2' : '3'} of 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
