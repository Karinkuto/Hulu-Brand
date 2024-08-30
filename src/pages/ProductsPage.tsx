import React, { useState, useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { Container, Grid, Box, Pagination } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Typography } from '@mui/material';

export default function ProductsPage() {
  const { products, searchTerm, filters } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const productsPerPage = 12;

  useEffect(() => {
    const result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(p.category);
      const matchesColor = filters.colors.length === 0 || p.variants.some(v => filters.colors.includes(v.color));
      const matchesSize = filters.sizes.length === 0 || p.variants.some(v => 
        filters.sizes.includes(v.size) || 
        (filters.sizes.includes('Other') && !['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(v.size))
      );
      const matchesMaterial = filters.materials.length === 0 || p.variants.some(v => filters.materials.includes(v.material));
      const matchesPrice = p.variants.some(v => 
        (filters.priceRange[0] === null || v.price >= filters.priceRange[0]) &&
        (filters.priceRange[1] === null || v.price <= filters.priceRange[1])
      );
      return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesMaterial && matchesPrice;
    });
    setFilteredProducts(result);
    console.log('Filtered products:', result);
  }, [products, searchTerm, filters]);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Products</Typography>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredProducts.length} of {products.length} products
        </Typography>
        {filters.categories.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Filtered by: {filters.categories.join(', ')}
          </Typography>
        )}
      </Box>
      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard 
              product={{
                ...product,
                image: product.coverImage,
                variants: product.variants.map(v => ({
                  ...v,
                  images: v.images || []
                }))
              }} 
              onQuickView={handleQuickView} 
            />
          </Grid>
        ))}
      </Grid>
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
        />
      </Box>
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </Container>
  );
}