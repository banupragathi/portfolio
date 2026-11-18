// src/components/Contact.jsx
import React, { useRef } from 'react';
import InteractiveHeading from './InteractiveHeading';

export default function Contact() {
  const chassisRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!chassisRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Base transform: rotateY(25deg) rotateX(10deg) rotateZ(-2deg)
    // Moving cursor right increases rotateY (tilts phone right)
    // Moving cursor down decreases rotateX (tilts phone down)
    const rotX = 10 - (y / rect.height) * 25;
    const rotY = 25 + (x / rect.width) * 35;
    
    chassisRef.current.style.transform = 'rotateY(' + rotY + 'deg) rotateX(' + rotX + 'deg) rotateZ(-2deg)';
  };

  const handleMouseLeave = () => {
    if (!chassisRef.current) return;
    chassisRef.current.style.transform = 'rotateY(25deg) rotateX(10deg) rotateZ(-2deg)';
  };

  return (
    <section id="connect">
      <div className="connect-inner">
        <div className="section-tag">✦ Late evening</div>
        <InteractiveHeading as="div" className="connect-title">Let's Connect</InteractiveHeading>
        <p className="connect-sub">I'm open to opportunities, collaborations, and conversations.</p>

        <div 
          className="phone-scene" 
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave}
        >
          <div className="phone-glow" />
          <div className="phone-chassis" ref={chassisRef}>
            <div className="phone-front">
              <div className="phone-notch-modern">
                <div className="camera-lens" />
                <div className="speaker-grill" />
              </div>

              <div className="phone-screen-content">
                <img src={`${import.meta.env.BASE_URL}assets/linkedin-profile.png`} alt="LinkedIn Profile" className="phone-image-content" />
              </div>
            </div>
          </div>
        </div>

        <p className="availability-statement">
          Open to full-time opportunities, meaningful projects, and professional collaborations.
        </p>
        
        <div className="connect-btns">
          <a className="cbtn cbtn-resume" href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noopener noreferrer">Resume</a>
          <a className="cbtn cbtn-li" href="https://www.linkedin.com/in/banu-pragathi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="cbtn cbtn-gh" href="https://github.com/banupragathi" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="cbtn cbtn-email" href="https://mail.google.com/mail/?view=cm&fs=1&to=banupragathi@gmail.com" target="_blank" rel="noopener noreferrer">Send Email</a>
        </div>
      </div>
    </section>
  );
}
