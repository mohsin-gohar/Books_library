import React, { useState } from 'react';

interface BookCoverProps {
  coverImage?: string;
  title: string;
  author: string;
  category: string;
  className?: string;
  aspectRatio?: '3:4' | '1:1';
}

export const BookCover: React.FC<BookCoverProps> = ({
  coverImage,
  title,
  author,
  category,
  className = '',
  aspectRatio = '3:4'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const hasValidImage = Boolean(coverImage && !imageError);

  // Distinctive luxury physical clothbound palette by category
  const getClothboundStyle = () => {
    switch (category) {
      case 'Architecture & Design':
        return {
          bg: 'bg-[#181b20]',
          text: 'text-stone-100',
          foil: 'text-stone-300 border-stone-400/40',
          motif: 'arch',
          label: 'ARCHITECTURA'
        };
      case 'Philosophy':
        return {
          bg: 'bg-[#1a1412]',
          text: 'text-amber-100',
          foil: 'text-amber-300 border-amber-500/40',
          motif: 'celestial',
          label: 'PHILOSOPHIA'
        };
      case 'Science & Technology':
        return {
          bg: 'bg-[#0d1527]',
          text: 'text-sky-100',
          foil: 'text-sky-300 border-sky-400/40',
          motif: 'constellation',
          label: 'SCIENTIA'
        };
      case 'Literary Fiction':
        return {
          bg: 'bg-[#0e2324]',
          text: 'text-teal-100',
          foil: 'text-teal-300 border-teal-400/40',
          motif: 'waves',
          label: 'LITTERATURA'
        };
      case 'History & Civilization':
        return {
          bg: 'bg-[#260f14]',
          text: 'text-amber-100',
          foil: 'text-amber-300 border-yellow-500/40',
          motif: 'seal',
          label: 'HISTORIA'
        };
      case 'Psychology & Mind':
        return {
          bg: 'bg-[#1e1226]',
          text: 'text-purple-100',
          foil: 'text-purple-300 border-purple-400/40',
          motif: 'spiral',
          label: 'PSYCHOLOGIA'
        };
      case 'Essays & Art':
      default:
        return {
          bg: 'bg-[#1f1b18]',
          text: 'text-amber-50',
          foil: 'text-stone-200 border-amber-200/40',
          motif: 'frame',
          label: 'ARTES & CRITICA'
        };
    }
  };

  const style = getClothboundStyle();

  return (
    <div
      className={`relative overflow-hidden rounded-xs transition-all duration-300 select-none book-spine-depth group-hover:shadow-2xl ${
        aspectRatio === '3:4' ? 'aspect-[3/4]' : 'aspect-square'
      } ${className}`}
    >
      {/* 3D Book spine shadow and creasing line on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-20 pointer-events-none" />
      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/15 dark:bg-black/30 z-20 pointer-events-none" />

      {/* Subtle top & right edge bevel highlighting */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/20 z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-black/20 z-20 pointer-events-none" />

      {hasValidImage ? (
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 animate-pulse flex items-center justify-center">
              <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">Loading...</span>
            </div>
          )}
          <img
            src={coverImage}
            alt={`Book cover of ${title} by ${author}`}
            referrerPolicy="no-referrer"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth <= 1 || img.naturalHeight <= 1) {
                // OpenLibrary returns 1x1 blank gif when image not found
                setImageError(true);
              } else {
                setImageLoaded(true);
              }
            }}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover select-none transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        </>
      ) : (
        /* Bespoke Folio Clothbound Edition Container */
        <div
          className={`w-full h-full flex flex-col justify-between p-4 sm:p-5 ${style.bg} ${style.text} relative overflow-hidden`}
        >
          {/* Tactile linen / buckram paper weave grain overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0f_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />

          {/* Blind-embossed double decorative border frame */}
          <div className="absolute inset-2.5 sm:inset-3 border border-current opacity-25 pointer-events-none rounded-2xs" />
          <div className="absolute inset-3.5 sm:inset-4 border border-current opacity-15 pointer-events-none rounded-2xs" />

          {/* Top Series / Archive Stamp */}
          <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-mono opacity-75 font-semibold">
            <span>ATHENAEUM</span>
            <span className="truncate max-w-[120px]">{style.label}</span>
          </div>

          {/* Center Debossed Foil Emblem Motif */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
            {style.motif === 'arch' && (
              <div className="w-12 h-16 sm:w-14 sm:h-18 border border-current opacity-60 rounded-t-full flex items-center justify-center relative">
                <div className="w-7 h-11 sm:w-8 sm:h-12 border-t border-l border-current opacity-80 rounded-t-full" />
                <div className="w-2 h-2 rounded-full bg-current opacity-70 absolute bottom-3" />
              </div>
            )}
            {style.motif === 'celestial' && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-current opacity-60 flex items-center justify-center relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-dashed border-current opacity-70" />
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-current opacity-80" />
              </div>
            )}
            {style.motif === 'constellation' && (
              <div className="w-14 h-12 sm:w-16 sm:h-14 relative opacity-70">
                <div className="w-2 h-2 rounded-full bg-current absolute top-1 left-2" />
                <div className="w-2 h-2 rounded-full bg-current absolute top-6 right-3" />
                <div className="w-1.5 h-1.5 rounded-full bg-current absolute bottom-2 left-6" />
                <div className="absolute inset-0 border border-current opacity-50 transform rotate-45 scale-75" />
              </div>
            )}
            {style.motif === 'waves' && (
              <div className="space-y-1.5 w-12 sm:w-14 opacity-65">
                <div className="h-0.5 w-full bg-current rounded-full" />
                <div className="h-0.5 w-4/5 mx-auto bg-current rounded-full" />
                <div className="h-0.5 w-3/5 mx-auto bg-current rounded-full" />
              </div>
            )}
            {style.motif === 'seal' && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-current opacity-60 flex items-center justify-center rotate-45">
                <div className="w-7 h-7 sm:w-8 sm:h-8 border border-current opacity-80" />
              </div>
            )}
            {style.motif === 'spiral' && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-current opacity-55 flex items-center justify-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-t border-r border-current opacity-90 rotate-45" />
              </div>
            )}
            {style.motif === 'frame' && (
              <div className="w-12 h-14 sm:w-14 sm:h-16 border border-current opacity-60 flex items-center justify-center">
                <div className="w-7 h-9 sm:w-8 sm:h-10 border border-current opacity-80" />
              </div>
            )}
          </div>

          {/* Bottom Title & Author in Classical Serif Typography */}
          <div className="relative z-10 space-y-1.5 pt-2 text-center px-1">
            <h4 className="font-serif text-sm sm:text-base font-bold leading-snug line-clamp-2">
              {title}
            </h4>
            <div className="w-6 h-px bg-current opacity-40 mx-auto" />
            <p className="text-[10px] sm:text-[11px] opacity-80 uppercase tracking-widest font-sans truncate">
              {author}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
