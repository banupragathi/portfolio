// src/components/Journey.jsx
import React, { useRef, useEffect } from 'react';
import { journeyMilestones } from '../data/journey';
import { initJourneyAnimation } from '../animations/journey';
import InteractiveHeading from './InteractiveHeading';

export default function Journey() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return initJourneyAnimation(sectionRef, canvasRef);
  }, []);

  return (
    <section id="journey" ref={sectionRef}>
      <canvas id="journey-constellation-canvas" ref={canvasRef} />

      <div className="journey-header">
        <div className="section-tag">✦ JOURNEY THROUGH THE STARS</div>
        <InteractiveHeading as="h2" className="journey-title">My <span className="journey-title-accent">Journey</span></InteractiveHeading>
        <p className="journey-subtitle">
          The milestones, experiences, leadership roles, and achievements that continue to shape
          my path in technology.
        </p>
      </div>

      <div className="journey-pathway">
        {journeyMilestones.map((item) => {
          const isLeft = item.side === 'left';
          
          // Normalize orgs
          let orgsToRender = [];
          if (item.orgs) {
            orgsToRender = item.orgs;
          } else if (item.org) {
            orgsToRender = [{ name: item.org, highlights: item.highlights }];
          } else {
            orgsToRender = [{ name: null, highlights: item.highlights }];
          }

          return (
            <div className={`journey-milestone journey-milestone--${item.side}`} key={item.id}>
              {/* If Left: archive then node */}
              {isLeft && (
                <div className="journey-archive journey-archive--left">
                  <div className="journey-archive__border" />
                  <div className="journey-archive__glass" />
                  <div className="journey-archive__content">
                    <div className="journey-archive__number">{item.number}</div>
                    <h3 className="journey-archive__title">{item.title}</h3>
                    {orgsToRender.map((org, i) => (
                      <React.Fragment key={i}>
                        {org.name && (
                          <div className="journey-archive__org" style={i > 0 ? { marginTop: '14px' } : {}}>
                            {org.name}
                          </div>
                        )}
                        <ul className="journey-archive__highlights">
                          {org.highlights.map((hl, j) => (
                            <li className="journey-archive__highlight" key={j}>{hl}</li>
                          ))}
                        </ul>
                      </React.Fragment>
                    ))}
                    <div className="journey-archive__quote">{item.quote}</div>
                  </div>
                  {item.particles.map((p, i) => (
                    <div className="journey-particle" style={parseStyleString(p.style)} key={i} />
                  ))}
                </div>
              )}

              <div className="journey-node" />

              {/* If Right: node then archive */}
              {!isLeft && (
                <div className="journey-archive journey-archive--right">
                  <div className="journey-archive__border" />
                  <div className="journey-archive__glass" />
                  <div className="journey-archive__content">
                    <div className="journey-archive__number">{item.number}</div>
                    <h3 className="journey-archive__title">{item.title}</h3>
                    {orgsToRender.map((org, i) => (
                      <React.Fragment key={i}>
                        {org.name && (
                          <div className="journey-archive__org" style={i > 0 ? { marginTop: '14px' } : {}}>
                            {org.name}
                          </div>
                        )}
                        <ul className="journey-archive__highlights">
                          {org.highlights.map((hl, j) => (
                            <li className="journey-archive__highlight" key={j}>{hl}</li>
                          ))}
                        </ul>
                      </React.Fragment>
                    ))}
                    <div className="journey-archive__quote">{item.quote}</div>
                  </div>
                  {item.particles.map((p, i) => (
                    <div className="journey-particle" style={parseStyleString(p.style)} key={i} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Helper to parse CSS string 'top:10%;right:8%;' into React style object
function parseStyleString(styleString) {
  return styleString.split(';').reduce((acc, rule) => {
    const [key, value] = rule.split(':');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});
}
