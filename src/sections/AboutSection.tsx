import { useEffect, useRef, useState } from 'react';
import { Brain, Target, FlaskConical, Leaf } from 'lucide-react';

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const objectives = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'Automated AI Detection',
    desc: 'Replace slow manual inspection with a real-time deep learning model that detects surface husk disorders with high accuracy.',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Export-Standard Grading',
    desc: 'Classify pomegranates into Extra Class, Class I, and Class II based on Codex CXS 310-2013 and UNECE FFV-64 standards.',
  },
  {
    icon: <FlaskConical className="w-5 h-5" />,
    title: 'Research-Grade Dataset',
    desc: 'Trained on ~784 annotated images collected from Sri Lankan pomegranate farms covering cracking, sun scald, and surface defects.',
  },
  {
    icon: <Leaf className="w-5 h-5" />,
    title: 'Agricultural Impact',
    desc: 'Support Sri Lankan pomegranate exporters with an objective, consistent, and scalable quality inspection solution.',
  },
];

export default function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section id="about" ref={ref} className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pomegranate/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pomegranate/10 border border-pomegranate/20 rounded-full text-pomegranate text-xs font-semibold uppercase tracking-wider mb-6">
              About the Research
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-6 leading-tight">
              Intelligent Vision System for{' '}
              <span className="text-pomegranate">Export Quality Inspection</span>
            </h2>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              This research project develops a machine vision system to automate the detection of surface husk disorders in Sri Lankan pomegranates — replacing subjective and inconsistent manual grading methods that slow export-readiness assessments.
            </p>
            <p className="text-charcoal/70 leading-relaxed mb-6">
              The system identifies key disorders including cracking, sun scald, and surface defects, then applies internationally recognised export grading standards to provide consistent, real-time classification results.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Cracking Detection', 'Sun Scald', 'Surface Defects', 'Real-Time Grading'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-charcoal/5 border border-charcoal/10 rounded-full text-charcoal/60 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: objectives */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {objectives.map((obj, i) => (
              <div
                key={obj.title}
                className="bg-white rounded-2xl p-5 border border-charcoal/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 bg-pomegranate/10 rounded-xl flex items-center justify-center text-pomegranate mb-4">
                  {obj.icon}
                </div>
                <h3 className="font-bold text-charcoal text-sm mb-1.5">{obj.title}</h3>
                <p className="text-charcoal/55 text-xs leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
