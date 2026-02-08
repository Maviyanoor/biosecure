import Header from "@/components/layout/Header"
import Hero from "@/components/sections/Hero"
import Stats from "@/components/sections/Stats"
import Features from "@/components/sections/Features"
import HowItWorks from "@/components/sections/HowItWorks"
import CTA from "@/components/sections/CTA"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  )
}
