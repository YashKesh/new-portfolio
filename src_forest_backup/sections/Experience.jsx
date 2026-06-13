import React from 'react'
import { motion } from 'framer-motion'
import { experience } from '../data/resume.js'

export default function Experience() {
  return (
    <section id="experience">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow">// experience</div>
        <h2>Where I've shipped.</h2>
      </motion.div>
      <div className="timeline">
        {experience.map((job, i) => (
          <motion.div
            key={job.company}
            className="t-item"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="t-head">
              <div className="role">{job.role} <span>@ {job.company}</span></div>
              <div className="period">{job.period}</div>
            </div>
            <div className="chip-row">
              {job.stack.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
            <ul className="t-points">
              {job.points.map((p, j) => (
                <motion.li
                  key={j}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: 0.05 * j }}
                >
                  {p}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
