export const translations = {
  en: {
    title: "Shivam Nexus",
    subtitle: "AI Super Platform",
    tagline: "Your Entire Life, One AI Platform.",
    taglineSub: "Whether you are a student, professional, patient, or business owner, Shivam Nexus gives you powerful AI tools at zero cost.",
    startFree: "Start for Free",
    exploreModules: "Explore Modules",
    statsModules: "AI Modules",
    statsFeatures: "Features",
    statsLanguages: "Languages",
    statsFree: "Free Forever",
    selectLang: "Language",
    aiChat: "AI Chat",
    modules: "Modules",
    home: "Home",
    disclaimer: "Disclaimer",
    generate: "Generate Response",
    generating: "Thinking...",
    response: "AI Response",
    placeholderInput: "Type your query here...",
    healthDisclaimer: "⚠️ Medical Disclaimer: This assistant is for educational and informational purposes only. Do not use it to diagnose or treat medical conditions. Always seek professional advice from a doctor.",
    legalDisclaimer: "⚠️ Legal Disclaimer: This tool provides general guidance using AI models and is not a substitute for official legal counsel. Consult a qualified lawyer for your specific situation.",
    noKeyAlert: "Offline Mode: Enter a query to see cached or simulated response. To activate live LLaMA 3.3, add VITE_GROQ_API_KEY in .env.",
    copyBtn: "Copy to Clipboard",
    copied: "Copied!",
    aboutCreator: "Built by Shivam Maurya • Bahawalpur inspired, Mumbai engineered.",
    githubLink: "GitHub Code",
    contactUs: "Contact",
    clearHistory: "Clear History",
    send: "Send",
    selectSubmodule: "Select a tool to get started",
  },
  hi: {
    title: "शिवम नेक्सस",
    subtitle: "एआई सुपर प्लेटफॉर्म",
    tagline: "आपका संपूर्ण जीवन, एक एआई प्लेटफॉर्म।",
    taglineSub: "चाहे आप एक छात्र हों, पेशेवर हों, रोगी हों, या व्यवसाय के स्वामी हों, शिवम नेक्सस आपको शून्य लागत पर शक्तिशाली एआई उपकरण प्रदान करता है।",
    startFree: "मुफ्त में शुरू करें",
    exploreModules: "टूल्स का पता लगाएं",
    statsModules: "एआई मॉड्यूल्स",
    statsFeatures: "विशेषताएं",
    statsLanguages: "भाषाएं",
    statsFree: "हमेशा के लिए मुफ्त",
    selectLang: "भाषा",
    aiChat: "एआई चैट",
    modules: "मॉड्यूल्स",
    home: "होम",
    disclaimer: "अस्वीकरण",
    generate: "उत्तर उत्पन्न करें",
    generating: "सोच रहा है...",
    response: "एआई प्रतिक्रिया",
    placeholderInput: "अपना प्रश्न यहाँ लिखें...",
    healthDisclaimer: "⚠️ चिकित्सा अस्वीकरण: यह सहायक केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए है। इसका उपयोग चिकित्सा स्थितियों के निदान या उपचार के लिए न करें। हमेशा डॉक्टर से पेशेवर सलाह लें।",
    legalDisclaimer: "⚠️ कानूनी अस्वीकरण: यह टूल एआई मॉडल का उपयोग करके सामान्य मार्गदर्शन प्रदान करता है और आधिकारिक कानूनी सलाह का विकल्प नहीं है। अपनी विशिष्ट स्थिति के लिए एक योग्य वकील से परामर्श करें।",
    noKeyAlert: "ऑफ़लाइन मोड: उत्तर देखने के लिए एक प्रश्न दर्ज करें। लाइव चैट सक्रिय करने के लिए, .env में VITE_GROQ_API_KEY जोड़ें।",
    copyBtn: "क्लिपबोर्ड पर कॉपी करें",
    copied: "कॉपी किया गया!",
    aboutCreator: "शिवम मौर्य द्वारा निर्मित।",
    githubLink: "गिटहब कोड",
    contactUs: "संपर्क",
    clearHistory: "इतिहास साफ़ करें",
    send: "भेजें",
    selectSubmodule: "शुरू करने के लिए एक टूल चुनें",
  }
}

