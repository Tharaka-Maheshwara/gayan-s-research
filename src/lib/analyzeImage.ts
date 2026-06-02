const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface GradeResult {
  grade: string;
  confidence: number;
  predictions: unknown[];
  raw: unknown;
  fileName: string;
  timestamp: string;
  responseTime: number; // ← NEW: API response time in seconds
}

export async function analyzeImage(file: File): Promise<GradeResult> {
  const formData = new FormData();
  formData.append('image', file);

  const startTime = performance.now(); // ← start timer

  const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-pomegranate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: formData,
  });

  const endTime = performance.now(); // ← stop timer
  const responseTime = parseFloat(((endTime - startTime) / 1000).toFixed(2)); // convert ms → seconds

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const data = await response.json();

  return {
    ...data,
    responseTime, // ← attach to result
  };
}

export const GRADE_INFO: Record<string, { label: string; description: string; color: string; bgColor: string; borderColor: string; badge: string }> = {
  'Extra Class': {
    label: 'Extra Class',
    description: 'Premium export-quality pomegranate with minimal or no visible surface defects. Meets the highest international export standards under Codex CXS 310-2013 and UNECE FFV-64.',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
    badge: 'bg-emerald-500',
  },
  'Class I': {
    label: 'Class I',
    description: 'Good quality pomegranate with minor acceptable surface disorders. Suitable for export with slight tolerances for superficial defects permitted by international standards.',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    badge: 'bg-amber-500',
  },
  'Class II': {
    label: 'Class II',
    description: 'Lower export quality with visible husk defects or imperfections. Acceptable for trade with notable surface disorders, cracking, or sun scald within defined tolerance limits.',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-400',
    badge: 'bg-rose-500',
  },
  'Undetected': {
    label: 'Undetected',
    description: 'The AI model could not confidently detect a pomegranate or grade in the provided image. Please upload a clear, well-lit image of a single pomegranate.',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    badge: 'bg-slate-400',
  },
};