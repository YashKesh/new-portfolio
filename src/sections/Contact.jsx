import React from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/resume.js'

const items = [
  { label: 'Email',    val: profile.email,                              href: `mailto:${profile.email}`, icon: '✉' },
  { label: 'Phone',    val: profile.phone,                              href: `tel:${profile.phone.replace(/\s/g, '')}`, icon: '☎' },
  { label: 'LinkedIn', val: profile.linkedin.replace('https://', ''),  href: profile.linkedin, icon: 'in' },
  { label: 'GitHub',   val: profile.github.replace('https://', ''),    href: profile.github, icon: '⌥' },
]

export default function Contact() {
  return (
    <section id="contact">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="contact-wrap"
      >
        <div className="eyebrow">// open.comms</div>
        <h2>Establish a link.</h2>

        <motion.div
          className="contact-console"
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mission-corner tl" />
          <div className="mission-corner tr" />
          <div className="mission-corner bl" />
          <div className="mission-corner br" />

          <div className="contact-header">
            <div className="contact-status">
              <span className="hud-blink">●</span> CHANNEL OPEN · ACCEPTING TRANSMISSIONS
            </div>
            <div className="contact-id">FREQ · 2106-MHz</div>
          </div>

          <p className="lead" style={{ marginTop: 6 }}>
            I'm always down to talk Python, distributed systems, or great UI.
            Pick a channel — I'll respond fast.
          </p>

          <div className="contact-grid">
            {items.map((it, i) => (
              <motion.a
                key={it.label}
                className="contact-tile"
                href={it.href}
                target={it.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="contact-icon">{it.icon}</div>
                <div className="contact-meta">
                  <span className="label">{it.label}</span>
                  <span className="val">{it.val}</span>
                </div>
                <span className="contact-arrow">↗</span>
              </motion.a>
            ))}
          </div>

          <div className="contact-footer mono">
            <span style={{ color: 'var(--neon-cyan)' }}>$</span> awaiting transmission<span className="caret-blink">▍</span>
          </div>

          <div className="landing-pad" id="rocket-landing-pad" aria-hidden="true">
            <span className="pad-ring" />
            <span className="pad-ring r2" />
            <span className="pad-label">◉ LANDING PAD · YK-001</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
