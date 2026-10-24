import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header" id="top">
      <nav className="navbar shell" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={closeMenu}>
          <span className="brand-mark">C<span>.</span></span>
          <span>CHOCO<span className="brand-muted">.DEV</span></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          <a href="#projects" onClick={closeMenu}>PROJECTS</a>
          <a href="#gaming" onClick={closeMenu}>GAMING</a>
          <a href="#beyond" onClick={closeMenu}>BEYOND CODE</a>
          <a href="#contact" onClick={closeMenu}>CONTACT</a>
          <a className="nav-cv" href="/Choco-Lau_CV.pdf" target="_blank" rel="noreferrer">RESUME ↗</a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
