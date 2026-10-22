import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xl border border-stone-800 dark:border-stone-200 hover:-translate-y-0.5 transition-transform cursor-pointer"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
