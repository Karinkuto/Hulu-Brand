import React from 'react';
import { useProductStore } from '../stores/productStore';
import { Container } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';

export default function HomePage() {
  const { featuredProducts, getTrendingProducts } = useProductStore();
  const trendingProducts = getTrendingProducts();

  return (
    <Container>
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}