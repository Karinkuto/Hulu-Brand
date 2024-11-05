<<<<<<< HEAD
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useProductStore } from "../stores/productStore";
import { Container, Grid, Box, Pagination } from "@mui/material";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { Typography } from "@mui/material";
import { fetchProducts } from "@/stores/productStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
=======
import React, { useState, useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { Container, Grid, Box, Pagination } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Typography } from '@mui/material';
import { Product } from '@/types/product'; // Make sure to import the correct Product type
>>>>>>> 79c024ba4803911fa97409be7d238505eac61268

export default function ProductsPage() {
  const { searchTerm, filters } = useProductStore();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const productsPerPage = 12;
  const [category, setCategory] = useState("Mens");

  useEffect(() => {
    fetchProducts().then((fetchedProducts) => {
      setProducts(fetchedProducts.filter((product) => product.category === category));
    });
  }, [category]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      const matchesColor =
        filters.colors.length === 0 ||
        product.variants.some((v) => filters.colors.includes(v.color));

      const matchesSize =
        filters.sizes.length === 0 ||
        product.variants.some((v) => filters.sizes.includes(v.size));

      const matchesMaterial =
        filters.materials.length === 0 ||
        product.variants.some((v) => filters.materials.includes(v.material));

      const matchesPrice =
        (filters.priceRange[0] === null ||
          product.variants.some((v) => v.price >= filters.priceRange[0])) &&
        (filters.priceRange[1] === null ||
          product.variants.some((v) => v.price <= filters.priceRange[1]));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesColor &&
        matchesSize &&
        matchesMaterial &&
        matchesPrice
      );
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
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredProducts.length} of {products.length} products
        </Typography>
      </Box>

      <Tabs defaultValue="mens" className="w-[400px] pb-4">
        <TabsList>
          <TabsTrigger onClick={() => setCategory("Mens")} value="mens">Mens</TabsTrigger>
          <TabsTrigger onClick={() => setCategory("Womens")} value="womens">Womens</TabsTrigger>
          <TabsTrigger onClick={() => setCategory("Electronics")} value="electronics">Electronics</TabsTrigger>
        </TabsList>
      </Tabs>
      <Grid container spacing={3}>
        {paginatedProducts.map((product: Product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
<<<<<<< HEAD
            <ProductCard
              product={{
                ...product,
                image: product?.coverImage,
                variants: product?.variants?.map((v) => ({
                  ...v,
                  images: v.images || [],
                })),
              }}
              onQuickView={handleQuickView}
=======
            <ProductCard 
              product={product}
              onQuickView={handleQuickView} 
>>>>>>> 79c024ba4803911fa97409be7d238505eac61268
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