export const prompts = {
  student: {
    'study-guide': "You are an expert tutor. Create a detailed study guide for the Subject: {subject}, Topic: {topic}, Level: {level}. Break down key definitions, core concepts, formulas or equations if applicable, and a step-by-step learning roadmap.",
    'career-path': "You are an AI career coach. Provide a detailed, step-by-step career path for interest area: {interest}. Take into consideration the student's current education: {education}. Outline critical skills to acquire, certifications, project ideas, and potential job roles.",
    'quiz': "Create a multiple-choice quiz on the topic: {topic}. Generate {count} questions. For each question, provide 4 options (A, B, C, D) and specify the correct answer with a brief explanation.",
    'explain': "Explain the following topic simply, like I'm 5 years old: {question}. Provide real-world analogies and keep it easy to understand."
  },
  career: {
    'cv-builder': "You are a professional ATS resume writer. Format the details below into a professional, high-impact ATS-friendly resume format using Markdown. Name: {name}\nExperience: {experience}\nSkills: {skills}\nEducation: {education}",
    'cover-letter': "Write a compelling, professional cover letter for a candidate applying for the role of {job_title} at the company {company}. Use these key skills to customize the content: {skills}.",
    'job-match': "Analyze the match between this Job Description:\n{job_description}\n\nAnd these Candidate Skills/Experience:\n{your_skills}.\n\nProvide a match percentage, list missing keywords, note strengths, and offer direct advice for CV improvement.",
    'email-writer': "Write a professional job application email for the position of {job_title} at the company {company}. Keep the tone {tone}. Make it concise, engaging, and clear."
  },
  health: {
    'symptoms': "You are an AI medical symptom classifier. Evaluate these symptoms: {symptoms} for a {age}-year old {gender}. List potential causes in bullet points, rank by typical urgency, suggest general care, and emphasize when they should see a doctor. Include the mandatory medical disclaimer.",
    'medication': "Provide comprehensive, objective scientific information about the medication: {medication}. Detail typical usage, mechanism, common side effects, and warning interactions.",
    'health-qa': "Answer this general wellness/health question accurately: {question}.",
    'wellness': "Generate a comprehensive set of daily wellness practices, routines, and diet/lifestyle recommendations optimized for: {area}."
  },
  legal: {
    'country-laws': "You are an AI legal advisor. Explain the key regulations and framework governing {topic} in {country}. Use bullet points and clear, layperson language.",
    'rights': "Detail the fundamental rights, protections, and laws that apply to an individual playing the role of {role} in {country}.",
    'explain-law': "Analyze and explain the following legal question or law simply: {question}."
  },
  portfolio: {
    'build-portfolio': "You are a senior portfolio architect. Convert these raw details into a beautifully formatted Markdown Portfolio:\nName: {name}\nTitle: {title}\nSkills: {skills}\nProjects: {projects}\nEducation: {education}\nContact: {contact}. Structure it with sections: Profile, Skills, Projects, Education, Contact, and add a brief professional summary."
  },
  business: {
    'growth-strategy': "Generate a comprehensive, actionable 5-step growth strategy for a {business_type} business that is currently in the {current_stage} stage.",
    'competitor': "Perform an AI competitor analysis for this business: {your_business} against these primary competitors: {competitors}. Suggest differentiating strategies.",
    'marketing': "Create high-converting marketing content of type: {content_type} for a {business_type} offering {product} to target audience: {audience}.",
    'business-plan': "Create a comprehensive startup business plan outline for this business idea: {idea} with an initial budget of {budget}. Outline executive summary, market analysis, operations, and financial projection guidelines."
  }
}
