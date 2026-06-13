import React from 'react'
import { motion } from 'framer-motion'
import SkillsGalaxy from '../components/SkillsGalaxy.jsx'

export default function Skills() {
  return (
    <section id="skills">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow">// stack.galaxy</div>
        <h2>The tech I orbit.</h2>
        <p className="lead" style={{ marginBottom: 28 }}>
          Each ring is a domain. Each planet is a tool I ship with. Hover to highlight.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <SkillsGalaxy />
      </motion.div>
    </section>
  )
}
