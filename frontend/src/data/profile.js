export const profile = {
  name: 'Shivam Maurya',
  shortName: 'Shivam',
  role: 'Aspiring AI Engineer',
  headline:
    'AI/ML student building agentic AI, RAG systems, automation workflows, and production-ready AI web apps.',
  location: 'Mumbai, India',
  email: 'shivamaurya9702@gmail.com',
  phone: '+91-9702515105',
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME || 'shivamrk022',
  githubUrl: 'https://github.com/shivamrk022',
  linkedinUrl: 'https://www.linkedin.com/in/shivam-maurya-4628a3291/',
  portfolioUrl: 'https://ai-website-shivam.vercel.app/index.html',
  resumeUrl: '/resume-placeholder.txt',
  education: {
    degree: 'B.Tech in Artificial Intelligence & Machine Learning',
    college: 'St. John College of Engineering and Management',
    duration: '2022 - 2026',
    cgpa: '6.0 CGPA',
  },
  labels: ['AI/ML', 'Generative AI', 'Agentic AI', 'RAG', 'Automation', 'FastAPI', 'React'],
  stats: [
    { label: 'AI Project Areas', value: '6+' },
    { label: 'Core Stack', value: 'Python + React' },
    { label: 'Focus', value: 'Job-ready AI Apps' },
  ],
  about: [
    'I am a final-year B.Tech student specializing in Artificial Intelligence and Machine Learning. My focus is on building practical AI systems that solve real business problems — not just simple demos.',
    'I work with Python, machine learning, deep learning basics, LLMs, RAG pipelines, FastAPI, Flask, React and automation tools such as n8n, Selenium and Playwright. I am especially interested in AI agents that can search, reason, use tools and automate repetitive workflows.',
    'My current goal is to become job-ready for AI/ML, GenAI and automation-focused software roles by building strong portfolio projects with clean code, clear documentation and deployable demos.',
  ],
  skills: [
    {
      title: 'AI / ML',
      items: [
        'Machine Learning',
        'Deep Learning Basics',
        'Scikit-learn',
        'NLP',
        'Model Evaluation',
        'Feature Engineering',
        'Data Preprocessing',
      ],
    },
    {
      title: 'Generative AI',
      items: [
        'LLM Applications',
        'RAG Systems',
        'AI Agents',
        'Prompt Engineering',
        'Ollama',
        'Groq API',
        'Gemini API',
      ],
    },
    {
      title: 'Backend & Automation',
      items: [
        'Python',
        'FastAPI',
        'REST APIs',
        'Flask',
        'n8n Workflows',
        'Selenium',
        'Playwright',
        'Web Scraping',
        'PostgreSQL',
      ],
    },
    {
      title: 'Frontend & Tools',
      items: [
        'React',
        'Tailwind CSS',
        'JavaScript',
        'HTML',
        'CSS',
        'Git',
        'GitHub',
        'Vercel',
        'VS Code / Antigravity IDE',
      ],
    },
  ],
  projects: [
    {
      title: 'Agentic AI Business Automation Platform',
      category: 'Agentic AI',
      description:
        'An advanced workflow-based AI system that uses LLMs, RAG, tool-calling, and automation agents to help companies handle support, document search, task routing, reporting, and repetitive operational tasks.',
      tech: ['Python', 'FastAPI', 'RAG', 'LLM', 'n8n', 'React', 'ChromaDB', 'Ollama / Groq API'],
      impact: 'Designed for company-level automation and resume-grade demonstration.',
      github: 'https://github.com/shivamrk022',
      demo: '#contact',
    },
    {
      title: 'Local AI Assistant with Ollama',
      category: 'LLM App',
      description:
        'A zero-cost local AI chatbot architecture using Ollama as the LLM backbone, with separate frontend and backend, API routes, and private local inference.',
      tech: ['Ollama', 'FastAPI', 'React', 'Python', 'Local LLM'],
      impact: 'Works without paid APIs and is suitable for student portfolio deployment.',
      github: 'https://github.com/shivamrk022',
      demo: '#contact',
    },
    {
      title: 'AI Resume and Interview Preparation Assistant',
      category: 'GenAI',
      description:
        'A career-focused assistant that analyzes resumes, generates interview questions and answers, explains projects simply, and helps candidates practice role-specific answers.',
      tech: ['RAG', 'LLM', 'React', 'FastAPI', 'Prompt Engineering'],
      impact: 'Useful for students preparing for technical interviews.',
      github: 'https://github.com/shivamrk022',
      demo: '#contact',
    },
    {
      title: 'Industrial AI Website with Smart Chatbot',
      category: 'AI Web App',
      description:
        'A business website upgraded with an AI chatbot, FAQ automation, service recommendation flow, and lead-generation contact system.',
      tech: ['HTML', 'CSS', 'JavaScript', 'Flask', 'Gemini API / Groq API'],
      impact: 'Shows how AI can improve customer support and business conversion.',
      github: 'https://github.com/shivamrk022/ai_website',
      demo: 'https://ai-website-shivam.vercel.app/index.html',
    },
    {
      title: 'Auto Bidding Bot',
      category: 'Automation',
      description:
        'An automation-based bot project that uses browser automation to interact with platforms and automate repetitive bidding or form-based workflows.',
      tech: ['Python', 'Playwright', 'Automation', 'Browser Scripting'],
      impact: 'Demonstrates practical automation, browser control, and workflow execution.',
      github: 'https://github.com/shivamrk022/Auto_Bidding_Bot',
      demo: '#contact',
    },
  ],
  experience: [
    {
      role: 'AI/ML Portfolio Developer',
      company: 'Self-directed Projects',
      duration: '2025 - Present',
      points: [
        'Building end-to-end AI/ML and GenAI projects with frontend, backend, model/API integration, and deployment-ready documentation.',
        'Creating automation-focused workflows using n8n, FastAPI, LLM tools, and local AI models for real business use cases.',
        'Practicing interview-ready explanations for AI agents, RAG, LLMs, applied machine learning, and automation projects.',
      ],
    },
    {
      role: 'B.Tech AI/ML Student',
      company: 'St. John College of Engineering and Management',
      duration: '2022 - 2026',
      points: [
        'Studying core AI/ML concepts including Python, data preprocessing, supervised learning, deep learning basics, and model evaluation.',
        'Focused on practical project-building for AI/ML internships, software roles, and GenAI/automation opportunities.',
        'Developing projects using Python, React, FastAPI, RAG, LLMs, and automation tools.',
      ],
    },
  ],
  blogs: [
    {
      title: 'How I Am Building a Job-Ready AI/ML Portfolio',
      summary:
        'A practical roadmap covering Python, machine learning, RAG, LLM apps, FastAPI, React, and deployment for AI/ML job readiness.',
      tags: ['AI/ML', 'Portfolio', 'Career'],
    },
    {
      title: 'What is Agentic AI in Simple Words?',
      summary:
        'An explanation of how AI agents can plan steps, use tools, call APIs, search knowledge, and complete tasks with less manual work.',
      tags: ['Agentic AI', 'LLM', 'Automation'],
    },
    {
      title: 'Why RAG Matters for Business AI Apps',
      summary:
        'How RAG helps AI answer from company documents, PDFs, and knowledge bases instead of guessing from general model memory.',
      tags: ['RAG', 'LLM', 'Business AI'],
    },
    {
      title: 'How Local LLMs Like Ollama Help Students Build AI Projects for Free',
      summary:
        'A beginner-friendly guide on using Ollama to build AI apps without paid APIs — perfect for students and self-learners.',
      tags: ['Ollama', 'LLM', 'Free Tools'],
    },
    {
      title: 'AI Automation for Small Businesses',
      summary:
        'How AI chatbots, workflow automation, and document intelligence can reduce manual work for companies.',
      tags: ['Automation', 'AI', 'Business'],
    },
  ],
}
