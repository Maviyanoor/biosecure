import { Eye, Brain, Activity, FileText, Upload, MessageCircle, Sparkles, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: 'Eye Blink Analysis',
    description: 'Tracks natural eye blink patterns to identify anomalies commonly found in deepfake videos.',
  },
  {
    icon: Brain,
    title: 'Micro-Expressions',
    description: 'Detects subtle facial micro-expressions that are nearly impossible to replicate in synthetic media.',
  },
  {
    icon: Activity,
    title: 'Heart Rate Detection',
    description: 'Analyzes remote photoplethysmography signals to detect biological heart rate patterns in video.',
  },
  {
    icon: FileText,
    title: 'Explainable Results',
    description: 'Provides detailed, transparent explanations of detection results so you understand the analysis.',
  },
  {
    icon: Upload,
    title: 'Multiple Input Types',
    description: 'Supports video uploads, image files, and URL inputs for flexible and convenient analysis.',
  },
  {
    icon: MessageCircle,
    title: 'AI Chatbot',
    description: 'Ask questions about deepfake detection and get instant, intelligent answers from our AI assistant.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-100/30 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-medium">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Powerful Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-6">
            Why Choose BioSecure?
          </h2>
          <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
            Our advanced biological signal analysis provides the most reliable deepfake detection available today.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative bg-slate-50 rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 overflow-hidden"
            >
              {/* Gradient blob on hover */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Icon */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mt-6">{title}</h3>

              {/* Description */}
              <p className="text-gray-600 mt-3 leading-relaxed">{description}</p>

              {/* Learn more link */}
              <div className="flex items-center text-blue-600 font-medium mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span className="text-sm">Learn more</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
