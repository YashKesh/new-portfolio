import React from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/resume.js'

export default function Projects() {
  return (
    <section id="projects">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow">// side quests</div>
        <h2>Projects I've built.</h2>
      </motion.div>
      <div className="project-grid">
        {projects.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="card project-card"
            initial={{ opacity: 0, y: 30, rotateX: -8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <div className="sub">{p.sub}</div>
            <h3>{p.name} ↗</h3>
            <ul>
              {p.points.map((pt, j) => <li key={j}>{pt}</li>)}
            </ul>
            <div className="chip-row">
              {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
