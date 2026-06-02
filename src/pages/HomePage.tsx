import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import StatsSection from '../sections/StatsSection';
import FeaturesSection from '../sections/FeaturesSection';
import WorkflowSection from '../sections/WorkflowSection';
import StandardsSection from '../sections/StandardsSection';
import ContactSection from '../sections/ContactSection';

interface HomePageProps {
  onNavigate: (page: 'home' | 'grade') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} />
      <AboutSection />
      <StatsSection />
      <FeaturesSection />
      <WorkflowSection onNavigate={onNavigate} />
      <StandardsSection />
      <ContactSection />
    </main>
  );
}
