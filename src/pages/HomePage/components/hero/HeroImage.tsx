import React from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ src, alt, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Clean PNG Image without background */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
          loading="eager"
        />
      </div>

      {/* Floating decorative elements */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 bg-blue-400 rounded-full opacity-60 animate-bounce"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-400 rounded-full opacity-60 animate-bounce"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute top-1/2 -right-2 w-12 h-12 bg-indigo-400 rounded-full opacity-60 animate-bounce"
        style={{ animationDelay: '2s' }}
      />
    </div>
  );
};

export default HeroImage;
