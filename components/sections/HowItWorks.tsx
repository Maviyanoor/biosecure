import { Upload, Cpu, BarChart3, Zap } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: Upload,
    title: 'Upload Media',
    description: 'Upload your video, image, or paste a URL. We support all major media formats.',
  },
  {
    number: '2',
    icon: Cpu,
    title: 'AI Analysis',
    description: 'Our AI analyzes biological signals including eye blinks, micro-expressions, and heart rate.',
  },
  {
    number: '3',
    icon: BarChart3,
    title: 'Get Results',
    description: 'Receive a detailed report with confidence scores, signal breakdowns, and explanations.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-medium">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Simple Process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-6">
            How BioSecure Works
          </h2>
          <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
            Detect deepfakes in three simple steps with our powerful AI analysis pipeline.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-32 left-[20%] right-[20%] h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full blur-sm opacity-50" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="relative">
                <div className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 text-center">
                  {/* Step Number */}
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20 relative z-10">
                    {number}
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mt-8 group-hover:bg-blue-100 transition-colors duration-300">
                    <Icon className="w-10 h-10 text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mt-6">{title}</h3>
                  <p className="text-gray-600 mt-3 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
