import { useState } from "react";

type TerminalLine = { type: "input" | "output" | "error"; text: string };

const commandHelp = "Available commands: help, whoami, skills --list, projects, contact, clear";

function runCommand(command: string): string[] {
  switch (command.trim().toLowerCase()) {
    case "help":
      return [commandHelp];
    case "whoami":
      return ["Choco Lau — Full-Stack Software Developer", "C# / .NET • React • Python • API & hardware integration"];
    case "skills --list":
      return ["LANGUAGES : C#, Python, JavaScript, PHP", "FRONTEND  : React, TypeScript, HTML, CSS", "BACKEND   : .NET, ASP.NET Core, FastAPI, Node.js", "SYSTEMS   : REST APIs, SQL, Linux, Docker, COM/Serial"];
    case "projects":
      return ["Featured work: Steam Portfolio API, POS/Kiosk integrations, AI customer-service prototype.", "Scroll to PROJECTS for details."];
    case "contact":
      return ["Email: bjenny122@gmail.com", "LinkedIn: linkedin.com/in/choco-lau"];
    case "clear":
      return [];
    case "":
      return [];
    default:
      return [`Command not found: ${command}`, commandHelp];
  }
}

function Hero() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "output", text: "CH0C0_OS v1.0 // portfolio terminal" },
    { type: "output", text: 'Type "help" to explore available commands.' },
  ]);

  const submitCommand = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entered = command.trim();
    if (entered.toLowerCase() === "clear") {
      setHistory([]);
      setCommand("");
      return;
    }
    const output = runCommand(entered);
    setHistory((old) => [
      ...old,
      { type: "input", text: entered ? `visitor@choco:~$ ${entered}` : "visitor@choco:~$" },
      ...output.map((text) => ({ type: entered && output[0]?.startsWith("Command not found") ? "error" as const : "output" as const, text })),
    ]);
    setCommand("");
  };

  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="status-line"><span className="status-dot" /> AVAILABLE FOR OPPORTUNITIES</div>
        <p className="eyebrow">HELLO, I'M</p>
        <h1 id="hero-title">CHOCO <span>LAU</span><i className="cursor">_</i></h1>
        <h2>FULL-STACK <span>SOFTWARE DEVELOPER</span></h2>
        <p className="hero-description">
          Software developer by profession, gamer by habit, guitarist by passion.
          I build practical software across web, backend, and hardware-connected systems.
        </p>
        <div className="hero-actions">
          <a className="cyber-button" href="#projects">EXPLORE PROJECTS <span>↘</span></a>
          <a className="text-link" href="/CV.pdf" target="_blank" rel="noreferrer">VIEW RESUME ↗</a>
        </div>
        <div className="hero-tags"><span>C# / .NET</span><span>REACT</span><span>PYTHON</span><span>API + HARDWARE</span></div>
      </div>

      <div className="terminal" aria-label="Interactive portfolio terminal">
        <div className="terminal-topbar">
          <div className="terminal-lights"><i /><i /><i /></div>
          <span>CHOCO://TERMINAL</span>
          <span className="terminal-live">LIVE</span>
        </div>
        <div className="terminal-body" aria-live="polite">
          <div className="terminal-system">SYSTEM READY <span>●</span></div>
          {history.map((line, index) => (
            <p className={`terminal-line ${line.type}`} key={`${index}-${line.text}`}>{line.text}</p>
          ))}
          <form className="terminal-input-row" onSubmit={submitCommand}>
            <label htmlFor="terminal-command">visitor@choco:~$</label>
            <input
              id="terminal-command"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command"
            />
            <button type="submit" aria-label="Run command">↵</button>
          </form>
        </div>
        <div className="terminal-footer"><span>UTF-8</span><span>INTERACTIVE SHELL</span><span>100%</span></div>
      </div>
      <a className="scroll-cue" href="#projects"><span /> SCROLL TO EXPLORE</a>
    </section>
  );
}

export default Hero;
