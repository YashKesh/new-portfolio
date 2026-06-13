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
          <span className="role-tag">🐍 Python · Backend · Microservices</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Hey, I'm <span className="name-grad">Yash</span>.<br />
          I make Python <span className="name-grad">slither</span> across servers.
        </motion.h1>
        <motion.p
          className="lead"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          {profile.tagline} Currently shipping AI-driven microservices at BorderPlus,
          turning complex async systems into clean APIs and slick interfaces.
        </motion.p>
        <motion.div
          className="btn-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a className="btn primary" href="#projects">See my work →</a>
          <a className="btn" href={`mailto:${profile.email}`}>Get in touch</a>
        </motion.div>
      </div>
      <div className="hero-3d">
        <HeroAvatar />
      </div>
    </section>
  )
}
