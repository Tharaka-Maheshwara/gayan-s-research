import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Zap, Shield, Award } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: 'home' | 'grade') => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [visible, setVisible] = useState(false);
  const orbs = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!orbs.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orbs.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background image — increased opacity so pomegranate is visible */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('https://i.pinimg.com/736x/59/e9/05/59e9051d3ac52b5d5e758c7cc4063325.jpg')" }}
      />

      {/* Gradient overlays — reduced so image shows through */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal" />
      <div className="absolute inset-0 bg-gradient-to-r from-pomegranate/10 via-transparent to-burgundy/10" />

      {/* Animated orbs */}
      <div ref={orbs} className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-pomegranate/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-burgundy/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-accent/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pomegranate/20 border border-pomegranate/30 text-pomegranate-light text-xs font-semibold uppercase tracking-widest mb-8 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Zap className="w-3 h-3" />
          Machine Vision &bull; Sri Lanka
        </div>

        {/* Heading */}
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6 transition-all duration-700 delay-100 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          AI-Powered{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pomegranate to-burgundy">
            Pomegranate
          </span>
          <br />
          Export Grading System
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg sm:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-10 transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Real-time surface husk disorder detection for Sri Lankan pomegranates using deep learning and computer vision - automatically grading fruit to international export standards.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={() => onNavigate('grade')}
            className="group px-8 py-4 bg-gradient-to-r from-pomegranate to-burgundy text-white font-bold rounded-xl text-base shadow-lg shadow-pomegranate/30 hover:shadow-pomegranate/50 hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Zap className="w-5 h-5 group-hover:animate-bounce" />
            Start Grading Now
          </button>
          <button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl text-base border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 flex items-center gap-2"
          >
            Learn More
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Feature pills */}
        <div
          className={`flex flex-wrap justify-center gap-3 transition-all duration-700 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            { icon: <Award className="w-3.5 h-3.5" />, text: 'Codex CXS 310-2013' },
            { icon: <Shield className="w-3.5 h-3.5" />, text: 'UNECE FFV-64 Standard' },
            { icon: <Zap className="w-3.5 h-3.5" />, text: '784+ Training Images' },
          ].map((pill) => (
            <div
              key={pill.text}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs"
            >
              <span className="text-pomegranate">{pill.icon}</span>
              {pill.text}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}