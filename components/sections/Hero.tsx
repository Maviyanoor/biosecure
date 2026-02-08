"use client"
import { useState, useEffect } from 'react';
import { Sparkles, Play, CheckCircle, Eye, Activity, Shield, ArrowRight, Fingerprint, Heart, Brain, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const [scanStep, setScanStep] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  // Animation sequence for the live scan
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanStep(prev => (prev + 1) % 5); // 5 steps: initial, eye, micro, rppg, result
    }, 2000);

    return () => clearInterval(interval);
  }, [isScanning]);

  const scanSteps = [
    { label: 'Initializing', icon: Shield, color: 'gray', status: 'Scanning biological signals' },
    { label: 'Eye Blink', icon: Eye, color: 'cyan', status: 'Analyzing blink patterns...' },
    { label: 'Micro-Exp', icon: Activity, color: 'blue', status: 'Detecting expressions...' },
    { label: 'rPPG', icon: Heart, color: 'rose', status: 'Measuring heart rate...' },
    { label: 'Verdict', icon: Brain, color: 'emerald', status: 'Real - 98.5% confidence' },
  ];

  const currentStep = scanSteps[scanStep];

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900/95 to-slate-900 pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
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
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px] animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[200px]" />

        {/* Floating Particles */}
        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce animation-delay-500" />
        <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-pulse animation-delay-1000" />
        <div className="absolute bottom-[30%] left-[20%] w-3 h-3 bg-cyan-300/40 rounded-full animate-bounce animation-delay-1500" />
        <div className="absolute top-[60%] right-[25%] w-2 h-2 bg-blue-300/50 rounded-full animate-pulse animation-delay-2000" />
        <div className="absolute top-[40%] left-[5%] w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-bounce animation-delay-2500" />
        <div className="absolute bottom-[15%] right-[8%] w-2.5 h-2.5 bg-blue-400/40 rounded-full animate-pulse animation-delay-3000" />
        <div className="absolute top-[80%] left-[40%] w-1.5 h-1.5 bg-cyan-300/50 rounded-full animate-bounce animation-delay-1000" />
        <div className="absolute top-[10%] right-[40%] w-2 h-2 bg-blue-300/60 rounded-full animate-pulse animation-delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="mb-16 lg:mb-0">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-400/30 text-cyan-300 px-5 py-2.5 rounded-full backdrop-blur-sm mb-8 relative overflow-hidden">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">AI-Powered Deepfake Detection</span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8">
              <span className="text-white">Detect Deepfakes Using </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 animate-gradient">
                Biological Signals
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-blue-100/70 leading-relaxed max-w-xl mb-10">
              BioSecure leverages advanced AI to analyze biological signals like eye blinks, micro-expressions, and heart rate patterns to detect manipulated media with unparalleled accuracy.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/analyze"
                className="group relative bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 overflow-hidden"
              >
                <span className="relative z-10">Analyze Video</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
              <Link
                href="#demo"
                className="flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div className="relative">
                  <Play className="w-5 h-5" />
                  <div className="absolute inset-0 animate-ping opacity-30">
                    <Play className="w-5 h-5" />
                  </div>
                </div>
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4">
              {['No Login Required', '100% Private', 'Instant Results'].map((text) => (
                <div
                  key={text}
                  className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-blue-200/80 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Enhanced Analysis Card */}
          <div className="relative animate-float">
            {/* Subtle glow behind card */}
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-[2rem] blur-2xl opacity-60" />

            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-500/20 shadow-2xl shadow-blue-500/20">
              {/* Header Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-gray-400 text-sm ml-3 font-medium">BioSecure Live Scan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className={`text-xs font-medium ${isScanning ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isScanning ? 'LIVE' : 'PAUSED'}
                  </span>
                </div>
              </div>

              {/* Scan Area */}
              <div className="relative bg-slate-900/80 rounded-2xl p-8 mb-6 border border-white/5 overflow-hidden">
                {/* Animated scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />

                {/* Corner Brackets */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-lg shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-lg shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-lg shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60 rounded-br-lg shadow-[0_0_10px_rgba(34,211,238,0.3)]" />

                <div className="text-center py-6 relative">
                  {/* Rotating dashed border */}
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-2 border-dashed border-cyan-400/40 rounded-full animate-spin-slow" />
                    <div className="absolute inset-1 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                      {/* Pulsing rings */}
                      <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" />
                      <div className="absolute inset-[-8px] rounded-full border border-blue-400/10 animate-pulse" />
                      
                      {/* Dynamic icon based on scan step */}
                      <currentStep.icon className={`w-10 h-10 text-${
                        currentStep.color === 'cyan' ? 'cyan-400' : 
                        currentStep.color === 'blue' ? 'blue-400' : 
                        currentStep.color === 'rose' ? 'rose-400' : 
                        currentStep.color === 'emerald' ? 'emerald-400' : 'gray-400'
                      } relative z-10`} />
                    </div>
                  </div>
                  
                  {/* Status text */}
                  <p className="text-gray-300 text-sm mb-2">
                    {currentStep.status}
                    {scanStep < 4 && <span className="inline-flex w-6 text-left"><span className="animate-pulse">...</span></span>}
                  </p>
                  
                  {/* Step indicator */}
                  <div className="flex justify-center space-x-1">
                    {scanSteps.slice(0, 4).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx <= scanStep ? 'bg-cyan-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Confidence Level</span>
                  <span className={`font-bold text-lg ${
                    scanStep === 4 ? 'text-emerald-400' : 'text-cyan-400'
                  }`}>
                    {scanStep === 4 ? '98.5%' : `${Math.min(25 + scanStep * 20, 98)}%`}
                  </span>
                </div>
                <div className="h-3 bg-slate-700/80 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      scanStep === 4 
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300' 
                        : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300'
                    }`}
                    style={{ width: `${scanStep === 4 ? 98.5 : Math.min(25 + scanStep * 20, 98)}%` }}
                  />
                  {/* Glow under bar */}
                  <div
                    className={`absolute bottom-0 left-0 h-full rounded-full blur-sm opacity-50 ${
                      scanStep === 4 
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300' 
                        : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300'
                    }`}
                    style={{ width: `${scanStep === 4 ? 98.5 : Math.min(25 + scanStep * 20, 98)}%` }}
                  />
                </div>
              </div>

              {/* Bio Signals Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Eye Blink', value: scanStep >= 1 ? 'Normal' : '...', icon: Eye, color: scanStep >= 1 ? 'cyan' : 'gray' },
                  { label: 'Heart Rate', value: scanStep >= 3 ? '72 BPM' : '...', icon: Heart, color: scanStep >= 3 ? 'rose' : 'gray' },
                  { label: 'Micro-Exp', value: scanStep >= 2 ? 'Stable' : '...', icon: Activity, color: scanStep >= 2 ? 'blue' : 'gray' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        color === 'cyan' ? 'bg-cyan-500/20' : 
                        color === 'rose' ? 'bg-rose-500/20' : 
                        color === 'blue' ? 'bg-blue-500/20' : 'bg-gray-500/20'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${
                          color === 'cyan' ? 'text-cyan-400' : 
                          color === 'rose' ? 'text-rose-400' : 
                          color === 'blue' ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs block">{label}</span>
                    <span className={`font-semibold text-sm ${
                      color !== 'gray' ? 'text-white' : 'text-gray-500'
                    }`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Verdict Indicator */}
              {scanStep === 4 && (
                <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-white">Real Person Detected</div>
                    <div className="text-emerald-300 text-sm">High confidence in authenticity</div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-emerald-500/30 animate-bounce flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Demo Mode</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1.5">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>Bio-Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}