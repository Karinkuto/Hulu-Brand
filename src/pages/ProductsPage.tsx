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
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
      
      const matchesColor = filters.colors.length === 0 || product.variants.some(v => 
        filters.colors.includes(v.color)
      );
      
      const matchesSize = filters.sizes.length === 0 || product.variants.some(v => 
        filters.sizes.includes(v.size)
      );
      
      const matchesMaterial = filters.materials.length === 0 || product.variants.some(v => 
        filters.materials.includes(v.material)
      );
      
      const matchesPrice = (filters.priceRange[0] === null || product.variants.some(v => v.price >= filters.priceRange[0])) &&
        (filters.priceRange[1] === null || product.variants.some(v => v.price <= filters.priceRange[1]));

      return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesMaterial && matchesPrice;
    });
    
    setFilteredProducts(filtered);
    setPage(1); // Reset to first page when filters change
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
      </Box>

      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard 
              product={product}
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
