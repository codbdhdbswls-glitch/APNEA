import React, { useState } from 'react';
import { TICKET_TIERS } from '../constants';
import { Eye, CheckCircle, Lock } from 'lucide-react';

interface PanicText {
  top: string;
  left: string;
  size: string;
  delay: string;
  rotation: string;
  text: string;
  opacity?: number;
}

interface TicketSectionProps {
  onPanicStart?: () => void;
  onPanicEnd?: () => void;
}

export const TicketSection: React.FC<TicketSectionProps> = ({ onPanicStart, onPanicEnd }) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [panicMode, setPanicMode] = useState(false);
  const [panicPhase, setPanicPhase] = useState(1); // For VVIP 2-stage effect
  const [panicTexts, setPanicTexts] = useState<PanicText[]>([]);

  // Helper to generate random text styles
  const generateTexts = (count: number, words: string[], options: {
    minSize: number, maxSize: number, minDelay: number, maxDelay: number
  }) => {
    return Array.from({ length: count }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * (options.maxSize - options.minSize) + options.minSize}rem`,
      delay: `${Math.random() * (options.maxDelay - options.minDelay) + options.minDelay}s`,
      rotation: `${Math.random() * 180 - 90}deg`,
      text: words[Math.floor(Math.random() * words.length)],
      opacity: Math.random() * 0.5 + 0.5
    }));
  };

  const handleBook = () => {
    if (selectedTier === null) return;
    
    // Silence main audio
    onPanicStart?.();

    setPanicMode(true);
    setPanicPhase(1);

    const finishBooking = () => {
      setPanicMode(false);
      setIsBooked(true);
      setPanicPhase(1);
      // Resume main audio
      onPanicEnd?.();
    };

    // TIER 0: VVIP (OBSERVER) - "살려줘" -> NOISE -> "살려달라고!!!"
    if (selectedTier === 0) {
      // Phase 1: Moderately fast generation
      const texts = generateTexts(400, ["살려줘"], { minSize: 1, maxSize: 5, minDelay: 0, maxDelay: 0.5 });
      setPanicTexts(texts);

      // Phase 2 transition after 1.5s (Slower)
      setTimeout(() => {
        setPanicPhase(2); 
      }, 1500);

      // Auto dismiss after 3.0s total (Slower)
      setTimeout(finishBooking, 3000);
    } 
    
    // TIER 1: R (WITNESS) - "어째서?", "왜?"
    else if (selectedTier === 1) {
      // Slower delay spread
      const texts = generateTexts(300, ["어째서?", "왜?", "이상해", "왜?"], { minSize: 0.8, maxSize: 3, minDelay: 0, maxDelay: 1.0 });
      setPanicTexts(texts);
      
      // Auto dismiss after 2.0s
      setTimeout(finishBooking, 2000);
    } 
    
    // TIER 2: S (AUDIENCE) - "내가 잘할게"
    else {
      // Slower
      const texts = generateTexts(400, ["내가 잘할게", "버리지 말아줘", "싫어", "아파", "잘못했어"], { minSize: 1, maxSize: 4, minDelay: 0, maxDelay: 0.8 });
      setPanicTexts(texts);
      
      // Auto dismiss after 1.5s
      setTimeout(finishBooking, 1500);
    }
  };

  // Optional manual dismiss if they click, but mostly automated now
  const handleDismiss = () => {
    setPanicMode(false);
    setIsBooked(true);
    setPanicPhase(1);
    // Resume main audio if manually dismissed
    onPanicEnd?.();
  };

  return (
    <div id="ticket-section" className="py-20 px-4 bg-apnea-dark relative">
      
      {/* Panic Overlay */}
      {panicMode && (
        <div 
          onClick={handleDismiss}
          className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center cursor-none"
        >
          
          {/* Common Background Elements */}
          <div className="absolute inset-0 bg-red-600 mix-blend-multiply animate-pulse opacity-50 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-10 mix-blend-screen pointer-events-none bg-cover"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-40 pointer-events-none"></div>
          <div className="absolute inset-0 scanlines opacity-30 z-40 pointer-events-none"></div>

          {/* VVIP PHASE 2: GIANT SCREAM */}
          {selectedTier === 0 && panicPhase === 2 ? (
             <div className="relative z-50 w-full h-full flex items-center justify-center bg-red-600/20 mix-blend-hard-light animate-noise pointer-events-none">
                <h1 className="text-[15vw] leading-none font-black text-white animate-shake text-center whitespace-nowrap drop-shadow-[0_0_15px_rgba(255,0,0,1)]">
                  살려달라고!!!
                </h1>
                {/* Extra chaotic overlays for VVIP Phase 2 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-50 animate-glitch mix-blend-difference">
                   <h1 className="text-[16vw] leading-none font-black text-red-500 whitespace-nowrap">
                    살려달라고!!!
                  </h1>
                </div>
             </div>
          ) : (
            /* STANDARD TEXT SCATTER (Used by VVIP Phase 1, Witness, Audience) */
            <div className="pointer-events-none w-full h-full absolute inset-0">
              {/* Central anchor text (Only for Audience/VVIP Phase 1) */}
              {selectedTier !== 1 && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                   <h1 className="text-9xl font-black text-red-600 animate-shake tracking-tighter mix-blend-hard-light scale-150">
                    {selectedTier === 0 ? "살려줘" : "잘못했어"}
                  </h1>
                </div>
              )}

              {/* Generated Text Cloud */}
              {panicTexts.map((style, i) => (
                <span
                  key={i}
                  className={`
                    absolute font-bold text-red-600/60 whitespace-nowrap select-none mix-blend-lighten
                    ${selectedTier === 1 ? 'animate-appear' : 'animate-pulse'} 
                  `}
                  style={{
                    top: style.top,
                    left: style.left,
                    fontSize: style.size,
                    animationDelay: style.delay,
                    opacity: style.opacity,
                    // @ts-ignore
                    transform: `translate(-50%, -50%) rotate(${style.rotation})`
                  }}
                >
                  {style.text}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 tracking-tighter mb-4">
            ALLOCATE VISION
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base">
            당신의 시선이 그를 존재하게 합니다. 관측 구역을 선택하십시오.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TICKET_TIERS.map((tier, index) => (
            <div 
              key={index}
              onClick={() => !isBooked && setSelectedTier(index)}
              className={`
                relative p-6 border-2 cursor-pointer transition-all duration-300
                ${selectedTier === index 
                  ? 'border-apnea-cyan bg-apnea-cyan/10 scale-105 z-10' 
                  : 'border-gray-800 bg-gray-900/40 hover:border-gray-600 opacity-70 hover:opacity-100'
                }
                ${isBooked ? 'pointer-events-none grayscale' : ''}
              `}
            >
              <div className="absolute top-4 right-4">
                {selectedTier === index ? <CheckCircle className="text-apnea-cyan w-6 h-6" /> : <Eye className="text-gray-700 w-6 h-6" />}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${selectedTier === index ? 'text-white' : 'text-gray-400'}`}>
                {tier.name}
              </h3>
              <p className="text-3xl font-mono text-gray-200 mb-6">{tier.price}</p>
              
              <div className="space-y-4">
                <div className="text-sm text-gray-400 border-l-2 border-gray-700 pl-3">
                  {tier.description}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-apnea-cyan/80 bg-black/30 p-2 rounded">
                  <Lock className="w-3 h-3" />
                  {tier.perk}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <button 
            onClick={handleBook}
            disabled={selectedTier === null || isBooked}
            className={`
              px-12 py-4 text-xl font-bold tracking-widest uppercase transition-all duration-500
              ${selectedTier !== null && !isBooked
                ? 'bg-apnea-cyan text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] skew-x-[-10deg]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isBooked ? "OBSERVATION CONFIRMED" : "START OBSERVATION"}
          </button>
          
          {isBooked && (
            <div className="animate-pulse text-apnea-alert font-mono text-sm mt-4">
              [SYSTEM] Connection Established. Subject is now stable.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};