# Project Analysis and Customization Summary

## Reference project analyzed

The referenced GitHub repository is a public React + Vite + Tailwind CSS AI portfolio website. Its README describes the main features as:

- AI portfolio chatbot
- Groq API integration
- Prompt optimizer tool
- Live GitHub project integration
- Responsive UI and animations
- React 18, Vite, Tailwind CSS, Framer Motion, React Icons, React Hot Toast, Groq API and GitHub REST API

## What was changed for Shivam

### Identity removed and replaced

Removed references to the original owner identity and replaced portfolio content with:

- Shivam Maurya
- Aspiring AI Engineer
- B.Tech Artificial Intelligence & Machine Learning
- St. John College of Engineering and Management
- GitHub: shivamrk022
- LinkedIn: shivam-maurya-4628a3291
- India-based AI/ML portfolio positioning

### Project positioning improved

The project is now positioned for AI/ML, GenAI and automation roles instead of generic web development.

New highlighted areas:

- Agentic AI
- RAG systems
- LLM apps
- Ollama/local AI
- FastAPI backend direction
- React frontend
- n8n automation workflows
- Interview-ready AI explanations

### New central data file

All portfolio details are centralized in:

```txt
src/data/profile.js
```

This makes future edits easy without searching every component.

### Chatbot improved

The chatbot now:

- Uses Shivam's portfolio data
- Can answer about skills, projects and education
- Supports Groq API
- Has fallback answers when no API key is configured

### Prompt optimizer improved

The prompt optimizer now:

- Helps create better AI coding-agent prompts
- Works with Groq API
- Has an offline fallback optimizer

### GitHub section updated

The live GitHub section now fetches from:

```txt
github.com/shivamrk022
```

### Honest experience section

No fake work experience was added. The section is written as:

- AI/ML Portfolio Developer — Self-directed Projects
- B.Tech AI/ML Student — St. John College of Engineering and Management

This is safer for interviews and resumes.

## Files changed / created

- `src/data/profile.js` — Shivam's details and project data
- `src/components/Hero.jsx` — main landing section
- `src/components/About.jsx` — education, skills, career goal
- `src/components/Projects.jsx` — featured projects and live GitHub repos
- `src/components/Experience.jsx` — honest fresher/student experience
- `src/components/Chat.jsx` — AI portfolio assistant
- `src/components/PromptTool.jsx` — prompt optimizer
- `src/components/Blog.jsx` — AI concept notes
- `src/components/Contact.jsx` — contact form and links
- `src/components/Footer.jsx` — final footer branding
- `README.md` — setup, run and deployment guide

## Recommended next edits

1. Add your real resume PDF inside `public/`.
2. Replace placeholder GitHub project links with exact repos after you push your projects.
3. Add your best deployed project URLs.
4. Add screenshots to the README after running locally.
5. Deploy on Vercel and add the live link to your resume.
