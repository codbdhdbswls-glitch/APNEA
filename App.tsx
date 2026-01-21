import React, { useState, useEffect, useRef } from 'react';
import { MEMBER_PROFILE } from './constants';
import { GlitchText } from './components/GlitchText';
import { SystemDashboard } from './components/SystemDashboard';
import { TicketSection } from './components/TicketSection';
import { Activity, Eye, BatteryMedium, Fish, Volume2, VolumeX, Power, Lock, Unlock, AlertTriangle, FileText, Film } from 'lucide-react';

const PROFILE_IMAGES = [
  "https://i.postimg.cc/BncpVBbg/IMG-3668.png",
  "https://i.postimg.cc/3wfgsSTS/IMG-3667.png"
];

// Memory Data Structure
const MEMORY_FILES: Record<string, {
  name: string;
  password?: string;
  hint?: string;
  content: React.ReactNode;
}> = {
  '2055_SUMMER.enc': {
    name: '2055_SUMMER.enc',
    password: '0647',
    content: (
      <div className="space-y-6">
        <div className="relative border border-gray-700 bg-black p-2 group overflow-hidden">
          <div className="absolute inset-0 bg-apnea-cyan/10 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
          <img 
            src="https://i.postimg.cc/fTKhQFH0/IMG-3670.png" 
            alt="Memory of 2055 Summer" 
            className="w-full h-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          />
          <div className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/50 px-2 py-0.5 text-gray-400">
            IMG_20550720.jpg
          </div>
        </div>
        <div className="text-center space-y-2 font-mono">
          <p className="text-sm text-gray-300 italic">
            "가장 행복했던 시절이었다."
          </p>
          <p className="text-[10px] text-gray-600">
            [DATA RESTORED: 100%]
          </p>
        </div>
      </div>
    )
  },
  'H_J_MESSAGES.log': {
    name: 'H_J_MESSAGES.log',
    password: '2055',
    hint: '모든 게 무너진 날',
    content: (
      <div className="py-2 space-y-4 text-sm leading-relaxed text-gray-300">
         <p className="text-xs text-gray-500 font-mono mb-4">[LOG DATE: 2055.07.XX]</p>
         <p className="italic text-gray-400">
           "그날 여름, 교실의 공기는 습했고 비린내가 났다."
         </p>
         <p>
           그녀(한제이)는 웃으면서 내게 다가와 속삭였다.<br/>
           가장 다정한 표정으로, 가장 잔인한 말을 뱉었다.
         </p>
         <div className="pl-4 border-l-2 border-red-900/50 my-4 text-gray-200">
           "네가 비어 있다는 거, 다들 알아. <br/>
           그래서 보고 있을 때만 쓸모가 있는 거야.<br/>
           <span className="text-red-500 font-bold">더러운 모조품.</span>"
         </div>
         <p>
           그 순간 나는 무너졌다.<br/>
           아니, 내가 무너진 것이 아니라<br/>
           원래 없었던 것이 드러난 것뿐이다.
         </p>
      </div>
    )
  },
  'TRUMAN_SHOW.mov': {
    name: 'TRUMAN_SHOW.mov',
    password: '1024',
    hint: '트루먼쇼 반영일',
    content: (
      <div className="space-y-4">
        <div className="w-full aspect-video bg-black border border-gray-800 flex items-center justify-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/1Z02vuppxP1Pa/giphy.gif')] bg-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
           <div className="absolute inset-0 scanlines opacity-30"></div>
           <div className="z-10 text-center">
             <p className="text-white font-serif italic text-xl drop-shadow-md">"In case I don't see you..."</p>
           </div>
        </div>
        <div className="font-mono text-sm space-y-2">
          <p className="text-gray-400">
             [NOTE] 피험자는 이 영화의 엔딩을 반복해서 시청함.
          </p>
          <p className="text-gray-500 text-xs">
             "벽에 부딪히면... 나갈 수 있어. 진짜 세상으로."
          </p>
        </div>
      </div>
    )
  }
};

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false); // Intro screen state
  const [observerCount, setObserverCount] = useState(10402);
  const [, setScrollProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hanJeiMode, setHanJeiMode] = useState<'OFF' | 'HORROR' | 'LOADING'>('OFF');
  const [headerGlitch, setHeaderGlitch] = useState(false);
  const [titleHover, setTitleHover] = useState(false);
  
  // Memory Unlock State
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [unlockedFiles, setUnlockedFiles] = useState<string[]>([]);
  const [memoryInput, setMemoryInput] = useState('');
  const [memoryError, setMemoryError] = useState(false);
  
  // Audio State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const horrorAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Audio Control
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  // Ticket Panic Audio Control
  const handleTicketPanicStart = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleTicketPanicEnd = () => {
    // Only resume if the user wants audio (isAudioPlaying is true)
    if (isAudioPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Resume failed", e));
    }
  };

  // Handle Enter Site (Guarantees Audio Play)
  const handleEnterSite = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.6;
        await audioRef.current.play();
        setIsAudioPlaying(true);
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }
    setHasEntered(true);
  };

  // Simulate live observer count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setObserverCount(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Profile Image Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % PROFILE_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerHanJeiEffect = () => {
    // 1. Pause Global Audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // 2. Play Horror Audio (Start from 3s)
    if (horrorAudioRef.current) {
      horrorAudioRef.current.currentTime = 3;
      horrorAudioRef.current.volume = 1.0;
      horrorAudioRef.current.play().catch(e => console.error("Horror play failed", e));
    }

    setHanJeiMode('HORROR');
    
    // Duration of Horror Phase (Extended slightly to hear the song)
    setTimeout(() => {
      // 3. Silence during Loading
      if (horrorAudioRef.current) {
        horrorAudioRef.current.pause();
        horrorAudioRef.current.currentTime = 0;
      }
      
      setHanJeiMode('LOADING');
      
      // Reset after loading
      setTimeout(() => {
        setHanJeiMode('OFF');
        
        // 4. Resume Global Audio
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.error("Resume failed", e));
          setIsAudioPlaying(true);
        }
      }, 3000); // 3 seconds of silent loading
    }, 1500); // 1.5 seconds of horror audio
  };

  const handleFileClick = (fileId: string) => {
    setActiveFileId(fileId);
    setMemoryInput('');
    setMemoryError(false);
  };

  const handleCloseModal = () => {
    setActiveFileId(null);
  };

  const handleMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFileId) return;

    const file = MEMORY_FILES[activeFileId];
    if (file && memoryInput === file.password) {
      setUnlockedFiles(prev => [...prev, activeFileId]);
      setMemoryError(false);
    } else {
      setMemoryError(true);
      setMemoryInput('');
    }
  };

  // INTRO SCREEN RENDER
  if (!hasEntered) {
    return (
      <div 
        onClick={handleEnterSite}
        className="fixed inset-0 z-[9999] bg-black text-apnea-cyan font-mono flex flex-col items-center justify-center cursor-pointer select-none"
      >
        <audio 
          ref={audioRef} 
          src="https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3" 
          loop 
          preload="auto"
        />
        <audio 
          ref={horrorAudioRef} 
          src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3" 
          preload="auto"
        />
        
        <div className="space-y-6 text-center animate-appear">
          <div className="animate-pulse">
            <Power className="w-12 h-12 mx-auto mb-4 opacity-80" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.5em] animate-glitch">
            APNEA_OS
          </h1>
          <div className="flex flex-col gap-2 text-xs md:text-sm text-gray-500 mt-8">
            <span className="typewriter-text">INITIALIZING OBSERVER TERMINAL...</span>
            <span className="animate-pulse text-apnea-alert">WARNING: AUDIO OUTPUT REQUIRED</span>
          </div>
          <div className="mt-12 border border-apnea-cyan/30 px-6 py-2 rounded-full text-sm hover:bg-apnea-cyan/10 transition-colors">
            CLICK TO CONNECT
          </div>
        </div>
        
        {/* Background ambience visual */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]"></div>
        <div className="absolute inset-0 scanlines opacity-50 pointer-events-none"></div>
      </div>
    );
  }

  const activeFile = activeFileId ? MEMORY_FILES[activeFileId] : null;
  const isCurrentFileUnlocked = activeFileId ? unlockedFiles.includes(activeFileId) : false;

  return (
    <div className="min-h-screen bg-apnea-dark text-apnea-text selection:bg-apnea-cyan selection:text-black font-sans overflow-x-hidden relative animate-appear">
      
      {/* Audio Elements */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3" 
        loop 
        hidden 
      />
      <audio 
        ref={horrorAudioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3" 
        hidden 
      />

      {/* Memory Password Modal */}
      {activeFile && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-appear">
          <div className="w-full max-w-md bg-gray-900 border border-gray-700 p-8 relative overflow-hidden font-mono shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-apnea-cyan"></div>
            <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              [CLOSE]
            </button>

            {!isCurrentFileUnlocked ? (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <Lock className="w-8 h-8 mx-auto text-apnea-alert animate-pulse mb-4" />
                  <h3 className="text-xl font-bold tracking-[0.2em] text-white">ENCRYPTED FILE</h3>
                  <p className="text-xs text-gray-500">SECURE MEMORY FRAGMENT: {activeFile.name}</p>
                </div>
                
                <form onSubmit={handleMemorySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block text-center">Enter Passcode</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={memoryInput}
                      onChange={(e) => setMemoryInput(e.target.value)}
                      placeholder="____"
                      className="w-full bg-black border-b-2 border-gray-700 focus:border-apnea-cyan outline-none text-center text-4xl tracking-[0.5em] text-white py-4 placeholder-gray-800 transition-colors"
                      autoFocus
                    />
                    {activeFile.hint && (
                      <p className="text-[10px] text-gray-600 text-center mt-2 animate-pulse">
                        HINT: {activeFile.hint}
                      </p>
                    )}
                  </div>
                  {memoryError && (
                    <div className="flex items-center justify-center gap-2 text-apnea-alert text-xs animate-shake">
                      <AlertTriangle className="w-3 h-3" />
                      <span>ACCESS DENIED: INCORRECT KEY</span>
                    </div>
                  )}
                  <button 
                    type="submit"
                    className="w-full bg-gray-800 hover:bg-apnea-cyan hover:text-black text-gray-400 hover:text-gray-900 py-3 text-xs tracking-[0.2em] transition-all uppercase border border-gray-700 hover:border-apnea-cyan"
                  >
                    Decrypt Data
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 animate-appear">
                 <div className="flex items-center gap-3 text-apnea-cyan border-b border-gray-800 pb-4">
                  <Unlock className="w-5 h-5" />
                  <h3 className="text-lg font-bold tracking-widest">DECRYPTION COMPLETE</h3>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {activeFile.content}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Han Jei Horror Overlay */}
      {hanJeiMode !== 'OFF' && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden cursor-none">
          {hanJeiMode === 'HORROR' ? (
            <>
              {/* Intense Chaotic Background */}
              <div className="absolute inset-0 bg-red-600 animate-pulse opacity-20 mix-blend-color-burn pointer-events-none" style={{ animationDuration: '0.1s' }}></div>
              <div className="absolute inset-0 bg-white opacity-10 animate-noise mix-blend-overlay pointer-events-none"></div>
              <div className="absolute inset-0 scanlines opacity-80 pointer-events-none z-50"></div>
              
              {/* Horror Text Container - vibrating and glitching violently */}
              <div className="relative z-50 max-w-6xl px-4 text-center flex flex-col items-center justify-center h-full space-y-12 animate-shake" style={{ animationDuration: '0.1s' }}>
                 <div className="relative">
                   <p className="text-2xl md:text-4xl text-red-500 font-bold tracking-tighter animate-glitch blur-[1px] opacity-80 absolute top-0 left-0 w-full" style={{ animationDuration: '0.15s' }}>
                      네가 비어 있다는 거, 다들 알아.
                   </p>
                   <p className="text-2xl md:text-4xl text-white font-bold tracking-tighter relative z-10 mix-blend-difference">
                      네가 비어 있다는 거, 다들 알아.
                   </p>
                 </div>

                 <div className="relative">
                    <p className="text-2xl md:text-4xl text-red-500 font-bold tracking-tighter animate-glitch blur-[1px] opacity-80 absolute top-0 left-0 w-full translate-x-1" style={{ animationDuration: '0.1s' }}>
                      그래서 보고 있을 때만 쓸모가 있는 거야.
                    </p>
                    <p className="text-2xl md:text-4xl text-white font-bold tracking-tighter relative z-10 mix-blend-difference">
                      그래서 보고 있을 때만 쓸모가 있는 거야.
                    </p>
                 </div>

                 <div className="relative mt-16 scale-125 md:scale-150">
                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-red-600 animate-glitch absolute top-0 left-0 w-full opacity-70 blur-sm translate-x-[-4px] translate-y-[2px]" style={{ animationDuration: '0.05s' }}>
                      더러운 모조품.
                    </h1>
                     <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white mix-blend-difference animate-noise relative z-20" style={{ animationDuration: '0.1s' }}>
                      더러운 모조품.
                    </h1>
                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-cyan-400 mix-blend-screen animate-glitch absolute top-0 left-0 w-full opacity-50 translate-x-[4px] translate-y-[-2px]" style={{ animationDuration: '0.08s' }}>
                      더러운 모조품.
                    </h1>
                 </div>
              </div>
            </>
          ) : (
            /* Loading Screen */
            <div className="flex flex-col items-center justify-center space-y-6 animate-appear">
               <Fish className="w-20 h-20 text-white opacity-90 animate-bounce" strokeWidth={1} />
               <span className="text-white font-mono text-xl tracking-[0.5em] uppercase animate-pulse">Loading...</span>
            </div>
          )}
        </div>
      )}

      {/* Sticky Header / HUD */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center font-mono text-xs md:text-sm">
        <div className="flex items-center gap-4">
          <span 
            className={`font-bold tracking-widest cursor-help transition-colors duration-100 ${headerGlitch ? 'text-apnea-alert animate-glitch' : 'text-apnea-cyan'}`}
            onMouseEnter={() => setHeaderGlitch(true)}
            onMouseLeave={() => setHeaderGlitch(false)}
            onTouchStart={() => setHeaderGlitch(true)}
            onTouchEnd={() => setHeaderGlitch(false)}
          >
            {headerGlitch ? 'TAEGYEONG_ v?' : 'APNEA_OS v2.3'}
          </span>
          <div className="hidden md:flex items-center gap-2 text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            OPERATIONAL
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-apnea-cyan" />
            <span className="tabular-nums">{observerCount.toLocaleString()}</span> Watching
          </div>
          
          <button 
            onClick={toggleAudio}
            className="text-gray-400 hover:text-apnea-cyan transition-colors"
            title={isAudioPlaying ? "Mute Ambient Sound" : "Enable Ambient Sound"}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button onClick={() => document.getElementById('ticket-section')?.scrollIntoView({ behavior: 'smooth'})} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded border border-white/20 transition-colors">
            BOOK_NOW
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video/Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale&blur=2" 
            alt="Stage Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)]"></div>
        </div>

        <div className="z-10 text-center space-y-6 max-w-4xl px-4">
          <div className="inline-block border border-apnea-cyan/30 bg-apnea-cyan/5 px-4 py-1 rounded-full text-apnea-cyan text-xs font-mono tracking-[0.2em] mb-4 animate-pulse">
            LIVE FEED: STABLE
          </div>
          
          <h1 
            className="text-5xl md:text-8xl font-black tracking-tighter leading-tight cursor-pointer select-none transition-all duration-100"
            onMouseEnter={() => setTitleHover(true)}
            onMouseLeave={() => setTitleHover(false)}
            onTouchStart={() => setTitleHover(true)}
            onTouchEnd={() => setTitleHover(false)}
          >
            {titleHover ? (
              <span className="relative inline-block text-apnea-alert animate-shake">
                {/* The RUN part */}
                <span className="relative inline-block">
                  RUN
                  {/* Noise layers */}
                  <span className="absolute top-0 left-0 text-white opacity-50 animate-noise mix-blend-overlay">RUN</span>
                  <span className="absolute top-0 left-0 text-red-500 opacity-80 animate-glitch translate-x-[2px]">RUN</span>
                </span>
                
                {/* Background noise aura for RUN */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/20 blur-xl pointer-events-none"></div>
              </span>
            ) : (
              <div className="text-white mix-blend-difference">
                <GlitchText text="EMPTY BUT RUNNING" />
              </div>
            )}
          </h1>
          
          <div className="text-xl md:text-2xl font-light text-gray-400 tracking-wide">
            2060 WORLD TOUR <span className="font-bold text-white">APNEA</span>
          </div>

          <p className="max-w-xl mx-auto text-sm md:text-base text-gray-500 mt-8 leading-relaxed font-mono">
            "가짜라도 유지된다면, 그걸로 충분하다."<br/>
            우리는 오늘 그가 깨지지 않고 작동하는지 확인하기 위해 모였습니다.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs font-mono animate-bounce">
          <span>SCROLL TO OBSERVE</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-600 to-transparent"></div>
        </div>
      </header>

      {/* Profile & Lore Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Visual Side */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-apnea-cyan to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden rounded-lg border border-gray-800">
              {PROFILE_IMAGES.map((src, index) => (
                <img 
                  key={src}
                  src={src} 
                  alt={`Yoon Tae-kyung ${index}`} 
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 
                    ${index === currentImageIndex ? 'opacity-80 scale-100' : 'opacity-0 scale-105'}
                    group-hover:scale-105 grayscale group-hover:grayscale-0
                  `}
                />
              ))}
              <div className="absolute bottom-4 left-4 font-mono text-xs z-10">
                <div className="bg-black/50 backdrop-blur px-2 py-1 text-apnea-cyan border-l-2 border-apnea-cyan">
                  SUBJ: {MEMBER_PROFILE.name}
                </div>
                <div className="mt-1 text-gray-400">STATUS: MONITORED</div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">윤태경</h2>
              <div className="h-1 w-20 bg-apnea-cyan mb-6"></div>
              <p className="text-gray-400 leading-relaxed mb-6">
                {MEMBER_PROFILE.description}
                <br/><br/>
                그는 무대를 수조라고 부릅니다. 화려한 조명 아래서만 숨을 쉴 수 있는 금붕어처럼, 
                당신의 시선이 끊기는 순간 그의 세계는 멈춥니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-sm">
              <div className="p-4 bg-white/5 border border-white/10">
                <span className="block text-gray-500 text-xs mb-1">POSITION</span>
                {MEMBER_PROFILE.position}
              </div>
              <div className="p-4 bg-white/5 border border-white/10">
                <span className="block text-gray-500 text-xs mb-1">SPEC</span>
                {MEMBER_PROFILE.specs}
              </div>
              <div className="p-4 bg-white/5 border border-white/10 col-span-2">
                <span className="block text-gray-500 text-xs mb-1">CURRENT MENTAL STATE</span>
                <div className="flex items-center gap-2 text-apnea-cyan">
                  <Activity className="w-4 h-4" />
                  STABLE (MEDICATION CONTROLLED)
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Triggers (Avoid)</h3>
              <div className="flex flex-wrap gap-2">
                {["SILENCE", "ISOLATION", "UNOBSERVED", "MIRRORS", "HAN JEI"].map((tag) => (
                  <span 
                    key={tag} 
                    onClick={tag === "HAN JEI" ? triggerHanJeiEffect : undefined}
                    className={`
                      px-3 py-1 text-xs rounded-full border transition-all duration-300
                      ${tag === "HAN JEI" 
                        ? "bg-black text-red-600 border-red-800 cursor-pointer hover:bg-red-900/50 hover:text-red-400 hover:border-red-500 font-bold animate-pulse" 
                        : "bg-red-900/20 text-red-400 border-red-900/50 cursor-default"
                      }
                    `}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Memory Section */}
            <div className="pt-6 border-t border-gray-800/50 mt-6">
              <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                Memory
                <Lock className="w-3 h-3" />
              </h3>
              <div className="space-y-2">
                {/* File 1: 2055_SUMMER.enc */}
                <div 
                  onClick={() => handleFileClick('2055_SUMMER.enc')}
                  className={`w-full p-3 bg-gray-900/20 border border-gray-800 rounded flex items-center justify-between group transition-all
                    ${unlockedFiles.includes('2055_SUMMER.enc')
                      ? 'border-apnea-cyan/50 bg-apnea-cyan/5 cursor-pointer hover:bg-apnea-cyan/10' 
                      : 'cursor-pointer hover:bg-gray-900/40 hover:border-apnea-cyan/30'
                    }`}
                >
                   <div className="flex items-center gap-3">
                      {unlockedFiles.includes('2055_SUMMER.enc') ? <Unlock className="w-3 h-3 text-apnea-cyan" /> : <Lock className="w-3 h-3 text-gray-600 group-hover:text-apnea-cyan" />}
                      <span className={`text-xs font-mono group-hover:text-gray-300 ${unlockedFiles.includes('2055_SUMMER.enc') ? 'text-apnea-cyan' : 'text-gray-500'}`}>2055_SUMMER.enc</span>
                   </div>
                   <span className={`text-[10px] font-mono group-hover:text-gray-300 ${unlockedFiles.includes('2055_SUMMER.enc') ? 'text-apnea-cyan' : 'text-gray-700'}`}>
                      {unlockedFiles.includes('2055_SUMMER.enc') ? 'OPEN_FILE' : 'ENCRYPTED'}
                   </span>
                </div>

                {/* File 2: H_J_MESSAGES.log */}
                 <div 
                   onClick={() => handleFileClick('H_J_MESSAGES.log')}
                   className={`w-full p-3 bg-gray-900/20 border border-gray-800 rounded flex items-center justify-between group transition-all
                    ${unlockedFiles.includes('H_J_MESSAGES.log')
                      ? 'border-apnea-cyan/50 bg-apnea-cyan/5 cursor-pointer hover:bg-apnea-cyan/10' 
                      : 'cursor-pointer hover:bg-gray-900/40 hover:border-apnea-cyan/30'
                    }`}
                 >
                   <div className="flex items-center gap-3">
                      {unlockedFiles.includes('H_J_MESSAGES.log') ? <FileText className="w-3 h-3 text-apnea-cyan" /> : <Lock className="w-3 h-3 text-gray-600 group-hover:text-red-900/70" />}
                      <span className={`text-xs font-mono group-hover:text-gray-300 ${unlockedFiles.includes('H_J_MESSAGES.log') ? 'text-apnea-cyan' : 'text-gray-500'}`}>H_J_MESSAGES.log</span>
                   </div>
                   <span className={`text-[10px] font-mono group-hover:text-gray-300 ${unlockedFiles.includes('H_J_MESSAGES.log') ? 'text-apnea-cyan' : 'text-gray-700'}`}>
                    {unlockedFiles.includes('H_J_MESSAGES.log') ? 'READ_LOG' : 'LOCKED'}
                   </span>
                </div>

                {/* File 3: TRUMAN_SHOW.mov */}
                <div 
                  onClick={() => handleFileClick('TRUMAN_SHOW.mov')}
                  className={`w-full p-3 bg-gray-900/20 border border-gray-800 rounded flex items-center justify-between group transition-all
                    ${unlockedFiles.includes('TRUMAN_SHOW.mov')
                      ? 'border-apnea-cyan/50 bg-apnea-cyan/5 cursor-pointer hover:bg-apnea-cyan/10' 
                      : 'cursor-pointer hover:bg-gray-900/40 hover:border-apnea-cyan/30'
                    }`}
                >
                   <div className="flex items-center gap-3">
                      {unlockedFiles.includes('TRUMAN_SHOW.mov') ? <Film className="w-3 h-3 text-apnea-cyan" /> : <Lock className="w-3 h-3 text-gray-600 group-hover:text-apnea-cyan" />}
                      <span className={`text-xs font-mono group-hover:text-gray-300 ${unlockedFiles.includes('TRUMAN_SHOW.mov') ? 'text-apnea-cyan' : 'text-gray-500'}`}>TRUMAN_SHOW.mov</span>
                   </div>
                   <span className={`text-[10px] font-mono group-hover:text-gray-300 ${unlockedFiles.includes('TRUMAN_SHOW.mov') ? 'text-apnea-cyan' : 'text-gray-700'}`}>
                    {unlockedFiles.includes('TRUMAN_SHOW.mov') ? 'PLAY_CLIP' : 'LOCKED'}
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Status / Panic Lore */}
      <section className="py-24 bg-black relative border-y border-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">MAINTENANCE PROTOCOLS</h2>
              <p className="text-gray-500 font-mono text-sm">Real-time biometrics and stability control.</p>
            </div>
            <div className="hidden md:block">
               <BatteryMedium className="text-apnea-cyan w-8 h-8 opacity-80" />
            </div>
          </div>
          <SystemDashboard />
        </div>
      </section>

      {/* Interactive Ticket Section */}
      <TicketSection 
        onPanicStart={handleTicketPanicStart}
        onPanicEnd={handleTicketPanicEnd}
      />

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800 text-center font-mono text-xs text-gray-600">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center gap-4 text-2xl font-bold text-gray-800 tracking-[0.5em] mb-8">
            APNEA
          </div>
          <p>
            COPYRIGHT © 2060 APNEA ENTERTAINMENT. ALL RIGHTS RESERVED.<br/>
            WARNING: Excessive observation may cause the subject to overheat.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <span className="hover:text-apnea-cyan cursor-pointer">PRIVACY</span>
            <span className="hover:text-apnea-cyan cursor-pointer">TERMS</span>
            <span className="hover:text-apnea-cyan cursor-pointer">SYSTEM STATUS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;