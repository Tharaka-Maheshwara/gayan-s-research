import { useState, useEffect } from 'react';
import { Leaf, Menu, X } from 'lucide-react';

interface NavbarProps {
  page: 'home' | 'grade';
  onNavigate: (page: 'home' | 'grade') => void;
}

export default function Navbar({ page, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#workflow' },
    { label: 'Standards', href: '#standards' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleAnchor = (href: string) => {
    setMenuOpen(false);
    if (page !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-charcoal/95 backdrop-blur-md shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-pomegranate rounded-lg flex items-center justify-center group-hover:bg-burgundy transition-colors duration-200">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm lg:text-base leading-tight">
              PomGrade<span className="text-pomegranate">AI</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href)}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 hover:text-pomegranate-light"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('grade')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                page === 'grade'
                  ? 'bg-pomegranate text-white'
                  : 'bg-pomegranate/20 text-white border border-pomegranate/40 hover:bg-pomegranate hover:border-pomegranate'
              }`}
            >
              Start Grading
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-charcoal/98 border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleAnchor(link.href)}
              className="text-white/80 hover:text-white text-sm font-medium text-left py-2 border-b border-white/5 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onNavigate('grade'); }}
            className="mt-2 w-full px-4 py-2.5 bg-pomegranate text-white rounded-lg text-sm font-semibold"
          >
            Start Grading
          </button>
        </div>
      )}
    </nav>
  );
}
