
import React from 'react';
import { ComparisonResult, Recommendation, Review } from '../types';
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

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'reddit': return '🤖';
      case 'social media': return '📱';
      case 'official site': return '🌐';
      case 'tech forum': return '⚙️';
      default: return '💬';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'reddit': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'social media': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'official site': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'tech forum': return 'bg-slate-50 text-slate-600 border-slate-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex items-center gap-3 mb-4">
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSourceColor(review.source)} flex items-center gap-2`}>
          <span>{getSourceIcon(review.source)}</span>
          {review.source}
        </div>
      </div>
      <p className="text-slate-600 text-sm italic leading-relaxed">
        "{review.content}"
      </p>
      {review.rating && (
        <div className="mt-4 flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < review.rating! ? 'text-amber-400' : 'text-slate-200'}>★</span>
          ))}
        </div>
      )}
    </div>
  );
};

const RecommendationCard: React.FC<{ rec: Recommendation }> = ({ rec }) => {
  return (
    <div className={`group flex flex-col h-full ${rec.isTopPick ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
      <div className={`flex-1 bg-white border-2 rounded-[3rem] transition-all duration-300 relative ${rec.isTopPick ? 'border-emerald-200 shadow-2xl shadow-emerald-500/5' : 'border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-100'}`}>
        {rec.isTopPick && (
          <div className="absolute -top-4 left-10 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-xs font-black px-5 py-2 rounded-full shadow-lg shadow-emerald-500/30 uppercase tracking-[0.2em] z-20">
            Perfect Match! ✨
          </div>
        )}

        <div className="p-8 md:p-12 flex flex-col h-full">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 flex-1">
            <div className={`${rec.isTopPick ? 'md:w-3/5 lg:w-2/3' : 'w-full'} space-y-10 flex flex-col`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full">
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="text-4xl w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:rotate-6 transition-transform shrink-0">
                    {getOSIcon(rec.osName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-2xl md:text-4xl font-black leading-tight ${rec.isTopPick ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {rec.osName}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">
                        Grade: {rec.performanceScore > 80 ? 'Excellent' : 'Stable'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Videogame-Style Soul Score Box */}
                <div className="flex flex-col items-center bg-black p-4 rounded-lg border-4 border-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] shrink-0 min-w-[140px] self-end sm:self-auto">
                   <p className="pixel-font text-[8px] text-emerald-400 uppercase tracking-widest mb-3 animate-pulse">Soul Score</p>
                   <p className="pixel-font text-3xl text-white drop-shadow-[2px_2px_0px_#10b981]">{rec.overallScore}</p>
                   <div className="w-full h-1 bg-slate-800 mt-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-emerald-500" style={{ width: `${rec.overallScore}%` }}></div>
                   </div>
                </div>
              </div>

              <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium italic">
                "{rec.description}"
              </p>

              <div className="p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50">
                 <h4 className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                   Why you'll love it
                 </h4>
                 <p className="text-slate-600 font-medium leading-relaxed md:text-lg">
                   {rec.recommendationReason}
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Highlights</p>
                  {rec.pros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm md:text-base font-bold text-slate-600">{pro}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Trade-offs</p>
                  {rec.cons.map((con, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18 12H6" /></svg>
                      </div>
                      <span className="text-sm md:text-base font-medium text-slate-500">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                  Community Vibes
                </h4>
                <div className={`grid grid-cols-1 ${rec.isTopPick ? 'md:grid-cols-3' : 'md:grid-cols-1 lg:grid-cols-3'} gap-4`}>
                  {rec.reviews.map((review, i) => (
                    <ReviewItem key={i} review={review} />
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <a 
                  href={rec.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 px-8 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] transition-all hover:-translate-y-1 active:scale-95 ${
                    rec.isTopPick 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Get {rec.osName}
                </a>
              </div>
            </div>

            {rec.isTopPick && (
              <div className="md:w-2/5 lg:w-1/3 flex flex-col justify-center gap-10 bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100 h-fit sticky top-12 self-start">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between font-black uppercase tracking-widest text-[10px] text-slate-400">
                      <span>Performance Index</span>
                      <span className="text-emerald-600">{rec.performanceScore}%</span>
                    </div>
                    <div className="h-5 bg-white rounded-full p-1.5 border border-slate-100 shadow-inner">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${rec.performanceScore}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between font-black uppercase tracking-widest text-[10px] text-slate-400">
                      <span>Compatibility Score</span>
                      <span className="text-emerald-500">{rec.overallScore}%</span>
                    </div>
                    <div className="h-5 bg-white rounded-full p-1.5 border border-slate-100 shadow-inner">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${rec.overallScore}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="text-center pt-4">
                   <div className="inline-block p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                      <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
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
    fit: r.overallScore
  }));

  return (
    <div className="space-y-16 mt-16">
      <section className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">Here's your perfect match!</h2>
          <p className="text-slate-500 text-lg md:text-2xl font-medium leading-relaxed mb-10">
            {result.currentOsAnalysis}
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100">
               Hardware Type: {result.hardwareSummary}
             </div>
             <div className="px-8 py-4 bg-teal-50 text-teal-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-teal-100">
               Matching Logic: Performance Focused
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none hidden lg:block text-emerald-500">
           <svg className="w-[400px] h-[400px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-12 flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
             Performance Potential Analysis
           </h3>
           <div className="h-[350px] md:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#94A3B8' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 800, padding: '16px' }}
                />
                <Bar dataKey="performance" radius={[12, 12, 12, 12]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#E2E8F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Grid of OS recommendations - Optimized to 2 columns for alternative options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {result.recommendations.map((rec) => (
          <RecommendationCard key={rec.osName} rec={rec} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationView;
