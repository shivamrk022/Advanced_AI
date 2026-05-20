export function LogoIcon({ className = "h-8 w-8" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Outer Hexagonal Shield */}
      <path
        d="M16 2.5L27.5 9.1v13.8L16 29.5L4.5 22.9V9.1L16 2.5Z"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]"
      />
      {/* Dynamic Central Connection Grid */}
      <path
        d="M16 8L22.5 19H9.5L16 8Z"
        stroke="url(#logo-gradient)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="url(#logo-gradient)"
        fillOpacity="0.1"
      />
      {/* Active Nodes */}
      <circle cx="16" cy="8" r="2" fill="#06b6d4" />
      <circle cx="9.5" cy="19" r="1.8" fill="#6366f1" />
      <circle cx="22.5" cy="19" r="1.8" fill="#6366f1" />
      <circle cx="16" cy="14" r="2.2" fill="#ffffff" className="dark:fill-slate-900" />
      <circle cx="16" cy="14" r="1" fill="#4f46e5" />
    </svg>
  )
}

export default function Logo({ showText = true, className = "h-8 w-8" }) {
  return (
    <div className="flex items-center gap-3">
      <LogoIcon className={className} />
      {showText && (
        <span className="font-display tracking-wider text-lg uppercase select-none">
          <span className="font-extrabold text-slate-800 dark:text-white">Shivam</span>
          <span className="font-light text-brand-500 dark:text-cyan-400 ml-1.5">Nexus</span>
        </span>
      )}
    </div>
  )
}
