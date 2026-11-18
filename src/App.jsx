// src/App.jsx
import React, { useEffect } from 'react';
import { gsap, ScrollTrigger } from './lib/gsap';
import { useLenis } from './hooks/useLenis';
import { useCursor } from './hooks/useCursor';
import { useMasterTimeline } from './hooks/useMasterTimeline';

import GlobalBackground from './components/GlobalBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // Initialize global hooks
  useLenis();
  useCursor();
  useMasterTimeline();

  useEffect(() => {
    // Refresh ScrollTrigger after all components are mounted to ensure accurate measurements
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <GlobalBackground />
      <Navbar />
      <Hero />
      {/* Animated Sun */}
      <div className="sun-wrapper" id="sun-wrapper">
        <div className="sun-container" id="sun-container">
          <div className="sun">
            <div className="sun-rays" />
          </div>
        </div>
      </div>
      <About />
      <Achievements />
      <Projects />
      <Skills />
      <Journey />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
