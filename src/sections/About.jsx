import React from 'react'
import { motion } from 'framer-motion'
import { education, profile } from '../data/resume.js'

export default function About() {
  return (
    <section id="about">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow">// about</div>
        <h2>From Mumbai with curl &amp; coffee.</h2>
        <p className="lead">
          I'm an Information Technology grad from {education.school} (CGPA {education.cgpa}) who fell
          hard for Python and never looked back. Today I design event-driven microservices, optimize
          gnarly queries from minutes down to seconds, and ship React UIs that don't make users wait.
        </p>
        <p className="lead" style={{ marginTop: 14 }}>
          Whether it's a SaaS dashboard, an AI voice interview engine, or a Docker orchestration tool —
          I love going deep on system design and turning whiteboard sketches into production.
        </p>
      </motion.div>
    </section>
  )
}
