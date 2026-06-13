import React from 'react'
import ForestScene from './components/ForestScene.jsx'
import PythonSnake from './components/PythonSnake.jsx'
import Nav from './components/Nav.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Skills from './sections/Skills.jsx'
import Experience from './sections/Experience.jsx'
import Projects from './sections/Projects.jsx'
import Achievements from './sections/Achievements.jsx'
import Contact from './sections/Contact.jsx'

export default function App() {
  return (
    <div className="app">
      <div className="scene-bg">
        <ForestScene />
      </div>
      <PythonSnake />
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
        Built with React, Three.js & Framer Motion · © {new Date().getFullYear()} Yash Kesharwani
      </footer>
    </div>
  )
}
