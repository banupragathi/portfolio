// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#achievements', label: 'Achievements' },
    { href: '#projects', label: 'Projects' },
    { href: '#constellation-islands', label: 'Skills' },
    { href: '#journey', label: 'Journey' },
    { href: '#connect', label: 'Contact' },
  ];

  return (
    <nav id="nav" className={`${scrolled ? 'scrolled' : ''} ${menuOpen ? 'nav-open' : ''}`}>
      <div className="logo">BP</div>
      <ul className={menuOpen ? 'active' : ''}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <div className={`nav-toggle ${menuOpen ? 'active' : ''}`} id="nav-toggle" onClick={toggleMenu}>
        <span /><span /><span />
      </div>
    </nav>
  );
}
