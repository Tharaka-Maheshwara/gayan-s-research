import { useState, useCallback, useRef } from 'react';
import { Upload, X, Zap, ChevronLeft, RotateCcw, History, Download } from 'lucide-react';
import { analyzeImage, GradeResult, GRADE_INFO } from '../lib/analyzeImage';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { savePrediction, fetchHistory, PredictionRecord } from '../lib/supabase';
import ResultCard from '../components/ResultCard';
import HistoryPanel from '../components/HistoryPanel';

interface GradingPageProps {
  onNavigate: (page: 'home' | 'grade') => void;
}

type Stage = 'upload' | 'analyzing' | 'result';

type DrawTextOptions = {
  x: number;
  y: number;
  maxWidth: number;
  size: number;
  lineHeight: number;
  font: Awaited<ReturnType<PDFDocument['embedFont']>>;
  color: ReturnType<typeof rgb>;
};

function drawWrappedText(
  page: any,
  text: string,
  options: DrawTextOptions,
) {
  const { x, y, maxWidth, size, lineHeight, font, color } = options;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);

  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * lineHeight,
      size,
      font,
      color,
    });
  });

  return y - lines.length * lineHeight;
}

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

  const downloadResult = async () => {
    if (!result) return;
    const info = GRADE_INFO[result.grade] || GRADE_INFO['Undetected'];

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const ink = rgb(0.13, 0.15, 0.18);
    const muted = rgb(0.38, 0.42, 0.46);
    const lightInk = rgb(0.27, 0.3, 0.34);
    const accent = rgb(0.68, 0.15, 0.19);
    const accentSoft = rgb(0.97, 0.92, 0.92);
    const panel = rgb(0.98, 0.99, 1);
    const border = rgb(0.86, 0.88, 0.9);

    const margin = 42;
    const contentWidth = width - margin * 2;
    const bodyTop = height - 128;
    const leftWidth = 300;
    const rightX = margin + leftWidth + 18;
    const rightWidth = contentWidth - leftWidth - 18;

    page.drawRectangle({
      x: 0,
      y: height - 112,
      width,
      height: 112,
      color: ink,
    });

    page.drawRectangle({
      x: 0,
      y: height - 112,
      width,
      height: 7,
      color: accent,
    });

    page.drawText('PomGradeAI', {
      x: margin,
      y: height - 48,
      size: 21,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('Export Grade Report', {
      x: margin,
      y: height - 72,
      size: 13,
      font: fontRegular,
      color: rgb(0.88, 0.9, 0.92),
    });

    page.drawText(`Generated ${new Date(result.timestamp).toLocaleString()}`, {
      x: margin,
      y: height - 90,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.75, 0.78, 0.81),
    });

    page.drawRectangle({
      x: width - margin - 150,
      y: height - 82,
      width: 150,
      height: 36,
      color: accent,
    });

    page.drawText(result.grade.toUpperCase(), {
      x: width - margin - 138,
      y: height - 59,
      size: 12,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('Confidence Rated', {
      x: width - margin - 138,
      y: height - 72,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.94, 0.88, 0.88),
    });

    const cardTop = bodyTop - 18;
    const cardHeight = 56;
    const gap = 10;
    const cardWidth = (contentWidth - gap * 2) / 3;
    const cards = [
      { label: 'Confidence', value: `${result.confidence}%` },
      { label: 'Response', value: `${result.responseTime ?? '-'}s` },
    ];

    cards.forEach((card, index) => {
      const x = margin + index * (cardWidth + gap);
      page.drawRectangle({
        x,
        y: cardTop - cardHeight,
        width: cardWidth,
        height: cardHeight,
        color: index === 1 ? accentSoft : panel,
        borderColor: border,
        borderWidth: 1,
      });
      page.drawText(card.label, {
        x: x + 12,
        y: cardTop - 18,
        size: 8.5,
        font: fontRegular,
        color: muted,
      });
      page.drawText(card.value, {
        x: x + 12,
        y: cardTop - 36,
        size: 12,
        font: fontBold,
        color: index === 1 ? accent : ink,
        maxWidth: cardWidth - 24,
      });
    });

    const sectionTop = cardTop - cardHeight - 26;

    page.drawText('Report Overview', {
      x: margin,
      y: sectionTop,
      size: 13,
      font: fontBold,
      color: ink,
    });

    const textMaxWidth = leftWidth;
    let y = sectionTop - 22;
    y = drawWrappedText(page, `File: ${result.fileName}`, {
      x: margin,
      y,
      maxWidth: textMaxWidth,
      size: 10.5,
      lineHeight: 14,
      font: fontRegular,
      color: lightInk,
    });
    y -= 6;
    y = drawWrappedText(page, `Timestamp: ${new Date(result.timestamp).toLocaleString()}`, {
      x: margin,
      y,
      maxWidth: textMaxWidth,
      size: 10.5,
      lineHeight: 14,
      font: fontRegular,
      color: lightInk,
    });
    y -= 6;
    y = drawWrappedText(page, `Grade: ${result.grade}`, {
      x: margin,
      y,
      maxWidth: textMaxWidth,
      size: 10.5,
      lineHeight: 14,
      font: fontRegular,
      color: lightInk,
    });
    y -= 6;
    y = drawWrappedText(page, `Confidence: ${result.confidence}%`, {
      x: margin,
      y,
      maxWidth: textMaxWidth,
      size: 10.5,
      lineHeight: 14,
      font: fontRegular,
      color: lightInk,
    });
    y -= 6;
    y = drawWrappedText(page, `Response time: ${result.responseTime ?? '-'}s`, {
      x: margin,
      y,
      maxWidth: textMaxWidth,
      size: 10.5,
      lineHeight: 14,
      font: fontRegular,
      color: lightInk,
    });

    page.drawText('Classification Notes', {
      x: margin,
      y: y - 28,
      size: 13,
      font: fontBold,
      color: ink,
    });

    const descY = y - 50;
    const descWidth = leftWidth;
    drawWrappedText(page, info.description, {
      x: margin,
      y: descY,
      maxWidth: descWidth,
      size: 10.5,
      lineHeight: 14,
      font: fontRegular,
      color: lightInk,
    });

    page.drawRectangle({
      x: rightX,
      y: 392,
      width: rightWidth,
      height: 180,
      color: panel,
      borderColor: border,
      borderWidth: 1,
    });

    page.drawText('Source Image', {
      x: rightX + 12,
      y: 552,
      size: 12,
      font: fontBold,
      color: ink,
    });

    // If preview image exists, embed it in the framed panel on the right
    if (preview) {
      const match = preview.match(/^data:(image\/(png|jpeg|jpg));base64,(.*)$/);
      if (match) {
        const mime = match[1];
        const b64 = match[3];
        const imgBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        try {
          let embeddedImage: any;
          if (mime.includes('png')) {
            embeddedImage = await pdfDoc.embedPng(imgBytes);
          } else {
            embeddedImage = await pdfDoc.embedJpg(imgBytes);
          }
          const frameX = rightX + 12;
          const frameY = 406;
          const frameW = rightWidth - 24;
          const frameH = 132;
          const imgW = embeddedImage.width;
          const imgH = embeddedImage.height;
          const scale = Math.min(frameW / imgW, frameH / imgH, 1);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const imgX = frameX + (frameW - drawW) / 2;
          const imgY = frameY + (frameH - drawH) / 2;
          page.drawImage(embeddedImage, { x: imgX, y: imgY, width: drawW, height: drawH });
        } catch {
          page.drawText('Preview image could not be embedded.', {
            x: rightX + 12,
            y: 444,
            size: 9,
            font: fontRegular,
            color: muted,
          });
        }
      }
    } else {
      page.drawText('No image preview available.', {
        x: rightX + 12,
        y: 444,
        size: 9,
        font: fontRegular,
        color: muted,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomgrade-${result.grade.replace(/\s/g, '-')}-${Date.now()}.pdf`;
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
