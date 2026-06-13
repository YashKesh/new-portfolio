import React from 'react'

const links = [
  ['home', 'Home'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['contact', 'Contact'],
]

export default function Nav() {
  return (
    <nav className="nav">
      <a href="#home" className="logo">{'<yash.py />'}</a>
      <ul>
        {links.map(([id, label]) => (
          <li key={id}><a href={`#${id}`}>{label}</a></li>
        ))}
      </ul>
    </nav>
  )
}
