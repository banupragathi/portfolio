// src/components/Skills.jsx
import React, { useRef, useEffect } from 'react';
import { skillIslands as skills } from '../data/skills';
import { initSkillsAnimation } from '../animations/skills';
import InteractiveHeading from './InteractiveHeading';

export default function Skills() {
  const canvasRef = useRef(null);
  const slidesRef = useRef(null);

  useEffect(() => {
    return initSkillsAnimation(canvasRef, slidesRef, skills);
  }, []);

  return (
    <section id="constellation-islands">
      <div className="islands-header-container reveal">
        <div className="section-tag">✦ CONSTELLATION OF CAPABILITIES</div>
        <InteractiveHeading as="h2" className="section-title">Skills &amp; <span className="gradient-text-accent">Expertise</span></InteractiveHeading>
        <p className="section-sub">Scroll to explore the technologies, leadership, and innovation that shape my journey.</p>
      </div>
      <div className="islands-viewport">
        <canvas id="islands-canvas" ref={canvasRef} />
        
        <div ref={slidesRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          {skills.map((island, index) => (
            <div className={`island-slide ${index === 0 ? 'active' : ''}`} data-island={index} key={island.id}>
              <div className="island-info-panel">
                <div className="island-counter-inline">
                  <span className="island-num">0{index + 1}</span>
                  <span className="island-of">/05</span>
                </div>
                <h2 className="island-title" dangerouslySetInnerHTML={{ __html: island.title }} />
                <p className="island-tagline">{island.tagline}</p>
                <div className="island-skills-card">
                  {island.nodes.map((node, i) => (
                    <span className="island-pill" key={i}>{node.label}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
