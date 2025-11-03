import React, { useState, useEffect } from 'react';

interface Quote {
  id: string;
  text: string;
  author: string;
  role: string;
}

interface QuoteSliderSimpleProps {
  quotes: Quote[];
  className?: string;
}

const QuoteSliderSimple: React.FC<QuoteSliderSimpleProps> = ({
  quotes,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeQuote = (newIndex: number) => {
    if (newIndex === currentIndex || isTransitioning) return;

    setIsTransitioning(true);

    // Wait for fade out to complete, then change content and fade in
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Small delay to ensure content is updated
    }, 300); // Half of the transition duration
  };

  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % quotes.length;
      changeQuote(nextIndex);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, quotes.length]);

  if (!quotes || quotes.length === 0) {
    return null;
  }

  const currentQuote = quotes[currentIndex];

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="flex flex-col justify-center items-start h-full w-full px-6 py-4">
        {/* Quote Icon */}
        <div className="mb-4 flex-shrink-0">
          <svg
            className="w-10 h-10 text-blue-600 transition-all duration-300 hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
          </svg>
        </div>

        {/* Quote Content with Enhanced Fade Animation */}
        <div
          className={`quote-fade-transition ${
            isTransitioning ? 'quote-fade-out' : 'quote-fade-in'
          }`}
        >
          {/* Quote Text */}
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed mb-6 max-w-2xl">
            {currentQuote.text}
          </blockquote>

          {/* Author Info */}
          <div className="flex flex-col space-y-1">
            <cite className="text-lg font-semibold text-gray-900 not-italic">
              {currentQuote.author}
            </cite>
            <span className="text-sm font-medium text-gray-600">
              {currentQuote.role}
            </span>
          </div>
        </div>

        {/* Pagination Dots */}
        {quotes.length > 1 && (
          <div className="flex space-x-2 mt-6">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => changeQuote(index)}
                disabled={isTransitioning}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                } ${isTransitioning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteSliderSimple;
