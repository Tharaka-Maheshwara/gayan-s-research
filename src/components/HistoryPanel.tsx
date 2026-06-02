import { useState } from 'react';
import { X, Clock, Award, TrendingUp, Info, CheckCircle2, ArrowLeft } from 'lucide-react';
import { PredictionRecord } from '../lib/supabase';
import { GRADE_INFO } from '../lib/analyzeImage';

interface HistoryPanelProps {
  history: PredictionRecord[];
  loading: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ history, loading, onClose }: HistoryPanelProps) {
  const [selected, setSelected] = useState<PredictionRecord | null>(null);

  const gradeIndicators = (grade: string) => [
    { label: 'Extra Class', active: grade === 'Extra Class' },
    { label: 'Class I',     active: grade === 'Class I' },
    { label: 'Class II',    active: grade === 'Class II' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10">
          <div className="flex items-center gap-2">
            {selected ? (
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1.5 text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-semibold">Back</span>
              </button>
            ) : (
              <>
                <Clock className="w-4 h-4 text-charcoal/50" />
                <h3 className="font-bold text-charcoal">Prediction History</h3>
                {history.length > 0 && (
                  <span className="bg-pomegranate/10 text-pomegranate text-xs font-semibold px-2 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-charcoal/5 hover:bg-charcoal/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-charcoal/60" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* Detail View */}
          {selected ? (() => {
            const info = GRADE_INFO[selected.predicted_grade] || GRADE_INFO['Undetected'];
            const indicators = gradeIndicators(selected.predicted_grade);
            return (
              <div className="px-6 py-4 space-y-4">
                {/* Grade header */}
                <div className={`${info.bgColor} rounded-2xl px-5 py-4 border ${info.borderColor}`}>
                  <p className="text-charcoal/50 text-xs uppercase tracking-wider font-semibold mb-1">
                    Predicted Export Grade
                  </p>
                  <div className="flex items-center gap-3">
                    <h2 className={`text-2xl font-extrabold ${info.color}`}>
                      {selected.predicted_grade}
                    </h2>
                    <span className={`px-3 py-0.5 ${info.badge} text-white text-xs font-bold rounded-full uppercase`}>
                      {selected.confidence}% confidence
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className={`p-4 ${info.bgColor} rounded-2xl`}>
                  <div className="flex items-start gap-2">
                    <Info className={`w-4 h-4 shrink-0 mt-0.5 ${info.color}`} />
                    <p className={`text-sm leading-relaxed ${info.color} font-medium`}>
                      {info.description}
                    </p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-charcoal/60 text-xs font-semibold uppercase tracking-wider">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Confidence
                    </div>
                    <span className={`text-sm font-bold ${info.color}`}>{selected.confidence}%</span>
                  </div>
                  <div className="w-full bg-charcoal/8 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${info.badge} transition-all duration-1000`}
                      style={{ width: `${selected.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Grade scale */}
                <div>
                  <p className="text-charcoal/50 text-xs uppercase tracking-wider font-semibold mb-3">
                    Grade Scale
                  </p>
                  <div className="space-y-2">
                    {indicators.map((g) => (
                      <div key={g.label} className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-4 h-4 ${g.active ? info.color : 'text-charcoal/20'}`}
                        />
                        <span className={`text-sm ${g.active ? `${info.color} font-semibold` : 'text-charcoal/30'}`}>
                          {g.label}
                        </span>
                        {g.active && (
                          <span className={`ml-auto text-xs ${info.badge} text-white px-2 py-0.5 rounded-full font-semibold`}>
                            This fruit
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* File info */}
                <div className="pt-2 border-t border-charcoal/8 space-y-1">
                  <p className="text-charcoal/40 text-xs truncate">
                    <span className="font-semibold text-charcoal/50">File: </span>
                    {selected.image_name}
                  </p>
                  <p className="text-charcoal/40 text-xs">
                    <span className="font-semibold text-charcoal/50">Date: </span>
                    {selected.created_at ? new Date(selected.created_at).toLocaleString() : ''}
                  </p>
                  <p className="text-charcoal/30 text-xs">Codex CXS 310-2013 • UNECE FFV-64</p>
                </div>
              </div>
            );
          })() : (

          /* List View */
          <div className="px-6 py-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-charcoal/10 border-t-pomegranate rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-charcoal/40">
                <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No predictions yet</p>
              </div>
            ) : (
              history.map((item) => {
                const info = GRADE_INFO[item.predicted_grade] || GRADE_INFO['Undetected'];
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`w-full flex items-center gap-3 p-3 ${info.bgColor} rounded-xl border ${info.borderColor} hover:opacity-80 active:scale-[0.98] transition-all text-left`}
                  >
                    <div className={`w-8 h-8 ${info.badge} rounded-lg flex items-center justify-center shrink-0`}>
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${info.color}`}>{item.predicted_grade}</p>
                      <p className="text-charcoal/50 text-xs truncate">{item.image_name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${info.color}`}>{item.confidence}%</p>
                      <p className="text-charcoal/30 text-xs">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}