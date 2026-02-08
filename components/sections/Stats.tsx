import { Target, Video, Clock, Activity } from 'lucide-react'

const stats = [
  { icon: Target, number: '98.5%', label: 'Detection Accuracy' },
  { icon: Video, number: '10K+', label: 'Videos Analyzed' },
  { icon: Clock, number: '<30s', label: 'Analysis Time' },
  { icon: Activity, number: '4', label: 'Bio Signals' },
]

export default function Stats() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, number, label }) => (
            <div
              key={label}
              className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden text-center"
            >
              {/* Decorative corner gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mx-auto">
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Number */}
              <div className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {number}
              </div>

              {/* Label */}
              <div className="text-gray-500 font-medium mt-2">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
