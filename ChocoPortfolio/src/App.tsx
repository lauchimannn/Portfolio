import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Gaming from "./components/Gaming";
import Achievements from "./components/Achievements";
import { scrollToTop } from "./utils/scrollToTop";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Gaming />
        <Achievements />
        <section className="section beyond-section" id="beyond">
          <div className="section-kicker">03 / OFFLINE MODE</div>
          <h2>BEYOND THE <span>CODE</span></h2>
          <p className="section-intro">
            When I'm not coding, that's what I'm usually doing.
          </p>
          <div className="interest-grid">
            <article className="interest-card"><span className="interest-icon">♪</span><h3>GUITAR</h3><p>Casual learner.</p></article>
            <article className="interest-card"><span className="interest-icon">▣</span><h3>GAMING</h3><p>Active gamer.</p></article>
            <article className="interest-card"><span className="interest-icon">✦</span><h3>ANIME & THEATRE</h3><p>Nerd.</p></article>
          </div>
        </section>
        
        <section className="section contact-section" id="contact">
          <div className="section-kicker">04 / CONTACT ME</div>
          <h2>LET'S BUILD <span>SOMETHING</span></h2>

          <div className="contact-links">
            <a
              className="contact-link"
              href="mailto:bjenny122@gmail.com"
            >
              EMAIL <span>↗</span>
            </a>

            <a
              className="contact-link"
              href="https://linkedin.com/in/choco-lau-a3414318a"
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN <span>↗</span>
            </a>

            <a
              className="contact-link"
              href="https://github.com/lauchimannn/"
              target="_blank"
              rel="noreferrer"
            >
              GITHUB <span>↗</span>
            </a>

            <a
              className="contact-link"
              href="https://wa.me/85290452396"
              target="_blank"
              rel="noreferrer"
            >
              WHATSAPP <span>↗</span>
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} CHOCO LAU</span>
        <span>BUILT WITH <b>REACT</b> + <b>.NET</b></span>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
        >
          BACK TO TOP ↑
        </a>
      </footer>
    </>
  );
}

export default App;
