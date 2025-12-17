import React, { useState, useEffect } from 'react';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import Cursor from './components/Cursor';
import { SLIDES } from './constants';

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleSlideChange = (newIndex: number) => {
    setDirection(newIndex > currentSlide ? 1 : -1);
    setCurrentSlide(newIndex);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Sync body background color with theme to prevent overscroll color mismatch
  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#050505' : '#f0f2f5';
  }, [theme]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        if (currentSlide < SLIDES.length - 1) handleSlideChange(currentSlide + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentSlide > 0) handleSlideChange(currentSlide - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <main 
      className={`relative w-screen h-screen overflow-hidden transition-colors duration-500 ${
        theme === 'dark' 
          ? 'bg-medical-black text-white selection:bg-white selection:text-black' 
          : 'bg-[#f0f2f5] text-slate-900 selection:bg-black selection:text-white'
      }`}
    >
      <Cursor />
      
      {/* 3D Scene Layer */}
      <Experience currentSlide={currentSlide} theme={theme} />

      {/* UI Overlay Layer */}
      <Overlay 
        currentSlide={currentSlide} 
        setSlide={handleSlideChange} 
        direction={direction}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </main>
  );
};

export default App;