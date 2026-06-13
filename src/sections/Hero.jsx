import React from 'react'
import { motion } from 'framer-motion'
import HeroAvatar from '../components/HeroAvatar.jsx'
import { profile } from '../data/resume.js'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="role-tag">◉ MISSION-CTRL · PYTHON · BACKEND · AI</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="display"
        >
          <span className="glitch" data-text="YASH.">YASH.</span>
          <br />
          <span className="name-grad">Pilot of Python</span><br />
          systems &amp; APIs.
        </motion.h1>
        <motion.p
          className="lead"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          {profile.tagline} Currently piloting AI-driven microservices at BorderPlus —
          turning async distributed systems into clean APIs and snappy interfaces.
        </motion.p>
        <motion.div
          className="btn-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a className="btn primary" href="#projects">View payloads →</a>
          <a className="btn" href={`mailto:${profile.email}`}>Open comms</a>
        </motion.div>
      </div>
      <div className="hero-3d">
        <HeroAvatar />
      </div>
    </section>
  )
}
