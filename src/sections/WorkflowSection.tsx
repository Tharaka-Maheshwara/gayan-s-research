import { useEffect, useRef, useState } from 'react';
import { Upload, Cpu, BarChart3, Award } from 'lucide-react';

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

const steps = [
  {
    num: '01',
    icon: <Upload className="w-6 h-6" />,
    title: 'Upload Image',
    desc: 'Upload a pomegranate image via drag-and-drop or file browser. The system accepts JPG, PNG, and WebP formats.',
  },
  {
    num: '02',
    icon: <Cpu className="w-6 h-6" />,
    title: 'AI Analysis',
    desc: 'The Roboflow segmentation model analyses the image for surface husk disorders — cracking, sun scald, and defects.',
  },
  {
    num: '03',
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Grade Calculation',
    desc: 'Detection results are mapped to international export grade standards with a confidence score.',
  },
  {
    num: '04',
    icon: <Award className="w-6 h-6" />,
    title: 'Export Report',
    desc: 'Receive the predicted grade (Extra Class, Class I, or Class II) with a full breakdown and confidence percentage.',
  },
];

interface WorkflowSectionProps {
  onNavigate: (page: 'home' | 'grade') => void;
}

export default function WorkflowSection({ onNavigate }: WorkflowSectionProps) {
  const { ref, inView } = useInView();

  return (
    <section id="workflow" ref={ref} className="py-24 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pomegranate/5 to-burgundy/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pomegranate/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pomegranate/20 border border-pomegranate/30 rounded-full text-pomegranate-light text-xs font-semibold uppercase tracking-wider mb-4">
            AI Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            How the Grading Works
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            From raw pomegranate image to export-grade classification in seconds — powered by Roboflow instance segmentation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/8 hover:border-pomegranate/30 transition-all duration-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-1 text-5xl font-extrabold text-pomegranate/10 leading-none select-none">
                {step.num}
              </div>
              <div className="w-12 h-12 bg-pomegranate/15 border border-pomegranate/20 rounded-xl flex items-center justify-center text-pomegranate-light mb-4">
                {step.icon}
              </div>
              <h3 className="text-white font-bold mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>

              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-white/20 text-lg font-bold z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`text-center transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => onNavigate('grade')}
            className="px-8 py-4 bg-gradient-to-r from-pomegranate to-burgundy text-white font-bold rounded-xl shadow-lg shadow-pomegranate/30 hover:shadow-pomegranate/50 hover:scale-105 transition-all duration-200"
          >
            Try the Grading System
          </button>
        </div>
      </div>
    </section>
  );
}
