import HeroBanner from '@/components/meta10/hero-banner'
import AboutSection from '@/components/meta10/about-section'
import MaterialsSection from '@/components/meta10/materials-section'
import FreeContentSection from '@/components/meta10/free-content-section'
import PricingSection from '@/components/meta10/pricing-section'
import YouTubeSection from '@/components/meta10/youtube-section'
import TestimonialsSection from '@/components/meta10/testimonials-section'
import FinalCTA from '@/components/meta10/final-cta'

export default function Home() {
  return (
    <>
      <HeroBanner />
      <AboutSection />
      <MaterialsSection />
      <FreeContentSection />
      <PricingSection />
      <YouTubeSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  )
}
