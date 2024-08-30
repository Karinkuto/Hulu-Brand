import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { Product } from '../types/product';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface FeaturedProductCarouselProps {
  products: Product[];
}

export function FeaturedProductCarousel({ products }: FeaturedProductCarouselProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.variants[0].price,
      quantity: 1,
      imageUrl: product.coverImage
    });
  };

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, EffectFade]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      effect="fade"
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      className="featured-carousel"
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <div className="relative h-[500px] rounded-lg overflow-hidden group">
            <img 
              src={product.coverImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
              <h3 className="text-white text-2xl font-semibold mb-3">{product.name}</h3>
              <p className="text-gray-200 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => handleAddToCart(product)} 
                  className="text-white dark:text-black hover:bg-opacity-80 transition-colors duration-300"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Link to={`/product/${product.id}`}>
                  <Button 
                    className="text-white dark:text-black hover:bg-opacity-80 transition-colors duration-300"
                  >
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}