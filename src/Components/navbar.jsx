import React, { useState, useEffect } from 'react'
import { Typewriter } from 'react-simple-typewriter'

function Navbar({ user, data }) {
  const [showTypewriter, setShowTypewriter] = useState(true)

  useEffect(() => {
    if (user?.name) {
      const timeout = setTimeout(() => {
        setShowTypewriter(false) // remove typewriter completely
      }, user.name.length * 80 + 500) // typing speed (80) * chars + buffer

      return () => clearTimeout(timeout)
    }
  }, [user?.name])

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><a href="#about">About Me</a></li>
            {data?.Experience?.length > 0 && <li><a href="#experience">Experience</a></li>}
            <li><a href="#projects">Projects</a></li>
            <li><a href="#certifications">Certifications</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Name with Typewriter */}
        <a href="#landing" className="btn btn-ghost text-xl">
          {showTypewriter ? (
            <Typewriter
              words={[user?.name || ""]}
              typeSpeed={80}
              deleteSpeed={0}
              cursor
              cursorStyle="|"
              loop={1}
            />
          ) : (
            user?.name
          )}
        </a>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="#about">About Me</a></li>
          {data?.Experience?.length > 0 && <li><a href="#experience">Experience</a></li>}
          {data?.projects?.length > 0 && <li><a href="#projects">Projects</a></li>}
          {data?.certifications?.length > 0 && <li><a href="#certifications">Certifications</a></li>}
          {data?.education?.length > 0 && <li><a href="#education">Education</a></li>}
          {data?.skills?.length > 0 && <li><a href="#skills">Skills</a></li>}
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>

      {/* Navbar End - Theme Switcher */}
      <div className="navbar-end">
        <div className="dropdown dropdown-end relative">
          <div tabIndex={0} role="button" className="btn m-1">
            Theme
            <svg width="12px" height="12px" className="inline-block h-2 w-2 fill-current opacity-60"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content absolute bg-base-300 rounded-box z-50 w-52 p-2 shadow-2xl max-h-96 overflow-y-auto">
            {[
              "light","dark","cupcake","bumblebee","emerald","corporate","synthwave","retro","cyberpunk","valentine",
              "halloween","garden","forest","aqua","lofi","pastel","fantasy","wireframe","black","luxury","dracula",
              "cmyk","autumn","business","acid","lemonade","night","coffee","winter","dim","nord","sunset"
            ].map(theme => (
              <li key={theme}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start text-base-content"
                  aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
                  value={theme}
                  onClick={() => document.documentElement.setAttribute('data-theme', theme)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
