import { useState, useCallback, useRef } from 'react';
import { Upload, X, Zap, ChevronLeft, RotateCcw, History, Download } from 'lucide-react';
import { analyzeImage, GradeResult, GRADE_INFO } from '../lib/analyzeImage';
import { savePrediction, fetchHistory, PredictionRecord } from '../lib/supabase';
import ResultCard from '../components/ResultCard';
import HistoryPanel from '../components/HistoryPanel';

interface GradingPageProps {
  onNavigate: (page: 'home' | 'grade') => void;
}

type Stage = 'upload' | 'analyzing' | 'result';

export default function GradingPage({ onNavigate }: GradingPageProps) {
  const [stage, setStage] = useState<Stage>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<PredictionRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Image size must be under 10MB.');
      return;
    }
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const runAnalysis = async () => {
    if (!file) return;
    setStage('analyzing');
    setError(null);
    try {
      const res = await analyzeImage(file);
      setResult(res);
      setStage('result');
      await savePrediction({
        image_name: file.name,
        predicted_grade: res.grade,
        confidence: res.confidence,
        detection_data: res.raw,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setStage('upload');
    }
  };

  const reset = () => {
    setStage('upload');
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const openHistory = async () => {
    setShowHistory(true);
    setHistoryLoading(true);
    const data = await fetchHistory(20);
    setHistory(data as PredictionRecord[]);
    setHistoryLoading(false);
  };

  const downloadResult = () => {
    if (!result) return;
    const info = GRADE_INFO[result.grade] || GRADE_INFO['Undetected'];
    const text = [
      'PomGradeAI — Export Grade Report',
      '================================',
      `File: ${result.fileName}`,
      `Timestamp: ${new Date(result.timestamp).toLocaleString()}`,
      `Grade: ${result.grade}`,
      `Confidence: ${result.confidence}%`,
      '',
      `Description: ${info.description}`,
      '',
      'Standards: Codex CXS 310-2013 | UNECE FFV-64',
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomgrade-${result.grade.replace(/\s/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-charcoal border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-xs">AI Model Online</span>
          </div>
          <button
            onClick={openHistory}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pomegranate/10 border border-pomegranate/20 rounded-full text-pomegranate text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3 h-3" />
            AI Grading System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">
            Pomegranate Export Grade Analysis
          </h1>
          <p className="text-charcoal/55 max-w-lg mx-auto text-sm">
            Upload a pomegranate image to instantly detect surface husk disorders and receive an international export grade classification.
          </p>
        </div>

        {/* Stage: Upload */}
        {stage === 'upload' && (
          <div className="bg-white rounded-3xl border border-charcoal/10 shadow-lg overflow-hidden">
            {/* Drop zone */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => !preview && inputRef.current?.click()}
              className={`relative transition-all duration-200 ${
                preview ? 'cursor-default' : 'cursor-pointer'
              } ${dragging ? 'bg-pomegranate/5 border-pomegranate' : ''}`}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-80 object-contain bg-charcoal/5"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-3 right-3 w-8 h-8 bg-charcoal/80 hover:bg-charcoal rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-charcoal/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {file?.name}
                  </div>
                </div>
              ) : (
                <div className={`p-16 flex flex-col items-center justify-center text-center border-2 border-dashed m-6 rounded-2xl transition-all duration-200 ${
                  dragging ? 'border-pomegranate bg-pomegranate/5' : 'border-charcoal/20 hover:border-pomegranate/40 hover:bg-pomegranate/2'
                }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragging ? 'bg-pomegranate/20' : 'bg-charcoal/5'}`}>
                    <Upload className={`w-8 h-8 transition-colors ${dragging ? 'text-pomegranate' : 'text-charcoal/30'}`} />
                  </div>
                  <p className="text-charcoal font-semibold mb-1">
                    {dragging ? 'Drop your image here' : 'Drag & drop your pomegranate image'}
                  </p>
                  <p className="text-charcoal/40 text-sm mb-4">or click to browse</p>
                  <p className="text-charcoal/30 text-xs">Supports JPG, PNG, WebP &bull; Max 10MB</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
                <X className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="p-6 pt-2 flex gap-3">
              {preview ? (
                <>
                  <button
                    onClick={runAnalysis}
                    className="flex-1 py-3.5 bg-gradient-to-r from-pomegranate to-burgundy text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-pomegranate/30 hover:scale-[1.01] transition-all duration-200"
                  >
                    <Zap className="w-4 h-4" />
                    Analyze Grade
                  </button>
                  <button
                    onClick={reset}
                    className="px-4 py-3.5 bg-charcoal/5 text-charcoal/70 font-semibold rounded-xl hover:bg-charcoal/10 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex-1 py-3.5 bg-charcoal/5 text-charcoal/50 font-semibold rounded-xl border-2 border-dashed border-charcoal/15 hover:border-pomegranate/30 hover:text-charcoal/70 transition-all duration-200"
                >
                  Browse Files
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stage: Analyzing */}
        {stage === 'analyzing' && (
          <div className="bg-white rounded-3xl border border-charcoal/10 shadow-lg p-12 flex flex-col items-center justify-center text-center">
            {preview && (
              <div className="relative mb-8">
                <img
                  src={preview}
                  alt="Analyzing"
                  className="w-48 h-48 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 rounded-2xl bg-charcoal/40 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-pomegranate rounded-full animate-spin" />
                </div>
              </div>
            )}
            <div className="w-8 h-8 border-3 border-charcoal/10 border-t-pomegranate rounded-full animate-spin mb-4" />
            <h3 className="text-charcoal font-bold text-lg mb-2">Analyzing Image...</h3>
            <p className="text-charcoal/50 text-sm max-w-xs">
              Running AI segmentation model to detect surface husk disorders and calculate export grade.
            </p>
            <div className="mt-6 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-pomegranate rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stage: Result */}
        {stage === 'result' && result && (
          <div className="space-y-5">
            <ResultCard result={result} preview={preview} />
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 bg-white border border-charcoal/15 text-charcoal font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-charcoal/5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Grade Another
              </button>
              <button
                onClick={downloadResult}
                className="px-5 py-3 bg-charcoal text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-charcoal/80 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Panel */}
      {showHistory && (
        <HistoryPanel
          history={history}
          loading={historyLoading}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
