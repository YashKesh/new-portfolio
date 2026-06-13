import React from 'react'
import { motion } from 'framer-motion'
import { achievements } from '../data/resume.js'

const ICONS = ['🏆', '🥇', '⚡']

export default function Achievements() {
  return (
    <section id="achievements">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow">// trophies</div>
        <h2>Wins along the way.</h2>
      </motion.div>
      <div className="ach-grid">
        {achievements.map((a, i) => (
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
          >
            <div className="ico">{ICONS[i % ICONS.length]}</div>
            <p style={{ color: 'var(--ink-dim)', lineHeight: 1.55 }}>{a}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
