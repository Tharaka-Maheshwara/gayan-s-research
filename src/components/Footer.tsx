import { Leaf, Github, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-pomegranate rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">PomGrade<span className="text-pomegranate">AI</span></span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              AI-powered surface husk disorder detection and export-grade classification for Sri Lankan pomegranates.
            </p>
          </div>

          {/* Standards */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Grading Standards</h4>
            <ul className="space-y-2 text-white/50 text-sm">
              <li>Codex Standard CXS 310-2013</li>
              <li>UNECE Standard FFV-64</li>
              <li>Extra Class — Premium Export</li>
              <li>Class I — Good Quality</li>
              <li>Class II — Standard Export</li>
            </ul>
          </div>

          {/* Research */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Research Info</h4>
            <ul className="space-y-2 text-white/50 text-sm">
              <li>Model: Roboflow Segmentation</li>
              <li>Dataset: ~784 annotated images</li>
              <li>Region: Sri Lanka</li>
              <li>Task: Surface Husk Disorder Detection</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#contact" className="text-white/40 hover:text-pomegranate transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/40 hover:text-pomegranate transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/40 hover:text-pomegranate transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} PomGradeAI — University Research Project. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Powered by Roboflow &bull; Supabase &bull; React
          </p>
        </div>
      </div>
    </footer>
  );
}
