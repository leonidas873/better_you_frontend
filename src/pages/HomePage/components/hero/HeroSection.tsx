import React from 'react';
import QuoteSlider from './QuoteSlider';
import QuoteSliderSimple from './QuoteSliderSimple';
import HeroImage from './HeroImage';

interface Quote {
  id: string;
  text: string;
  author: string;
  role: string;
}

interface HeroSectionProps {
  quotes: Quote[];
  heroImage: {
    src: string;
    alt: string;
  };
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  quotes,
  heroImage,
  className = '',
}) => {
  return (
    <section
      className={`min-h-[80vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden ${className}`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260   %22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%27)]%20opacity-40" />

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200 rounded-full opacity-10 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-200 rounded-full opacity-5 animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[70vh]">
          {/* Left side - Quote Slider */}
          <div className="order-2 lg:order-1 h-[400px] lg:h-[500px]">
            <div className="animate-fade-in-left h-full">
              <QuoteSliderSimple quotes={quotes} className="h-full" />
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="order-1 lg:order-2 h-[400px] lg:h-[500px]">
            <div className="animate-fade-in-right h-full">
              <HeroImage
                src={heroImage.src}
                alt={heroImage.alt}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
