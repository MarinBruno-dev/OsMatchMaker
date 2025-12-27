
import React from 'react';
import { ComparisonResult, Recommendation } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  result: ComparisonResult;
}

const getOSIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('windows')) return '🪟';
  if (n.includes('mac') || n.includes('os x')) return '🍎';
  if (n.includes('ubuntu')) return '🟠';
  if (n.includes('zorin')) return '🌌';
  if (n.includes('arch')) return '🏔️';
  if (n.includes('mint')) return '🌿';
  if (n.includes('fedora')) return '🎩';
  if (n.includes('debian')) return '🍥';
  if (n.includes('manjaro')) return '🟢';
  if (n.includes('alpine')) return '🏔️';
  if (n.includes('nixos')) return '❄️';
  if (n.includes('linux')) return '🐧';
  return '💻';
};

const RecommendationCard: React.FC<{ rec: Recommendation }> = ({ rec }) => {
  return (
    <div className={`group flex flex-col h-full ${rec.isTopPick ? 'col-span-1 md:col-span-2 xl:col-span-3' : ''}`}>
      <div className={`flex-1 bg-white border-2 rounded-[3rem] transition-all duration-300 relative ${rec.isTopPick ? 'border-pink-200 shadow-2xl shadow-pink-500/5' : 'border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100'}`}>
        {rec.isTopPick && (
          <div className="absolute -top-4 left-10 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-black px-5 py-2 rounded-full shadow-lg shadow-pink-500/30 uppercase tracking-[0.2em] z-20">
            Perfect Match! ✨
          </div>
        )}

        <div className="p-10 flex flex-col h-full">
          <div className="flex flex-col md:flex-row gap-10 flex-1">
            <div className={`${rec.isTopPick ? 'md:w-3/5' : 'w-full'} space-y-8 flex flex-col`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="text-4xl w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                    {getOSIcon(rec.osName)}
                  </div>
                  <div>
                    <h3 className={`text-4xl font-black ${rec.isTopPick ? 'text-pink-600' : 'text-slate-900'}`}>{rec.osName}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Performance Grade: {rec.performanceScore > 80 ? 'Excellent' : 'Stable'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 rounded-[1.5rem] border border-slate-100 text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Soul Score</p>
                   <p className="text-3xl font-black text-slate-900">{rec.overallScore}</p>
                </div>
              </div>

              <p className="text-slate-500 text-lg leading-relaxed font-medium italic">
                "{rec.description}"
              </p>

              <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50">
                 <h4 className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                   Why you'll love it
                 </h4>
                 <p className="text-slate-600 font-medium leading-relaxed">
                   {rec.recommendationReason}
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Highlights</p>
                  {rec.pros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm font-bold text-slate-600">{pro}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Trade-offs</p>
                  {rec.cons.map((con, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" /></svg>
                      </div>
                      <span className="text-sm font-medium text-slate-500">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <a 
                  href={rec.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:-translate-y-1 active:scale-95 ${
                    rec.isTopPick 
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
                    : 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Get {rec.osName}
                </a>
              </div>
            </div>

            {rec.isTopPick && (
              <div className="md:w-2/5 flex flex-col justify-center gap-8 bg-slate-50/50 rounded-[2rem] p-10 border border-slate-100">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between font-black uppercase tracking-widest text-[10px] text-slate-400">
                      <span>Speed Factor</span>
                      <span className="text-indigo-600">{rec.performanceScore}%</span>
                    </div>
                    <div className="h-4 bg-white rounded-full p-1 border border-slate-100">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rec.performanceScore}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between font-black uppercase tracking-widest text-[10px] text-slate-400">
                      <span>Efficiency</span>
                      <span className="text-pink-500">{rec.batteryScore}%</span>
                    </div>
                    <div className="h-4 bg-white rounded-full p-1 border border-slate-100">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: `${rec.batteryScore}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                   <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 italic leading-relaxed">
                        "Your computer and {rec.osName} were made for each other!"
                      </p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendationView: React.FC<Props> = ({ result }) => {
  const chartData = result.recommendations.map(r => ({
    name: r.osName,
    performance: r.performanceScore,
    battery: r.batteryScore
  }));

  return (
    <div className="space-y-16 mt-16">
      <section className="bg-white rounded-[3.5rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Here's your perfect match!</h2>
          <p className="text-slate-500 text-xl font-medium leading-relaxed mb-8">
            {result.currentOsAnalysis}
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="px-6 py-3 bg-pink-50 text-pink-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-pink-100">
               Hardware Type: {result.hardwareSummary}
             </div>
             <div className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-100">
               Matching Logic: High Precision
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hidden lg:block">
           <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
             Performance Potential
           </h3>
           <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ border: 'none', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700 }}
                />
                <Bar dataKey="performance" radius={[8, 8, 8, 8]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#6366F1' : '#E2E8F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-pink-500"></div>
             Battery Happiness
           </h3>
           <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ border: 'none', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700 }}
                />
                <Bar dataKey="battery" radius={[8, 8, 8, 8]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#EC4899' : '#E2E8F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {result.recommendations.map((rec) => (
          <RecommendationCard key={rec.osName} rec={rec} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationView;
