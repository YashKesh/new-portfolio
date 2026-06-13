import React from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/resume.js'

const items = [
  { label: 'Email', val: profile.email, href: `mailto:${profile.email}` },
  { label: 'Phone', val: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
  { label: 'LinkedIn', val: profile.linkedin.replace('https://', ''), href: profile.linkedin },
  { label: 'GitHub', val: profile.github.replace('https://', ''), href: profile.github },
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
        <div className="eyebrow">// say hi</div>
        <h2>Let's build something.</h2>
        <p className="lead">
          I'm always down to talk Python, distributed systems, or great UI. Drop a line and I'll get back fast.
        </p>
        <div className="contact-grid">
          {items.map((it, i) => (
            <motion.a
              key={it.label}
              className="card"
              href={it.href}
              target={it.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <span className="label">{it.label}</span>
              <span className="val">{it.val}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
