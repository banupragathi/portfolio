// src/components/Achievements.jsx
import React, { useRef, useEffect } from 'react';
import { achievements } from '../data/achievements';
import { initAchievementsAnimation } from '../animations/achievements';
import InteractiveHeading from './InteractiveHeading';

export default function Achievements() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    return initAchievementsAnimation(containerRef, trackRef, sectionRef);
  }, []);

  return (
    <section id="achievements" ref={sectionRef}>
      <div className="section-header">
        <div className="section-tag">✦ Milestones</div>
        <InteractiveHeading as="div" className="section-title">Achievements Gallery</InteractiveHeading>
        <p className="section-sub">A collection of moments that shaped the journey.</p>
      </div>
      <div className="gallery-3d-container" ref={containerRef}>
        <div className="gallery-3d-track" ref={trackRef}>
          {achievements.map((item) => (
            <div className="gallery-3d-card" key={item.id}>
              <div className="card-top-label">{item.label}</div>
              <div className="card-title">{item.title}</div>
              <div className="card-desc">{item.desc}</div>
              <div 
                className="card-image-placeholder"
                style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
