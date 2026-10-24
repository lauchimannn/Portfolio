import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Gaming from "./components/Gaming";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Gaming />
        <section className="section beyond-section" id="beyond">
          <div className="section-kicker">04 / OFFLINE MODE</div>
          <h2>BEYOND THE <span>CODE</span></h2>
          <p className="section-intro">
            When I'm not building software, I'm usually gaming, playing guitar,
            watching anime, or exploring something new.
          </p>
          <div className="interest-grid">
            <article className="interest-card"><span className="interest-icon">♪</span><h3>GUITAR</h3><p>Music, practice, and the occasional riff.</p></article>
            <article className="interest-card"><span className="interest-icon">▣</span><h3>GAMING</h3><p>Systems, stories, co-op chaos, and strategy.</p></article>
            <article className="interest-card"><span className="interest-icon">✦</span><h3>ANIME & THEATRE</h3><p>Good stories and creative worlds.</p></article>
          </div>
        </section>
        <section className="section contact-section" id="contact">
          <div className="section-kicker">05 / OPEN CHANNEL</div>
          <h2>LET'S BUILD <span>SOMETHING</span></h2>
          <p className="section-intro">Have a project, an idea, or a role in mind? Send me a message.</p>
          <a className="cyber-button" href="mailto:bjenny122@gmail.com">CONTACT ME <span>↗</span></a>
        </section>
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} CHOCO LAU</span>
        <span>BUILT WITH <b>REACT</b> + <b>.NET</b></span>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </>
  );
}

export default App;
