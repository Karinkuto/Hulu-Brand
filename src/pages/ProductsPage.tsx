import React, { useState, useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { Container, Grid, Box, Pagination } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Typography } from '@mui/material';

export default function ProductsPage() {
  const { products, searchTerm } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const productsPerPage = 12;

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPage(1); // Reset to first page when search term changes
  }, [products, searchTerm]);

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