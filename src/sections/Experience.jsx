import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { experience } from '../data/resume.js'
import SkillRadar from '../components/SkillRadar.jsx'

export default function Experience() {
  return (
    <section id="experience">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="eyebrow">// missions.log</div>
        <h2>Missions flown.</h2>
        <p className="lead" style={{ marginBottom: 30 }}>
          Each card is a mission. The asteroids orbiting it are the tools I used — tap one.
        </p>
      </motion.div>

      <div className="mission-stack">
        {experience.map((job, i) => (
          <div className="mission-sticky" key={job.company} style={{ top: `${110 + i * 28}px`, zIndex: 10 + i }}>
            <MissionCard job={job} index={i} total={experience.length} />
          </div>
        ))}
      </div>
    </section>
  )
}

function MissionCard({ job, index, total }) {
  const [active, setActive] = useState(null)
  return (
    <motion.div
      className="mission-card"
      initial={{ opacity: 0, y: 60, rotateX: -6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mission-corner tl" />
      <div className="mission-corner tr" />
      <div className="mission-corner bl" />
      <div className="mission-corner br" />

      <div className="mission-grid">
        <div className="mission-info">
          <div className="mission-tag">MISSION-{String(index + 1).padStart(2, '0')}</div>
          <h3 className="mission-role">{job.role}</h3>
          <div className="mission-org">@ {job.company}</div>
          <div className="mission-period">{job.period}</div>
          <ul className="mission-points">
            {job.points.map((p, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: 0.06 * j }}
              >
                {p}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="mission-orbit">
          <SkillRadar skills={job.stack} active={active} onSelect={setActive} />
          <div className="orbit-readout">
            {active ? (
              <>
                <span className="ro-label">› TARGET LOCKED</span>
                <span className="ro-val">{active}</span>
                <span className="ro-meta">{skillMeta[active] || 'core mission tooling'}</span>
              </>
            ) : (
              <>
                <span className="ro-label">› STANDBY</span>
                <span className="ro-val">tap an asteroid</span>
                <span className="ro-meta">to scan tech used on this mission</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const skillMeta = {
  Python: 'primary language · async / pydantic / pandas',
  Django: 'REST APIs, ORM, admin, auth — heavy lifter',
  FastAPI: 'async microservices · websockets · OpenAPI',
  'React.js': 'virtualized tables, dashboards, 50+ components',
  JavaScript: 'frontend logic & async data flows',
  PostgreSQL: 'OLTP store · indexes · query tuning',
  Redis: 'cache · pub/sub · rate-limit',
  Celery: 'async task queue · scheduled jobs',
  Pandas: 'tabular data · ETL · perf wins',
  Docker: 'container builds · compose · prod deploys',
  WebSocket: 'real-time updates · live dashboards',
  AWS: 'SQS · S3 · API Gateway · IAM · SSM',
  'Microsoft Azure Cloud': 'CI/CD pipelines · cloud hosting',
  AI: 'LLMs · Hume AI · voice interview engine',
  'REST API': 'designed dozens of clean endpoints',
}
