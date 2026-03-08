"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Shield, Menu, X } from "lucide-react"

export default function Header() {

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }

  }, [])

  const links = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Stats", href: "/stats" },
    { label: "History", href: "/history" }
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100"
        : "bg-transparent"
    }`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-18 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">

            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">

              <Shield className="w-6 h-6 text-white" />

            </div>

            <span className={`text-xl font-bold ${
              scrolled ? "text-gray-900" : "text-white"
            }`}>
              BioSecure
            </span>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">

            {links.map((link) => (

              <Link
                key={link.label}
                href={link.href}
                className={`font-medium transition-colors ${
                  scrolled
                    ? "text-gray-600 hover:text-blue-600"
                    : "text-white hover:text-gray-200"
                }`}
              >
                {link.label}
              </Link>

            ))}

          </div>

          {/* Mobile Button */}
          <button
            className={`md:hidden ${
              scrolled ? "text-gray-600" : "text-white"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >

            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}

          </button>

        </div>

        {/* Mobile Menu */}
        {mobileOpen && (

          <div className="md:hidden pb-6 space-y-2">

            {links.map((link) => (

              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </Link>

            ))}

          </div>

        )}

      </div>

    </nav>
  )
}