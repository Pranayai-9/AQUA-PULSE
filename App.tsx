import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, 
  Droplet, 
  Map as MapIcon, 
  Wrench, 
  Settings, 
  Bell, 
  Music, 
  AlertTriangle, 
  Search,
  Zap,
  Leaf,
  AlertCircle
} from 'lucide-react';
import WaterPulse from './components/WaterPulse';
import UsageChart from './components/UsageChart';
import WaterGridMap from './components/WaterGridMap';
import ARRepairMode from './components/ARRepairMode';
import { AppView, WaterEvent, DailyStats } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    used: 42.5,
    goal: 80,
    projectedBill: 55.20,
    averageBill: 45.00
  });
  
  const [events, setEvents] = useState<WaterEvent[]>([
    { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 15), appliance: 'Master Shower', volume: 14.2, icon: 'shower' },
    { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 45), appliance: 'Guest Toilet', volume: 1.6, icon: 'toilet' },
    { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 120), appliance: 'Dishwasher', volume: 4.5, icon: 'dishwasher' },
  ]);

  const [activeFlow, setActiveFlow] = useState<{appliance: string, rate: number} | null>(null);
  
  // Ghost Hunter State: Tracks silent leaks (duration in seconds, wasted in gallons)
  const [ghostLeak, setGhostLeak] = useState<{wasted: number, duration: number} | null>(null);
  
  // Settings State
  const [leakSensitivity, setLeakSensitivity] = useState<number>(75);
  
  const [notification, setNotification] = useState<string | null>(null);

  // --- Simulation Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Normal Flow Logic
      if (!activeFlow && Math.random() > 0.85) {
        const appliances = [
          { name: 'Kitchen Sink', rate: 1.5 },
          { name: 'Garden Hose', rate: 5.0 },
          { name: 'Toilet Flush', rate: 2.0 },
          { name: 'Shower', rate: 2.5 }
        ];
        const randomApp = appliances[Math.floor(Math.random() * appliances.length)];
        setActiveFlow({ appliance: randomApp.name, rate: randomApp.rate });
        
        // If it's a shower, show "Shower DJ" notification
        if (randomApp.name === 'Shower') {
           setNotification("🚿 Shower started! Playing 'Eco-Jams' playlist on Hue speakers.");
           setTimeout(() => setNotification(null), 5000);
        }

      } else if (activeFlow) {
        // Increment usage
        const usageIncrement = activeFlow.rate / 60; // per second (approx)
        setDailyStats(prev => ({ ...prev, used: prev.used + usageIncrement }));
        
        // Random chance to stop
        if (Math.random() > 0.8) {
           // Log event
           const newEvent: WaterEvent = {
             id: Date.now().toString(),
             timestamp: new Date(),
             appliance: activeFlow.appliance,
             volume: Math.floor(Math.random() * 5) + 1,
             icon: 'tap'
           };
           setEvents(prev => [newEvent, ...prev]);
           setActiveFlow(null);
        }
      }

      // 2. Ghost Hunter (Leak) Logic
      if (!ghostLeak) {
         // Probability influenced by sensitivity.
         // Sensitivity 0  => High Threshold (e.g., 0.995) => Low chance
         // Sensitivity 100 => Low Threshold (e.g., 0.90)  => High chance
         const threshold = 0.995 - ((leakSensitivity / 100) * 0.09);
         
         if (Math.random() > threshold) {
            setGhostLeak({ wasted: 0.05, duration: 0 });
         }
      } else {
         // Increment leak stats
         setGhostLeak(prev => prev ? ({
            wasted: prev.wasted + 0.002, // Slow drip (approx 0.12 GPM)
            duration: prev.duration + 1
         }) : null);

         // Randomly resolve/stop the leak (simulate user fixing it or false positive clearing)
         if (Math.random() > 0.90) {
            setGhostLeak(null);
         }
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [activeFlow, ghostLeak, leakSensitivity]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const renderDashboard = () => (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Good Morning, Alex</h1>
          <p className="text-slate-400 text-sm">Tuesday, Oct 24 • <span className="text-emerald-400">System Secure</span></p>
        </div>
        <div className="bg-slate-800 p-2 rounded-full relative">
          <Bell size={20} className="text-slate-300" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></div>
        </div>
      </div>

      {/* Main Visual */}
      <WaterPulse percentage={(dailyStats.used / dailyStats.goal) * 100} isFlowing={!!activeFlow} />

      {/* Live Status Card */}
      {activeFlow ? (
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-cyan-500 animate-pulse">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-cyan-500/20 rounded-full text-cyan-400">
               <Zap size={20} />
             </div>
             <div>
               <h3 className="text-white font-bold">Active Flow Detected</h3>
               <p className="text-cyan-200 text-sm">{activeFlow.appliance} • {activeFlow.rate} GPM</p>
             </div>
             <div className="ml-auto">
               <span className="inline-block px-2 py-1 bg-cyan-500 text-white text-xs font-bold rounded uppercase tracking-wider">Live</span>
             </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-500/50 opacity-80">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
               <Leaf size={20} />
             </div>
             <div>
               <h3 className="text-white font-bold">All Quiet</h3>
               <p className="text-emerald-200 text-sm">No leaks detected. Saving water.</p>
             </div>
          </div>
        </div>
      )}

      {/* Ghost Hunter / Leak Alert */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`glass-panel p-4 rounded-xl transition-all duration-500 ${ghostLeak ? 'border-l-4 border-amber-500 bg-amber-500/10' : ''}`}>
           <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm font-semibold uppercase">
              <Search size={14} /> Ghost Hunter
           </div>
           
           {ghostLeak ? (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex items-center gap-2 text-amber-500 mb-1">
                 <AlertTriangle size={18} className="animate-pulse" />
                 <p className="font-bold text-lg leading-none">Leak Suspected</p>
               </div>
               <p className="text-[10px] text-amber-200/60 mb-3 leading-tight">Continuous low-freq vibration detected.</p>
               
               <div className="space-y-2">
                 <div className="bg-slate-800/60 p-2 rounded flex justify-between items-center">
                   <span className="text-[10px] text-slate-400">Duration</span>
                   <span className="text-white font-mono text-xs font-bold">{formatDuration(ghostLeak.duration)}</span>
                 </div>
                 <div className="bg-slate-800/60 p-2 rounded flex justify-between items-center">
                   <span className="text-[10px] text-slate-400">Est. Loss</span>
                   <span className="text-amber-400 font-mono text-xs font-bold">{ghostLeak.wasted.toFixed(3)}g</span>
                 </div>
               </div>
             </div>
           ) : (
             <>
                <p className="text-emerald-400 font-bold text-lg">Scanning...</p>
                <p className="text-xs text-slate-500 mt-1">Micro-vibrations nominal</p>
             </>
           )}
        </div>
        <div className="glass-panel p-4 rounded-xl">
           <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm font-semibold uppercase">
              <Music size={14} /> Shower DJ
           </div>
           <p className="text-white font-bold text-lg">Ready</p>
           <p className="text-xs text-slate-500 mt-1">Paired with Sonos Bathroom</p>
        </div>
      </div>

      {/* Usage Feed */}
      <div className="bg-slate-800/50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">The Water Feed</h2>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Today</span>
        </div>
        <div className="relative border-l border-slate-700 ml-3 space-y-6">
          {events.map((event, idx) => (
            <div key={event.id} className="relative pl-6">
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-900 ${idx === 0 ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">{event.appliance}</p>
                  <p className="text-slate-400 text-xs">
                    {event.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-cyan-400">{event.volume}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Weekly Consumption</h2>
        <UsageChart />
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-amber-500 shrink-0" size={18} />
          <p className="text-xs text-amber-200">
            <strong>Predictive Insight:</strong> Based on current usage, your bill will be approx ${dailyStats.projectedBill.toFixed(2)}. That's $10 higher than average.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-[slideDown_0.5s_ease-out]">
          <div className="glass-panel bg-slate-800/90 border-cyan-500/50 p-4 rounded-lg shadow-2xl flex items-center gap-3">
            <div className="bg-cyan-500 rounded-full p-1"><Music size={16} className="text-white"/></div>
            <p className="text-sm font-medium">{notification}</p>
          </div>
        </div>
      )}

      {/* AR View Modal */}
      {view === AppView.AR_REPAIR && <ARRepairMode onClose={() => setView(AppView.DASHBOARD)} />}

      <main className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-slate-900">
        <div className="h-full overflow-y-auto p-5 scrollbar-hide">
          
          {view === AppView.DASHBOARD && renderDashboard()}

          {view === AppView.GRID && (
             <div className="pb-20 pt-4">
                <h2 className="text-2xl font-bold mb-2">The Water Grid</h2>
                <p className="text-slate-400 text-sm mb-6">Real-time pressure monitoring of 50 homes in your zip code.</p>
                <WaterGridMap />
                <div className="mt-6 glass-panel p-4 rounded-xl">
                   <h3 className="font-bold text-emerald-400 mb-2">Neighborhood Watch</h3>
                   <p className="text-sm text-slate-300">You used <span className="text-white font-bold">20% less</span> water than the average 3-bedroom home in your area this week. You're in the top 10%!</p>
                </div>
             </div>
          )}
          
          {view === AppView.COMMUNITY && (
            <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500">
               <Wrench className="mb-4 opacity-20" size={48} />
               <p>Feature coming in v2.0</p>
               <button onClick={() => setView(AppView.DASHBOARD)} className="mt-4 text-cyan-400">Go Back</button>
            </div>
          )}

          {view === AppView.SETTINGS && (
            <div className="pb-20 pt-4 px-2">
                <h2 className="text-2xl font-bold mb-6 text-white">System Configuration</h2>
                
                {/* Sensitivity Card */}
                <div className="glass-panel p-5 rounded-xl mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                            <Search size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Ghost Hunter Sensitivity</h3>
                            <p className="text-xs text-slate-400">Adjust AI trigger threshold</p>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-slate-300 mb-2">
                            <span>Conservative</span>
                            <span className="text-cyan-400 font-bold">{leakSensitivity}%</span>
                            <span>Aggressive</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={leakSensitivity} 
                            onChange={(e) => setLeakSensitivity(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    <div className="bg-slate-800/50 p-3 rounded text-xs text-slate-400 leading-relaxed">
                        <AlertCircle size={14} className="inline mr-1 mb-0.5" />
                        Higher sensitivity increases protection but may result in more false positive "Ghost" alerts from background vibrations.
                    </div>
                </div>

                 {/* Other settings placeholder */}
                 <div className="glass-panel p-5 rounded-xl opacity-60">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <Zap size={20} />
                        </div>
                         <div>
                            <h3 className="font-bold text-white">Valve Shut-off</h3>
                            <p className="text-xs text-slate-400">Automatic emergency cut-off</p>
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Enabled</span>
                        <div className="w-10 h-6 bg-slate-700 rounded-full relative">
                             <div className="absolute top-1 left-1 w-4 h-4 bg-slate-500 rounded-full"></div>
                        </div>
                    </div>
                 </div>
            </div>
          )}

        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 max-w-md mx-auto">
          <div className="flex justify-around items-center p-4">
            <button 
              onClick={() => setView(AppView.DASHBOARD)}
              className={`flex flex-col items-center gap-1 ${view === AppView.DASHBOARD ? 'text-cyan-400' : 'text-slate-500'}`}
            >
              <Home size={24} strokeWidth={view === AppView.DASHBOARD ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            
            <button 
              onClick={() => setView(App