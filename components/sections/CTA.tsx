"use client"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />

      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated Gradient Orbs */}
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-500/25 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[150px] animate-pulse animation-delay-1000" />

        {/* Floating Particles */}
        <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-cyan-400/50 rounded-full animate-bounce animation-delay-500" />
        <div className="absolute bottom-[25%] right-[20%] w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-pulse animation-delay-1500" />
        <div className="absolute top-[60%] left-[70%] w-2.5 h-2.5 bg-cyan-300/40 rounded-full animate-bounce animation-delay-2000" />
        <div className="absolute top-[30%] right-[10%] w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-pulse animation-delay-1000" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
          Ready to Verify Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 animate-gradient">
            Video
          </span>
          ?
        </h2>
        <p className="text-xl text-blue-100/70 mb-12 max-w-2xl mx-auto">
          Start detecting deepfakes in seconds. No account needed, completely private, and powered by cutting-edge biological signal analysis.
        </p>
        <Link
          href="#get-started"
          className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-10 py-5 rounded-2xl text-lg font-semibold shadow-2xl shadow-blue-500/30 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Start Free Analysis</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </Link>
      </div>
    </section>
  )
}
