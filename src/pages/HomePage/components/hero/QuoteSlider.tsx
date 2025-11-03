import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles - Swiper v11+ uses new import paths
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Quote {
  id: string;
  text: string;
  author: string;
  role: string;
}

interface QuoteSliderProps {
  quotes: Quote[];
  className?: string;
}

const QuoteSlider: React.FC<QuoteSliderProps> = ({
  quotes,
  className = '',
}) => {
  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        navigation={false}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet bg-gray-300 w-3 h-3',
          bulletActiveClass: 'swiper-pagination-bullet-active bg-blue-600',
        }}
        loop={quotes.length > 1}
        className="h-full w-full"
        style={{
          height: '100%',
          width: '100%',
        }}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={false}
        allowTouchMove={true}
        watchSlidesProgress={true}
      >
        {quotes.map(quote => (
          <SwiperSlide key={quote.id} className="h-full w-full">
            <div className="flex flex-col justify-center items-start h-full w-full px-6 py-8 overflow-hidden">
              {/* Quote Icon */}
              <div className="mb-6 flex-shrink-0">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>

              {/* Quote Text */}
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed mb-8 max-w-2xl flex-grow">
                {quote.text}
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col space-y-1 flex-shrink-0">
                <cite className="text-lg font-semibold text-gray-900 not-italic">
                  {quote.author}
                </cite>
                <span className="text-sm font-medium text-gray-600">
                  {quote.role}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default QuoteSlider;
