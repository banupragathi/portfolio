// src/components/About.jsx
import React, { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';
import InteractiveHeading from './InteractiveHeading';


export default function About() {
  const sectionRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (avatarRef.current) {
        gsap.fromTo(avatarRef.current,
          { y: 40 },
          {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef}>
      <div className="about-grid">
        <div className="about-avatar" ref={avatarRef}>
          <div className="avatar-frame">
            <img src={`${import.meta.env.BASE_URL}assets/portrait.png`} alt="Banu Pragathi" className="portrait-img" />
          </div>
          <div className="avatar-glow" />
        </div>
        <div className="about-text">
          <div className="section-tag">✦ About me</div>
          <InteractiveHeading as="div" className="section-title">AI Engineer &amp;<br />Creative Developer</InteractiveHeading>
          <p className="about-bio">
            I'm a Computer Science student specializing in Artificial Intelligence and Machine
            Learning. I enjoy transforming ideas into innovative solutions through technology. My interests extend beyond
            development into leadership, public speaking, and organizing collaborative initiatives that create meaningful
            impact.
          </p>
          <div className="about-focus">AI · Web Development · Research · Innovation</div>
          <div className="skills-row">
            <span className="skill-pill sp-pink">Python</span>
            <span className="skill-pill sp-blue">React</span>
            <span className="skill-pill sp-purple">AI / ML</span>
            <span className="skill-pill sp-yellow">Java</span>
            <span className="skill-pill sp-orange">UI/UX</span>
            <span className="skill-pill sp-pink">Leadership</span>
            <span className="skill-pill sp-blue">Research</span>
            <span className="skill-pill sp-purple">Innovation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
