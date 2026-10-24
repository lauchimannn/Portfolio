const projects = [
  {
    number: "01",
    title: "STEAM API PORTFOLIO",
    type: "FULL-STACK WEB APP",
    stack: "React · TypeScript · ASP.NET Core · Steam Web API",
    description: "A personal portfolio that retrieves owned Steam games from a .NET API and presents gaming activity in a dedicated section.",
    tags: ["REST API", "C#", "REACT"],
  },
  {
    number: "02",
    title: "POS / KIOSK INTEGRATION",
    type: "DESKTOP + HARDWARE",
    stack: "C# · .NET · WPF / WinForms · Payment Devices",
    description: "Windows applications integrating payment terminals and external devices for real-world fare collection workflows.",
    tags: ["PAYMENTS", "COM / DEVICE INTEGRATION", "DEPLOYMENT"],
  },
  {
    number: "03",
    title: "AI CUSTOMER SERVICE PROTOTYPE",
    type: "AI SYSTEM",
    stack: "STT · LLM · TTS · API",
    description: "A prototype AI service with server, client library, and test tooling, demonstrated in kiosk-related scenarios.",
    tags: ["LLM", "INTEGRATION", "TEST TOOLING"],
  },
];

function Projects() {
  return (
    <section className="section projects-section shell" id="projects">
      <div className="section-kicker">01 / SELECTED WORK</div>
      <div className="section-heading-row">
        <div><h2>PROJECT <span>ARCHIVE</span></h2><p className="section-intro">A selection of systems, integrations, and experiments.</p></div>
        <span className="section-count">03 ENTRIES</span>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.number}>
            <div className="project-card-top"><span>PROJECT_{project.number}</span><span className="project-arrow">↗</span></div>
            <div className="project-graphic" aria-hidden="true"><span>{project.number}</span><i /></div>
            <p className="project-type">{project.type}</p>
            <h3>{project.title}</h3>
            <p className="project-stack">{project.stack}</p>
            <p className="project-description">{project.description}</p>
            <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
