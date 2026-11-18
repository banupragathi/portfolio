// src/components/Projects.jsx
import React, { useRef, useEffect } from 'react';
import { projects } from '../data/projects';
import { initProjectsAnimation } from '../animations/projects';
import InteractiveHeading from './InteractiveHeading';

// Import Visuals
import DisasterMeshVisual from './visuals/DisasterMeshVisual';
import NetraVisual from './visuals/NetraVisual';
import EcoLearnVisual from './visuals/EcoLearnVisual';
import NinaivuVisual from './visuals/NinaivuVisual';
import SatqueryVisual from './visuals/SatqueryVisual';
import GramSevaVisual from './visuals/GramSevaVisual';

export default function Projects() {
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  
  useEffect(() => {
    return initProjectsAnimation(stackRef);
  }, []);

  const renderVisual = (id) => {
    switch(id) {
      case 'satquery': return <SatqueryVisual />;
      case 'netra': return <NetraVisual />;
      case 'ninaivu': return <NinaivuVisual />;
      case 'gramseva': return <GramSevaVisual />;
      case 'ecolearn': return <EcoLearnVisual />;
      case 'disastermesh': return <DisasterMeshVisual />;
      default: return null;
    }
  };

  return (
    <section id="projects" ref={sectionRef}>
      <div className="projects-header-new reveal">
        <div className="section-tag">✦ GOLDEN HOUR</div>
        <InteractiveHeading as="h2" className="section-title">FEATURED PROJECTS</InteractiveHeading>
        <p className="section-sub" style={{ maxWidth: '600px', margin: '0 auto' }}>
          A collection of products, platforms, AI systems,
          research initiatives, and solutions built through innovation, experimentation, and execution.
        </p>
      </div>

      <div className="projects-stack" ref={stackRef}>
        {projects.map((proj) => (
          <div className="project-landscape-card" id={`card-${proj.id}`} key={proj.id}>
            <div className="card-left">
              <div className="proj-category">{proj.category}</div>
              <h3 className="proj-title">{proj.title}</h3>
              <p className="proj-desc">{proj.description}</p>
              <div className="proj-quote">{proj.quote}</div>
              <div className="proj-tech">
                {proj.tech.map((t, idx) => (
                  <span key={idx}>{t}</span>
                ))}
              </div>
              <a href={proj.github} className="btn-proj-action">GITHUB ↗</a>
            </div>
            <div className="card-right">
              <div className="proj-visual-scene active" id={`scene-${proj.id}`}>
                {renderVisual(proj.id)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
