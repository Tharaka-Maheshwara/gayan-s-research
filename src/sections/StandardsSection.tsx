import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

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

const grades = [
  {
    name: 'Extra Class',
    color: 'border-emerald-400',
    badge: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    description: 'Premium quality pomegranates with superior characteristics. No visible defects allowed.',
    allowed: ['Perfect shape and colour', 'No surface disorders', 'Intact husk with full bloom', 'Premium export packaging'],
    notAllowed: ['Any cracking', 'Sun scald marks', 'Surface blemishes'],
  },
  {
    name: 'Class I',
    color: 'border-amber-400',
    badge: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    description: 'Good quality pomegranates with minor permissible surface tolerances.',
    allowed: ['Good shape and colour', 'Slight shape defects', 'Minor superficial defects ≤2cm²', 'Normal firmness'],
    notAllowed: ['Deep cracks', 'Severe sun scald', 'More than 5% defect area'],
  },
  {
    name: 'Class II',
    color: 'border-rose-400',
    badge: 'bg-rose-500',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
    description: 'Pomegranates not meeting higher grades but meeting minimum requirements for export.',
    allowed: ['Acceptable shape defects', 'Surface defects ≤4cm²', 'Visible husk marks', 'Slight colour irregularities'],
    notAllowed: ['Severe cracking or splitting', 'Rot or mould', 'Insect damage'],
  },
];

export default function StandardsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="standards" ref={ref} className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pomegranate/10 border border-pomegranate/20 rounded-full text-pomegranate text-xs font-semibold uppercase tracking-wider mb-4">
            Export Standards
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-4">
            Grading Based on International Standards
          </h2>
          <p className="text-charcoal/60 max-w-2xl mx-auto">
            The AI model grades pomegranates following the Codex Standard CXS 310-2013 and UNECE FFV-64 for pomegranates — the globally recognised frameworks for export quality classification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {grades.map((grade, i) => (
            <div
              key={grade.name}
              className={`bg-white rounded-2xl border-2 ${grade.color} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className={`${grade.bgColor} px-6 py-5 border-b border-charcoal/8`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-0.5 ${grade.badge} text-white text-xs font-bold rounded-full uppercase tracking-wide`}>
                    {grade.name}
                  </span>
                </div>
                <p className={`text-sm ${grade.textColor} font-medium`}>{grade.description}</p>
              </div>
              <div className="px-6 py-5">
                <div className="mb-4">
                  <p className="text-charcoal/50 text-xs uppercase tracking-wider font-semibold mb-2">Permitted</p>
                  <ul className="space-y-1.5">
                    {grade.allowed.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-charcoal/70">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-charcoal/50 text-xs uppercase tracking-wider font-semibold mb-2">Not Permitted</p>
                  <ul className="space-y-1.5">
                    {grade.notAllowed.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-charcoal/70">
                        <XCircle className="w-3.5 h-3.5 mt-0.5 text-rose-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-8 text-center text-charcoal/40 text-xs transition-all duration-700 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          References: Codex Standard for Pomegranates CXS 310-2013 &bull; UNECE Standard FFV-64 for Pomegranates
        </div>
      </div>
    </section>
  );
}
