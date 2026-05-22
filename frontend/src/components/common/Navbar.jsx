import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { MODULES } from '../../data/modules'
import { translations } from '../../data/translations'
import { Sun, Moon, Menu, X, ChevronDown, FileText, Network, Search } from 'lucide-react'
import Logo from './Logo'

export default function Navbar({ lang, setLang }) {
  const { dark, toggle } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const t = translations[lang]

  useEffect(() => {
    setIsOpen(false)
    setDropdownOpen(false)
  }, [location])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isRtl = false

  return (
    <nav 
      className={`sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 ${
        dark ? 'glass-dark text-white' : 'glass-light text-slate-800'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-brand-500 ${
                location.pathname === '/' ? 'text-brand-500 font-semibold' : ''
              }`}
            >
              {t.home}
            </Link>

            {/* Modules Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-500"
              >
                <span>{t.modules}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className={`absolute top-full mt-2 w-64 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-slate-900 p-2 shadow-xl ${
                  isRtl ? 'left-0' : 'right-0'
                }`}>
                  <div className="grid gap-1">
                    {MODULES.map((m) => {
                      const Icon = m.icon
                      return (
                        <Link
                          key={m.id}
                          to={m.id === 'chat' ? '/chat' : m.id === 'jobs' ? '/job-search' : `/module/${m.id}`}
                          className="flex items-center gap-3 rounded-xl p-2.5 text-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr ${m.color} text-white`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{m.title}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/chat" 
              className={`text-sm font-medium transition-colors hover:text-brand-500 ${
                location.pathname === '/chat' ? 'text-brand-500 font-semibold' : ''
              }`}
            >
              {t.aiChat}
            </Link>

            <Link 
              to="/resume-analyzer" 
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-500 ${
                location.pathname === '/resume-analyzer' ? 'text-brand-500 font-semibold' : ''
              }`}
            >
              <FileText className="h-4 w-4" />
              ATS Resume
            </Link>

            <Link 
              to="/agent-workflow" 
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand-500 ${
                location.pathname === '/agent-workflow' ? 'text-brand-500 font-semibold' : ''
              }`}
            >
              <Network className="h-4 w-4" />
              Agent Workflow
            </Link>
          </div>

          {/* Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
              {['en', 'hi'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-all ${
                    lang === l
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Dark Mode */}
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10 bg-white dark:bg-slate-950 p-4 space-y-3">
          <Link to="/" className="block rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
            {t.home}
          </Link>
          <Link to="/chat" className="block rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
            {t.aiChat}
          </Link>
          <Link to="/resume-analyzer" className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
            <FileText className="h-4 w-4" />
            ATS Resume
          </Link>
          <Link to="/agent-workflow" className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
            <Network className="h-4 w-4" />
            Agent Workflow
          </Link>

          <div className="border-t border-black/10 dark:border-white/10 pt-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">{t.modules}</div>
            <div className="grid gap-1">
              {MODULES.map((m) => {
                const Icon = m.icon
                return (
                  <Link
                    key={m.id}
                    to={m.id === 'chat' ? '/chat' : m.id === 'jobs' ? '/job-search' : `/module/${m.id}`}
                    className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr ${m.color} text-white`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium">{m.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-3 flex justify-between items-center px-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.selectLang}</span>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
              {['en', 'hi'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-all ${
                    lang === l ? 'bg-brand-600 text-white' : 'text-slate-500'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
