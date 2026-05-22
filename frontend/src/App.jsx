import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ChatBot from './components/common/ChatBot'
import Home from './pages/Home'
import ModulePage from './pages/ModulePage'
import ChatPage from './pages/ChatPage'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import AgentWorkflow from './pages/AgentWorkflow'
import JobSearch from './pages/JobSearch'
import Dashboard from './pages/Dashboard'
import AdminAnalytics from './pages/AdminAnalytics'

export default function App() {
  const [lang, setLang] = useState('en')

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-[#080710] text-slate-800 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f0f19',
                color: '#f8fafc',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
              },
            }}
          />
          
          <div>
            <Navbar lang={lang} setLang={setLang} />
            <main>
              <Routes>
                <Route path="/" element={<Home lang={lang} />} />
                <Route path="/module/:id" element={<ModulePage lang={lang} />} />
                <Route path="/chat" element={<ChatPage lang={lang} />} />
                <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
                <Route path="/agent-workflow" element={<AgentWorkflow />} />
                <Route path="/job-search" element={<JobSearch />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
              </Routes>
            </main>
          </div>

          <Footer lang={lang} />
          <ChatBot lang={lang} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
