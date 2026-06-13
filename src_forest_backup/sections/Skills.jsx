import React from 'react'
import { motion } from 'framer-motion'
import { skills } from '../data/resume.js'

export default function Skills() {
  return (
    <section id="skills">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow">// stack</div>
        <h2>What I work with.</h2>
      </motion.div>
      <div className="skill-grid">
        {Object.entries(skills).map(([group, items], idx) => (
          <motion.div
            key={group}
            className="card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
          >
            <h3>{group}</h3>
            <div className="chip-row">
              {items.map((s) => <span key={s} className="chip dot">{s}</span>)}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
