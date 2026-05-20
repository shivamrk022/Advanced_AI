import {
  GraduationCap, Briefcase, Heart, Scale, Search, User, BarChart3, MessageCircle,
  BookOpen, Target, HelpCircle, Sparkles,
  FileText, Mail, Handshake, PenTool,
  Stethoscope, Pill, Activity, Brain,
  Landmark, Shield, BookOpenCheck,
  TrendingUp, Users, Megaphone, ClipboardList,
} from 'lucide-react'

export const MODULES = [
  {
    id: 'student',
    title: 'Student Hub',
    description: 'AI-powered study guides, career paths, quizzes, and topic explanations.',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/20',
    subModules: [
      { id: 'study-guide', label: 'Study Guide', icon: BookOpen, fields: [
        { name: 'subject', label: 'Subject', placeholder: 'e.g., Physics', type: 'text' },
        { name: 'topic', label: 'Specific Topic', placeholder: 'e.g., Light Waves', type: 'text' },
        { name: 'level', label: 'Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
      ]},
      { id: 'career-path', label: 'Career Path', icon: Target, fields: [
        { name: 'interest', label: 'Your Interest Area', placeholder: 'e.g., AI/ML Engineering', type: 'text' },
        { name: 'education', label: 'Current Education', placeholder: 'e.g., B.Tech AI/ML', type: 'text' },
      ]},
      { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle, fields: [
        { name: 'topic', label: 'Quiz Topic', placeholder: 'e.g., Python Basics', type: 'text' },
        { name: 'count', label: 'Number of Questions', type: 'select', options: ['5', '10', '15', '20'] },
      ]},
      { id: 'explain', label: 'Explain Topic', icon: Sparkles, fields: [
        { name: 'question', label: 'What should I explain?', placeholder: 'e.g., How does RAG work?', type: 'textarea' },
      ]},
    ],
  },
  {
    id: 'career',
    title: 'AI Career & CV',
    description: 'Generate ATS resumes, cover letters, job match analysis, and professional emails.',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/20',
    subModules: [
      { id: 'cv-builder', label: 'CV Builder', icon: FileText, fields: [
        { name: 'name', label: 'Full Name', placeholder: 'Shivam Maurya', type: 'text' },
        { name: 'experience', label: 'Work Experience', placeholder: 'Describe your experience...', type: 'textarea' },
        { name: 'skills', label: 'Skills', placeholder: 'Python, React, FastAPI, RAG...', type: 'textarea' },
        { name: 'education', label: 'Education', placeholder: 'B.Tech AI/ML, 2022-2026', type: 'text' },
      ]},
      { id: 'cover-letter', label: 'Cover Letter', icon: PenTool, fields: [
        { name: 'job_title', label: 'Job Title', placeholder: 'AI/ML Engineer', type: 'text' },
        { name: 'company', label: 'Company Name', placeholder: 'e.g., Google', type: 'text' },
        { name: 'skills', label: 'Your Key Skills', placeholder: 'Python, ML, RAG, LLMs...', type: 'textarea' },
      ]},
      { id: 'job-match', label: 'Job Match', icon: Handshake, fields: [
        { name: 'job_description', label: 'Job Description', placeholder: 'Paste the job description here...', type: 'textarea' },
        { name: 'your_skills', label: 'Your Skills', placeholder: 'Your skills and experience...', type: 'textarea' },
      ]},
      { id: 'email-writer', label: 'Email Writer', icon: Mail, fields: [
        { name: 'job_title', label: 'Job Title', placeholder: 'AI Developer', type: 'text' },
        { name: 'company', label: 'Company Name', placeholder: 'TCS', type: 'text' },
        { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Bold'] },
      ]},
    ],
  },
  {
    id: 'health',
    title: 'Health Assistant',
    description: 'Symptom checker, medication info, health Q&A, and wellness guidance.',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-500',
    textColor: 'text-rose-500',
    borderColor: 'border-rose-500/20',
    disclaimer: '⚠️ For informational purposes only. Always consult a qualified doctor.',
    subModules: [
      { id: 'symptoms', label: 'Symptom Checker', icon: Stethoscope, fields: [
        { name: 'symptoms', label: 'Describe Your Symptoms', placeholder: 'e.g., headache, fatigue, mild fever for 2 days...', type: 'textarea' },
        { name: 'age', label: 'Age', placeholder: '22', type: 'text' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
      ]},
      { id: 'medication', label: 'Medication Info', icon: Pill, fields: [
        { name: 'medication', label: 'Medication Name', placeholder: 'e.g., Paracetamol', type: 'text' },
      ]},
      { id: 'health-qa', label: 'Health Q&A', icon: Activity, fields: [
        { name: 'question', label: 'Ask a Health Question', placeholder: 'e.g., What are the benefits of intermittent fasting?', type: 'textarea' },
      ]},
      { id: 'wellness', label: 'Wellness Tips', icon: Brain, fields: [
        { name: 'area', label: 'Wellness Area', type: 'select', options: ['Mental Health', 'Nutrition', 'Exercise', 'Sleep', 'Stress Management'] },
      ]},
    ],
  },
  {
    id: 'legal',
    title: 'Legal Advisor',
    description: 'Country-specific laws, rights, and legal explanations powered by AI.',
    icon: Scale,
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-500',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500/20',
    disclaimer: '⚠️ AI-generated legal information. Not a substitute for professional legal advice.',
    subModules: [
      { id: 'country-laws', label: 'Country Laws', icon: Landmark, fields: [
        { name: 'country', label: 'Country', type: 'select', options: ['India', 'Pakistan', 'USA', 'UK', 'UAE', 'Saudi Arabia', 'Canada', 'Australia'] },
        { name: 'topic', label: 'Law Topic', type: 'select', options: ['Labor Law', 'Tenant Law', 'Consumer Rights', 'Criminal Law', 'Business Law', 'Family Law'] },
      ]},
      { id: 'rights', label: 'Know Your Rights', icon: Shield, fields: [
        { name: 'country', label: 'Country', type: 'select', options: ['India', 'Pakistan', 'USA', 'UK', 'UAE', 'Saudi Arabia'] },
        { name: 'role', label: 'Your Role', type: 'select', options: ['Employee', 'Tenant', 'Consumer', 'Student', 'Business Owner'] },
      ]},
      { id: 'explain-law', label: 'Explain a Law', icon: BookOpenCheck, fields: [
        { name: 'question', label: 'Your Legal Question', placeholder: 'e.g., What are the tenant rights in India?', type: 'textarea' },
      ]},
    ],
  },
  {
    id: 'jobs',
    title: 'Live Job Search',
    description: 'Search live job listings with filters. Powered by real-time data.',
    icon: Search,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500/20',
    subModules: [
      { id: 'search-jobs', label: 'Search Jobs', icon: Search, fields: [
        { name: 'keyword', label: 'Job Title / Keyword', placeholder: 'e.g., AI Engineer', type: 'text' },
        { name: 'location', label: 'Location', placeholder: 'e.g., Mumbai, India', type: 'text' },
      ]},
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio Builder',
    description: 'Generate a clean, shareable digital portfolio from your details.',
    icon: User,
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-500',
    textColor: 'text-sky-500',
    borderColor: 'border-sky-500/20',
    subModules: [
      { id: 'build-portfolio', label: 'Build Portfolio', icon: User, fields: [
        { name: 'name', label: 'Full Name', placeholder: 'Shivam Maurya', type: 'text' },
        { name: 'title', label: 'Title / Role', placeholder: 'Aspiring AI Engineer', type: 'text' },
        { name: 'skills', label: 'Key Skills', placeholder: 'Python, React, FastAPI, RAG, LLMs...', type: 'textarea' },
        { name: 'projects', label: 'Notable Projects', placeholder: 'Describe your top projects...', type: 'textarea' },
        { name: 'education', label: 'Education', placeholder: 'B.Tech AI/ML, St. John College', type: 'text' },
        { name: 'contact', label: 'Contact Email', placeholder: 'shivamaurya9702@gmail.com', type: 'text' },
      ]},
    ],
  },
  {
    id: 'business',
    title: 'Business Intelligence',
    description: 'AI-driven growth strategies, competitor analysis, marketing content, and business plans.',
    icon: BarChart3,
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/20',
    subModules: [
      { id: 'growth-strategy', label: 'Growth Strategy', icon: TrendingUp, fields: [
        { name: 'business_type', label: 'Business Type', placeholder: 'e.g., SaaS, E-commerce', type: 'text' },
        { name: 'current_stage', label: 'Current Stage', type: 'select', options: ['Idea', 'Early Stage', 'Growing', 'Established'] },
      ]},
      { id: 'competitor', label: 'Competitor Analysis', icon: Users, fields: [
        { name: 'your_business', label: 'Your Business', placeholder: 'Describe your business...', type: 'textarea' },
        { name: 'competitors', label: 'Competitor Names', placeholder: 'e.g., Competitor A, Competitor B', type: 'text' },
      ]},
      { id: 'marketing', label: 'Marketing Content', icon: Megaphone, fields: [
        { name: 'business_type', label: 'Business Type', placeholder: 'E-commerce', type: 'text' },
        { name: 'product', label: 'Product / Service', placeholder: 'AI Chatbot Service', type: 'text' },
        { name: 'audience', label: 'Target Audience', placeholder: 'Small businesses, startups', type: 'text' },
        { name: 'content_type', label: 'Content Type', type: 'select', options: ['Social Media Post', 'Email Pitch', 'Blog Outline', 'Ad Copy', 'Landing Page'] },
      ]},
      { id: 'business-plan', label: 'Business Plan', icon: ClipboardList, fields: [
        { name: 'idea', label: 'Business Idea', placeholder: 'Describe your business idea in detail...', type: 'textarea' },
        { name: 'budget', label: 'Budget Range', type: 'select', options: ['< ₹1 Lakh', '₹1-5 Lakhs', '₹5-20 Lakhs', '₹20+ Lakhs'] },
      ]},
    ],
  },
  {
    id: 'chat',
    title: 'AI Chat',
    description: 'Full-page conversational AI assistant powered by LLaMA 3.3 70B.',
    icon: MessageCircle,
    color: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-500',
    textColor: 'text-indigo-500',
    borderColor: 'border-indigo-500/20',
    subModules: [],
  },
]
