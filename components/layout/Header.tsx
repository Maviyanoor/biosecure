"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Analyze', href: '/analyze' },
    { label: 'History', href: '/history' },
    { label: 'Stats', href: '/stats' },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              BioSecure
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative font-medium transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-cyan-400 after:rounded-full after:transition-all after:duration-300 hover:after:w-full ${
                  scrolled
                    ? 'text-gray-600 hover:text-blue-600'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/analyze"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Analyze
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden transition-colors ${scrolled ? 'text-gray-600' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className={`md:hidden pb-6 space-y-2 ${scrolled ? '' : 'bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 mt-2 border border-white/10'}`}>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`block py-2.5 px-3 rounded-lg font-medium transition-all ${
                  scrolled
                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/analyze"
              className="block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-medium mt-2 shadow-lg shadow-blue-500/25"
              onClick={() => setMobileOpen(false)}
            >
              Analyze
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
