import React, { useState } from 'react';
import { PANIC_DATA, MEDICATIONS } from '../constants';
import { Activity, AlertTriangle, Cpu, Zap, Eye, ShieldAlert } from 'lucide-react';

export const SystemDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PANIC' | 'MEDS'>('PANIC');

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 border border-apnea-dim bg-apnea-panel/80 rounded-sm font-mono relative overflow-hidden group">
      {/* Decorative Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

      <div className="flex items-center justify-between mb-8 border-b border-apnea-dim pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-apnea-cyan">
          <Cpu className="w-6 h-6 animate-pulse" />
          SYSTEM DIAGNOSTICS
        </h2>
        <div className="flex gap-2">
           <button 
            onClick={() => setActiveTab('PANIC')}
            className={`px-4 py-1 text-sm border ${activeTab === 'PANIC' ? 'bg-apnea-alert text-black border-apnea-alert' : 'text-gray-500 border-gray-800 hover:border-apnea-alert hover:text-apnea-alert'} transition-all`}
          >
            ERROR_LOGS
          </button>
          <button 
            onClick={() => setActiveTab('MEDS')}
            className={`px-4 py-1 text-sm border ${activeTab === 'MEDS' ? 'bg-apnea-cyan text-black border-apnea-cyan' : 'text-gray-500 border-gray-800 hover:border-apnea-cyan hover:text-apnea-cyan'} transition-all`}
          >
            MAINTENANCE_KIT
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'PANIC' ? (
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-apnea-alert mb-4">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-sm tracking-widest">WARNING: UNSTABLE EMOTIONAL SECTORS DETECTED</span>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PANIC_DATA.map((data, idx) => (
                <div key={idx} className="border border-apnea-dim p-4 hover:border-apnea-alert transition-colors duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 text-[10px] text-gray-600">{data.stage}</div>
                  <h3 className="text-lg font-bold text-gray-200 mb-2">{data.title}</h3>
                  <ul className="text-xs text-gray-400 space-y-2 mb-4 list-disc pl-4">
                    {data.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                  <div className="mt-auto border-t border-gray-800 pt-2">
                    <p className="text-xs italic text-apnea-alert">"{data.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-red-950/20 border border-red-900/50 text-xs text-red-300 font-sans">
              <span className="font-bold block mb-1">OBSERVER NOTE:</span>
              "관측이 중단되면 호흡 불안정이 즉각 발생합니다. 지속적인 시선 유지가 필수적입니다."
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-apnea-cyan mb-4">
                <Activity className="w-5 h-5" />
                <span className="text-sm tracking-widest">STATUS: CHEMICAL REGULATION ACTIVE</span>
             </div>
            <div className="grid grid-cols-1 gap-4">
              {MEDICATIONS.map((med, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-start md:items-center border-b border-gray-800 pb-4 last:border-0 hover:bg-white/5 p-2 transition-colors">
                  <div className="w-full md:w-1/4 mb-2 md:mb-0">
                    <span className="text-apnea-cyan font-bold text-lg block">{med.name}</span>
                    <span className="text-gray-500 text-xs uppercase">{med.category}</span>
                  </div>
                  <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 block text-[10px] uppercase">Purpose</span>
                      <span className="text-gray-300">{med.purpose}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-[10px] uppercase">Effect</span>
                      <span className="text-gray-300">{med.effect}</span>
                    </div>
                     <div>
                      <span className="text-gray-600 block text-[10px] uppercase">Side Effect</span>
                      <span className="text-red-400/80">{med.sideEffect}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
             <div className="mt-8 p-4 bg-cyan-950/20 border border-cyan-900/50 text-xs text-cyan-300 font-sans">
              <span className="font-bold block mb-1">SYSTEM NOTE:</span>
              "이 약물들은 치료제가 아닙니다. 현재 상태를 유지(Maintain)하기 위한 최소한의 장치입니다."
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
