import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, BookOpen } from 'lucide-react';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function ContactSection() {
  const { ref, inView } = useInView();

  return (
    <section id="contact" ref={ref} className="py-24 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal/50" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-pomegranate/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pomegranate/20 border border-pomegranate/30 rounded-full text-pomegranate-light text-xs font-semibold uppercase tracking-wider mb-6">
            Research Contact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-12">
            Interested in the research, dataset, or collaboration opportunities? Reach out to the research team.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-5 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            {
              icon: <Mail className="w-5 h-5" />,
              label: 'Email',
              value: 'research@pomgradeai.lk',
              sub: 'Respond within 48 hours',
            },
            {
              icon: <MapPin className="w-5 h-5" />,
              label: 'Location',
              value: 'Sri Lanka',
              sub: 'University Research Lab',
            },
            {
              icon: <BookOpen className="w-5 h-5" />,
              label: 'Publication',
              value: 'Research Paper',
              sub: 'Available upon request',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-pomegranate/30 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-pomegranate/15 rounded-xl flex items-center justify-center text-pomegranate mx-auto mb-3">
                {item.icon}
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-white font-semibold text-sm">{item.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
