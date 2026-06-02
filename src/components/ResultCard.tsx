import { Award, TrendingUp, Info, CheckCircle2, Clock } from "lucide-react";
import { GradeResult, GRADE_INFO } from "../lib/analyzeImage";

interface ResultCardProps {
  result: GradeResult;
  preview: string | null;
}

export default function ResultCard({ result, preview }: ResultCardProps) {
  const info = GRADE_INFO[result.grade] || GRADE_INFO["Undetected"];

  const gradeIndicators = [
    { label: "Extra Class", active: result.grade === "Extra Class" },
    { label: "Class I", active: result.grade === "Class I" },
    { label: "Class II", active: result.grade === "Class II" },
  ];

  return (
    <div
      className={`bg-white rounded-3xl border-2 ${info.borderColor} shadow-lg overflow-hidden`}
    >
      {/* Header */}
      <div className={`${info.bgColor} px-6 py-5 border-b border-charcoal/8`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-charcoal/50 text-xs uppercase tracking-wider font-semibold mb-1">
              Predicted Export Grade
            </p>
            <div className="flex items-center gap-3">
              <h2 className={`text-3xl font-extrabold ${info.color}`}>
                {result.grade}
              </h2>
              <span
                className={`px-3 py-0.5 ${info.badge} text-white text-xs font-bold rounded-full uppercase tracking-wide`}
              >
                {result.confidence > 0
                  ? `${result.confidence}% confidence`
                  : "Detected"}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <Award className={`w-6 h-6 ${info.color}`} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          {preview && (
            <div className="space-y-3">
              <p className="text-charcoal/50 text-xs uppercase tracking-wider font-semibold">
                Analyzed Image
              </p>
              <img
                src={preview}
                alt="Analyzed pomegranate"
                className="w-full rounded-2xl object-contain max-h-72 bg-charcoal/5"
              />
              <p className="text-charcoal/40 text-xs truncate">
                {result.fileName}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="space-y-5">
            {/* Description */}
            <div className={`p-4 ${info.bgColor} rounded-2xl`}>
              <div className="flex items-start gap-2">
                <Info className={`w-4 h-4 shrink-0 mt-0.5 ${info.color}`} />
                <p
                  className={`text-sm leading-relaxed ${info.color} font-medium`}
                >
                  {info.description}
                </p>
              </div>
            </div>

            {/* Confidence bar */}
            {result.confidence > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-charcoal/60 text-xs font-semibold uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Confidence
                  </div>
                  <span className={`text-sm font-bold ${info.color}`}>
                    {result.confidence}%
                  </span>
                </div>
                <div className="w-full bg-charcoal/8 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${info.badge} transition-all duration-1000`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
            )}

            {/* Response time */}
            {result.responseTime !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-charcoal/60 text-xs font-semibold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Response Time
                  </div>
                  <span className={`text-sm font-bold ${info.color}`}>
                    {result.responseTime}s
                  </span>
                </div>
                <div className="w-full bg-charcoal/8 rounded-full h-2.5">
                  {/* bar scaled: 0s = 0%, 5s = 100% — green if fast, amber if slow */}
                  <div
                    className={`h-2.5 rounded-full transition-all duration-1000 ${
                      result.responseTime < 3
                        ? "bg-emerald-400"
                        : result.responseTime < 5
                          ? "bg-amber-400"
                          : "bg-rose-400"
                    }`}
                    style={{
                      width: `${Math.min((result.responseTime / 5) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Grade scale */}
            <div>
              <p className="text-charcoal/50 text-xs uppercase tracking-wider font-semibold mb-3">
                Grade Scale
              </p>
              <div className="space-y-2">
                {gradeIndicators.map((g) => (
                  <div key={g.label} className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${g.active ? info.color : "text-charcoal/20"}`}
                    />
                    <span
                      className={`text-sm ${g.active ? `${info.color} font-semibold` : "text-charcoal/30"}`}
                    >
                      {g.label}
                    </span>
                    {g.active && (
                      <span
                        className={`ml-auto text-xs ${info.badge} text-white px-2 py-0.5 rounded-full font-semibold`}
                      >
                        This fruit
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detection count removed */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-charcoal/2 border-t border-charcoal/8 flex items-center justify-between">
        <span className="text-charcoal/30 text-xs">
          Codex CXS 310-2013 &bull; UNECE FFV-64
        </span>
        <div className="flex items-center gap-3">
          {result.responseTime !== undefined && (
            <span className="text-charcoal/30 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {result.responseTime}s
            </span>
          )}
          <span className="text-charcoal/30 text-xs">
            {new Date(result.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
