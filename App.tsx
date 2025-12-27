
import React, { useState, useEffect } from 'react';
import { SystemSpecs, ComparisonResult } from './types';
import { getOsRecommendations } from './services/geminiService';
import SystemInfoCard from './components/SystemInfoCard';
import RecommendationView from './components/RecommendationView';

const App: React.FC = () => {
  const [stage, setStage] = useState<'welcome' | 'questions' | 'loading' | 'results'>('welcome');
  const [loadingStep, setLoadingStep] = useState(0);
  const [userAge, setUserAge] = useState<number>(25);
  const [userExperience, setUserExperience] = useState<'beginner' | 'intermediate' | 'pro'>('beginner');
  const [specs, setSpecs] = useState<SystemSpecs | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Checking out your computer's personality...",
    "Looking at your battery life...",
    "Measuring how fast your brain is...",
    "Chatting with Gemini about your options...",
    "Almost there! Picking your best match..."
  ];

  useEffect(() => {
    let interval: any;
    if (stage === 'loading') {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const startAnalysis = async () => {
    setStage('loading');
    setError(null);

    try {
      const ua = navigator.userAgent;
      const platform = (navigator as any).userAgentData?.platform || navigator.platform;
      const cores = navigator.hardwareConcurrency || 2;
      let memory = (navigator as any).deviceMemory || 8; 
      const isLaptop = /Mobi|Android|iPhone|iPad|Macintosh/.test(ua) || (navigator as any).getBattery !== undefined;
      
      let batteryData = {};
      if ('getBattery' in navigator) {
        try {
          const battery: any = await (navigator as any).getBattery();
          batteryData = {
            batteryLevel: battery.level,
            isCharging: battery.charging
          };
        } catch (e) {
          console.warn("Battery status access denied.");
        }
      }

      const detectedSpecs: SystemSpecs = {
        os: getOSName(ua),
        platform,
        userAgent: ua,
        cores,
        memory,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        isLaptop,
        userAge,
        userExperience,
        ...batteryData
      };

      setSpecs(detectedSpecs);
      const aiResponse = await getOsRecommendations(detectedSpecs);
      setResult(aiResponse);
      setStage('results');
    } catch (err: any) {
      setError(err.message || "Oops! Something went wrong while checking your computer.");
      setStage('welcome');
    }
  };

  const getOSName = (ua: string) => {
    if (ua.indexOf("Win") !== -1) return "Windows";
    if (ua.indexOf("Mac") !== -1) return "macOS";
    if (ua.indexOf("Linux") !== -1) return "Linux";
    if (ua.indexOf("Android") !== -1) return "Android";
    if (ua.indexOf("like Mac") !== -1) return "iOS";
    return "Unknown OS";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      <header className="text-center mb-16">
        <div className="inline-block p-4 bg-white rounded-[2rem] shadow-xl shadow-pink-500/5 border border-pink-100 mb-6">
          <div className="bg-gradient-to-br from-pink-400 to-indigo-500 p-3 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 className="text-6xl font-black tracking-tight text-slate-900 mb-4">
          OS <span className="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">Matchmaker</span>
        </h1>
        <p className="text-slate-500 text-xl max-w-xl mx-auto font-medium">
          Let's find the perfect Operating System that fits your life and your computer! ✨
        </p>
      </header>

      <main>
        {stage === 'welcome' && (
          <div className="max-w-xl mx-auto">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-indigo-500/10 border border-slate-100 text-center">
              <div className="mb-8 text-slate-400">
                 <p className="text-sm font-bold uppercase tracking-widest mb-2">Ready to start?</p>
                 <p>We'll ask a few quick questions to personalize your results.</p>
              </div>
              <button
                onClick={() => setStage('questions')}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:to-indigo-700 text-white px-8 py-6 rounded-[1.5rem] font-black text-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
              >
                Let's Go!
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              {error && <p className="mt-4 text-red-500 text-sm font-bold">{error}</p>}
            </div>
          </div>
        )}

        {stage === 'questions' && (
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl shadow-indigo-500/10 border border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Getting to know you...</h2>
            
            <div className="space-y-12">
              {/* Age Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400">How young are you?</label>
                  <span className="text-3xl font-black text-indigo-600">{userAge}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={userAge} 
                  onChange={(e) => setUserAge(parseInt(e.target.value))}
                  className="w-full h-3 bg-indigo-50 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  <span>Fresh</span>
                  <span>Classic</span>
                </div>
              </div>

              {/* Experience Selector */}
              <div className="space-y-6">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 block mb-4">Technical Wizardry Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(['beginner', 'intermediate', 'pro'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setUserExperience(level)}
                      className={`p-6 rounded-[1.5rem] border-2 transition-all text-center flex flex-col items-center gap-2 ${
                        userExperience === level 
                        ? 'border-pink-500 bg-pink-50 text-pink-600' 
                        : 'border-slate-100 hover:border-indigo-200 text-slate-500'
                      }`}
                    >
                      <span className="text-xl">
                        {level === 'beginner' ? '🌱' : level === 'intermediate' ? '🛠️' : '🧙‍♂️'}
                      </span>
                      <span className="font-black uppercase text-xs tracking-widest">{level}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startAnalysis}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 rounded-[1.5rem] font-black text-xl transition-all active:scale-95 shadow-xl"
              >
                Analyze My Machine 🚀
              </button>
            </div>
          </div>
        )}

        {stage === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 mb-8 overflow-hidden">
               <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">{steps[loadingStep]}</h2>
            <p className="text-slate-400 font-medium">Getting everything ready for you...</p>
          </div>
        )}

        {stage === 'results' && specs && result && (
          <>
            <div className="mb-12">
              <SystemInfoCard specs={specs} />
            </div>
            <RecommendationView result={result} />
            <div className="mt-12 text-center">
              <button 
                onClick={() => setStage('welcome')}
                className="text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline"
              >
                ← Start Over
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="mt-32 text-center text-slate-400 font-medium">
        <p>Made with 💖 and AI intelligence.</p>
        <p className="text-xs mt-2 uppercase tracking-[0.2em] font-bold">Privacy First • Secure • Fun</p>
      </footer>
    </div>
  );
};

export default App;
