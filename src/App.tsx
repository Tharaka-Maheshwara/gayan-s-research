import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GradingPage from './pages/GradingPage';

type Page = 'home' | 'grade';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {page === 'home' && <Navbar page={page} onNavigate={navigate} />}
      <div className="flex-1">
        {page === 'home' ? (
          <HomePage onNavigate={navigate} />
        ) : (
          <GradingPage onNavigate={navigate} />
        )}
      </div>
      {page === 'home' && <Footer />}
    </div>
  );
}