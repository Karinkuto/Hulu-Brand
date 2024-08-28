import React, { useState, useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Container, Grid, Box, Pagination } from '@mui/material';
import { QuickViewModal } from '@/components/QuickViewModal';
import { ProductCard } from '@/components/ProductCard';

export default function ProductsPage() {
  const { products } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState('');
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const productsPerPage = 12;

  const categories = Array.from(new Set(products.map(p => p.category)));

  useEffect(() => {
    let result = products;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Apply price range filter
    result = result.filter(p => {
      const price = p.variants[0].price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.variants[0].price - b.variants[0].price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, priceRange, sortOption]);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'Price not available' : `$${numPrice.toFixed(2)}`;
  };

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  return (
    <Container>
      <Box my={4}>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Box my={4} display="flex" justifyContent="space-between">
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </Select>
      </Box>
      <Box my={4}>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
        />
      </Box>
      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} onQuickView={handleQuickView} />
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