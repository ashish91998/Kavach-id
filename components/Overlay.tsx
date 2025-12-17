import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLIDES } from '../constants';
import { ChevronRight, ChevronLeft, ShieldCheck, Activity, Moon, Sun } from 'lucide-react';

interface OverlayProps {
  currentSlide: number;
  setSlide: (index: number) => void;
  direction: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ currentSlide, setSlide, direction, theme, toggleTheme }) => {
  const slide = SLIDES[currentSlide];
  const isDark = theme === 'dark';

  // Dynamic Styles based on theme
  const styles = {
    textMain: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-gray-400' : 'text-slate-500',
    textBody: isDark ? 'text-gray-300' : 'text-slate-700',
    border: isDark ? 'border-gray-800' : 'border-slate-300',
    borderHover: isDark ? 'hover:border-white' : 'hover:border-slate-900',
    iconColor: isDark ? 'text-gray-500' : 'text-slate-400',
    iconHover: isDark ? 'hover:text-white' : 'hover:text-slate-900',
    bgTrack: isDark ? 'bg-gray-900' : 'bg-slate-300',
    gridOverlay: isDark 
        ? 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
        : 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)'
  };

  // Animation Variants
  const textVariants = {
    hidden: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 50 : -50,
      filter: "blur(10px)"
    }),
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -50 : 50,
      filter: "blur(10px)",
      transition: { duration: 0.4, ease: "easeIn" }
    })
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-16 pointer-events-none">
      
      {/* Header / Nav Top */}
      <div className="flex justify-between items-center w-full pointer-events-auto">
        <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6" style={{ color: slide.highlightColor }} />
            <span className={`font-bold tracking-widest text-sm ${styles.textSub}`}>KAVACH ID SYSTEM</span>
        </div>
        
        <div className="flex items-center space-x-6">
            <div className={`hidden md:flex space-x-4 text-xs font-mono ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>
               <span>SEED_ROUND_2025</span>
               <span>V.1.0.4</span>
            </div>
            
            {/* Theme Toggle Button */}
            <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full border transition-all ${styles.border} ${styles.borderHover} ${styles.iconColor} ${styles.iconHover}`}
                aria-label="Toggle Theme"
            >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
             {/* Label Tag */}
             <motion.div variants={textVariants} className="overflow-hidden">
                <span 
                    className="inline-block px-3 py-1 text-xs font-bold tracking-[0.2em] border"
                    style={{ borderColor: slide.highlightColor, color: slide.highlightColor }}
                >
                    {slide.label}
                </span>
             </motion.div>

             {/* Headline */}
             <motion.h1 
                variants={textVariants}
                className={`text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-tight tracking-tighter ${styles.textMain}`}
                style={{ textShadow: `0 0 40px ${slide.highlightColor}22` }}
             >
                {slide.title}
             </motion.h1>

             {/* Subtitle */}
             <motion.h2 
                variants={textVariants}
                className={`text-xl md:text-2xl font-light border-l-2 pl-4 ${styles.textSub}`}
                style={{ borderColor: slide.highlightColor }}
             >
                {slide.subtitle}
             </motion.h2>

             {/* Bullet Points */}
             <motion.div variants={textVariants} className="pt-8 space-y-3">
                {slide.content.map((point, idx) => (
                    <div key={idx} className={`flex items-center space-x-3 text-lg font-light ${styles.textBody}`}>
                        <Activity className="w-4 h-4 opacity-50" />
                        <span>{point}</span>
                    </div>
                ))}
             </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Controls */}
      <div className="w-full pointer-events-auto">
        <div className="flex items-end justify-between">
            
            {/* Progress Bar */}
            <div className="flex-1 mr-8">
                <div className={`flex justify-between text-xs font-mono mb-2 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
                    <span>0{currentSlide + 1}</span>
                    <span>{SLIDES.length < 10 ? '0' : ''}{SLIDES.length}</span>
                </div>
                <div className={`h-[2px] w-full overflow-hidden ${styles.bgTrack}`}>
                    <motion.div 
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ backgroundColor: slide.highlightColor, boxShadow: `0 0 20px ${slide.highlightColor}` }}
                    />
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
                <button 
                    onClick={() => setSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                    className={`p-4 border transition-all disabled:opacity-20 disabled:cursor-not-allowed group ${styles.border} ${styles.borderHover} ${styles.iconColor} ${styles.iconHover}`}
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={() => setSlide(Math.min(SLIDES.length - 1, currentSlide + 1))}
                    disabled={currentSlide === SLIDES.length - 1}
                    className={`p-4 border transition-all disabled:opacity-20 disabled:cursor-not-allowed group ${styles.border} ${styles.borderHover} ${styles.iconColor} ${styles.iconHover}`}
                >
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
      </div>

      {/* Background Grid Overlay for Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ 
               backgroundImage: styles.gridOverlay, 
               backgroundSize: '40px 40px' 
           }} 
      />
    </div>
  );
};

export default Overlay;