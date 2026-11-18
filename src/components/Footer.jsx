// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="finale">
      <div className="finale-content">
        <div className="moon" />
        <div className="thanks-text">Thanks for visiting.</div>
        <div className="see-you">See you again at sunrise. ✦</div>
        <div className="back-top">
          <button onClick={scrollToTop}>↑ Back to top</button>
        </div>
      </div>
    </section>
  );
}
