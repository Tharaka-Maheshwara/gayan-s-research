import { useEffect, useRef, useState } from 'react';
import { Zap, Eye, BarChart3, Shield, Upload, Download } from 'lucide-react';

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

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Detection',
    desc: 'Instant AI-powered analysis of pomegranate surface disorders using the trained Roboflow segmentation model.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Visual Disorder Recognition',
    desc: 'Identifies cracking, sun scald, and surface defects with precise segmentation overlays.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Confidence Scoring',
    desc: 'Every grade prediction includes a confidence percentage and detailed detection breakdown.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'International Standards',
    desc: 'Grading logic built on Codex CXS 310-2013 and UNECE FFV-64 export quality specifications.',
    color: 'text-pomegranate',
    bg: 'bg-rose-50',
  },
  {
    icon: <Upload className="w-6 h-6" />,
    title: 'Easy Image Upload',
    desc: 'Drag-and-drop or browse to upload any pomegranate image for instant grade analysis.',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'Prediction History',
    desc: 'All grading results are stored and accessible for review, comparison, and reporting.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
];

export default function FeaturesSection() {
  const { ref, inView } = useInView();

  return (
    <section id="features" ref={ref} className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pomegranate/10 border border-pomegranate/20 rounded-full text-pomegranate text-xs font-semibold uppercase tracking-wider mb-4">
            System Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-4">
            Powerful Features for Export Grading
          </h2>
          <p className="text-charcoal/60 max-w-2xl mx-auto">
            A complete machine vision platform built for research demonstrations, academic presentations, and real-world pomegranate export quality inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`bg-white rounded-2xl p-6 border border-charcoal/8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center ${feat.color} mb-5`}>
                {feat.icon}
              </div>
              <h3 className="font-bold text-charcoal mb-2">{feat.title}</h3>
              <p className="text-charcoal/55 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
