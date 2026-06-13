export const profile = {
  name: 'Yash Kesharwani',
  title: 'Python Developer · Backend Engineer',
  tagline: 'I build scalable Python backends, real-time microservices, and snappy React UIs.',
  location: 'Sion, Mumbai',
  email: 'imyash2106@gmail.com',
  phone: '+91 8369199474',
  linkedin: 'https://linkedin.com/yash-kesharwani',
  github: 'https://github.com/YashKesh',
}

export const education = {
  school: 'Shah & Anchor Kutchhi Engineering College',
  degree: 'B.E. — Information Technology',
  years: '2020 – 2024',
  cgpa: '9.6 / 10',
}

export const skills = {
  Languages: ['Python', 'Java', 'JavaScript', 'Go', 'C / C++'],
  Backend: ['Django', 'FastAPI', 'Flask', 'Spring Boot', 'PostgreSQL', 'MySQL'],
  Frontend: ['ReactJS', 'HTML', 'CSS'],
  Infra: ['Docker', 'Redis', 'Kafka', 'Celery', 'AWS', 'Azure'],
  Concepts: ['Microservices', 'System Design', 'Event-Driven', 'WebSockets', 'CI/CD', 'Distributed Storage'],
}

export const experience = [
  {
    company: 'BorderPlus',
    role: 'Software Developer',
    period: 'Dec 2025 – Present',
    stack: ['Python', 'FastAPI', 'Django', 'React.js', 'PostgreSQL', 'Celery', 'AWS', 'Docker', 'AI'],
    points: [
      'Designed scalable RESTful APIs using FastAPI & Django powering BorderPlus candidate learning microservices.',
      'Built a centralized email microservice with dynamic templates shared across services.',
      'Implemented centralized AWS API Gateway for routing, rate-limiting & async webhook ingestion via Celery + SQS.',
      'Secured S3 documents with time-bound presigned URLs for confidential file access.',
      'Built an AI-driven voice interview system using LLMs and Hume AI for real-time candidate evaluation.',
    ],
  },
  {
    company: 'Vector Consulting Group',
    role: 'Software Developer',
    period: 'Jun 2024 – Nov 2025',
    stack: ['Python', 'Django', 'React.js', 'Pandas', 'Redis', 'PostgreSQL', 'Celery', 'Azure', 'Docker', 'WebSocket'],
    points: [
      'Built clean, high-performance REST APIs for Vector Flow 2.0 SaaS using Django, async, Pydantic & DI.',
      'Engineered 50+ reusable React components incl. virtualized tables — 60–70% faster rendering on large datasets.',
      'Optimized multi-table queries with SQLAlchemy + Pandas — cut runtime from 12 min → 48 sec.',
      'Built modular microservices with Django + Redis Pub/Sub + API Gateway patterns.',
      'Shipped Docker deployments, Celery task queues & FastAPI WebSocket notifications.',
      'Implemented CI/CD on Azure DevOps for seamless versioning and reduced manual errors.',
      'Authored VAPT-aligned authentication, authorization & detailed technical documentation.',
    ],
  },
]

export const projects = [
  {
    name: 'Swarm Sentry',
    sub: 'Docker Management System',
    stack: ['Django', 'React.js', 'WebSocket', 'PostgreSQL', 'Docker', 'Linux'],
    points: [
      'Real-time container management with web UI — 30% less manual intervention via event-driven WebSocket updates.',
      'Role-based access control & container orchestration for secure, distributed operations.',
    ],
    link: 'https://github.com/YashKesh',
  },
  {
    name: 'MentorPrep',
    sub: 'Learning Application',
    stack: ['Java', 'Spring Boot', 'React.js', 'MongoDB'],
    points: [
      'Full-stack student↔mentor collaboration platform — used by 2,000+ students for study groups & peer learning.',
      'Secure auth, real-time comms and clean Mongo-backed APIs with optimized response times.',
    ],
    link: 'https://github.com/YashKesh',
  },
]

export const achievements = [
  'Winner — Smart India Hackathon 2023 (Cybersecurity Portal for Firewall & Server Management).',
  'Winner — Hackoder 2.0 (Collaborative Learning Management System).',
  'LeetCode rating 1700+ — top 20%, primarily solved in Java.',
]
