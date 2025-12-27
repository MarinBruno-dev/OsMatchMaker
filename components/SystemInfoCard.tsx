
import React from 'react';
import { SystemSpecs } from '../types';

interface Props {
  specs: SystemSpecs;
}

const InfoTile: React.FC<{ label: string; value: string; color: string; icon: React.ReactNode }> = ({ label, value, color, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white mb-6 shadow-lg shadow-current/10`}>
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
    <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
  </div>
);

const SystemInfoCard: React.FC<Props> = ({ specs }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Your Hardware Profile</h2>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
          Everything Looks Good!
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoTile 
          label="Current OS" 
          value={specs.os} 
          color="bg-indigo-500" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} 
        />
        <InfoTile 
          label="Power Level" 
          value={`${specs.cores} Units`} 
          color="bg-pink-500" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
        />
        <InfoTile 
          label="Memory Size" 
          value={specs.memory === 8 ? '8GB+' : `${specs.memory}GB`} 
          color="bg-amber-400" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>} 
        />
        <InfoTile 
          label="Form Factor" 
          value={specs.isLaptop ? 'Laptop' : 'Desktop'} 
          color="bg-cyan-400" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>} 
        />
      </div>

      {specs.isLaptop && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Battery Health</p>
              <h3 className="text-3xl font-black text-slate-900">{specs.batteryLevel ? Math.round(specs.batteryLevel * 100) : '--'}% Energy</h3>
            </div>
            <div className="flex-1 md:max-w-md">
              <div className="h-6 w-full bg-slate-50 rounded-full border border-slate-100 p-1 flex items-center">
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 to-indigo-500 rounded-full transition-all duration-1000 shadow-lg shadow-pink-500/20" 
                  style={{ width: `${(specs.batteryLevel || 0) * 100}%` }}
                />
              </div>
            </div>
            {specs.isCharging && (
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-500 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Sipping Juice
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.34V5.33c0-.73-.6-1.33-1.34-1.33z"/></svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemInfoCard;
