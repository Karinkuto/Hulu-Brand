// @ts-nocheck
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product'; // Add this import

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import type { Swiper as SwiperType } from 'swiper';

interface FeaturedProductCarouselProps {
  products: Product[];
}

export function FeaturedProductCarousel({ products }: FeaturedProductCarouselProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loopedProducts, setLoopedProducts] = useState<Product[]>([]);
  const { addItem } = useCartStore();
  const swiperRef = useRef<SwiperType | null>(null);

  const handleResize = useCallback(() => setIsMobile(window.innerWidth < 768), []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    setLoopedProducts([...products, ...products, ...products, ...products]);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, products]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.variants[0].price,
      quantity: 1,
      imageUrl: product.coverImage
    });
  };

  const handleSlideChange = (swiper: SwiperType) => {
    if (isMobile) {
      if (swiper.realIndex === 0 && swiper.previousIndex === products.length - 1) {
        swiper.slideTo(swiper.activeIndex + products.length, 0, false);
      } else if (swiper.realIndex === products.length - 1 && swiper.previousIndex === 0) {
        swiper.slideTo(swiper.activeIndex - products.length, 0, false);
      }
    }
  };

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  const swiperProps = isMobile ? {
    effect: 'cards',
    modules: [EffectCards, Autoplay],
    className: "w-full max-w-sm",
    loop: true,
    loopAdditionalSlides: products.length,
    cardsEffect: {
      perSlideOffset: 8,
      perSlideRotate: 2,
      rotate: true,
      slideShadows: false,
    },
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 20,
  } : {
    effect: 'fade',
    modules: [Autoplay, Navigation, Pagination, EffectFade],
    className: "featured-carousel rounded-lg overflow-hidden", // Add rounded corners here
    spaceBetween: 30,
    navigation: true,
    pagination: { clickable: true },
  };

  return (
    <div className={`relative ${isMobile ? 'px-4 py-8' : 'py-12'} w-full flex items-center justify-center`}>
      <div 
        className={`${isMobile ? 'w-full' : 'rounded-lg overflow-hidden'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Swiper
          {...swiperProps}
          grabCursor={true}
          slidesPerView={1}
          initialSlide={isMobile ? products.length : 0}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          a11y={{
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
          }}
        >
          {(isMobile ? loopedProducts : products).map((product, index) => (
            <SwiperSlide 
              key={`${product.id}-${index}`}
              className={`${isMobile ? 'bg-white dark:bg-gray-700 rounded-lg shadow-lg' : 'rounded-lg'} overflow-hidden group`}
              role="group"
              aria-roledescription="slide"
            >
              <Link to={`/product/${product.id}`} className="block w-full h-full">
                <div className={`relative ${isMobile ? 'aspect-[3/4] h-full' : 'h-[500px]'}`}>
                  <img 
                    src={product.coverImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/path/to/fallback-image.jpg';
                      e.currentTarget.alt = 'Product image not available';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  <div className={`absolute bottom-0 left-0 right-0 p-4 ${isMobile ? '' : 'transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out'}`}>
                    <h3 className="text-white text-xl md:text-2xl font-semibold mb-1 md:mb-2 truncate">{product.name}</h3>
                    <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-2 md:mb-4">{product.description}</p>
                    {/* <p className="text-white text-lg font-bold mb-2">${product?.variants[0]?.price?.toFixed(2)}</p> */}
                    {!isMobile && (
                      <div className="flex justify-between items-center">
                        <Button 
                          onClick={(e) => handleAddToCart(product, e)} 
                          className="bg-primary text-white hover:bg-primary-dark transition-colors duration-300"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                        </Button>
                        <Button 
                          className="bg-white text-primary hover:bg-gray-100 transition-colors duration-300"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
