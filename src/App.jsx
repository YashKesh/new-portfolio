import React, { useState } from 'react'
import NeonBackground from './components/NeonBackground.jsx'
import Rocket from './components/Rocket.jsx'
import CosmicCursor from './components/CosmicCursor.jsx'
import Nav from './components/Nav.jsx'
import Loader from './components/Loader.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Skills from './sections/Skills.jsx'
import Experience from './sections/Experience.jsx'
import Projects from './sections/Projects.jsx'
import Achievements from './sections/Achievements.jsx'
import Contact from './sections/Contact.jsx'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <CosmicCursor />
      <div className="app">
        <div className="scene-bg">
          <NeonBackground />
        </div>
        <Rocket />
        <Nav />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Achievements />
          <Contact />
        </main>
        <footer>
          <span style={{ color: 'var(--neon-cyan)' }}>◉</span> Built with React · Three.js · Framer Motion ·
          {' '}© {new Date().getFullYear()} Yash Kesharwani · STAGE-IV
        </footer>
      </div>
    </>
  )
}
