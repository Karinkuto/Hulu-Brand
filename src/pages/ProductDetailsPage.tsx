import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/currencyFormatter';
import { Container, Grid, Box, Typography, Divider } from '@mui/material';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { products } = useProductStore();
  const { addItem } = useCartStore();
  const product = products.find(p => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [selectedImage, setSelectedImage] = useState(selectedVariant?.images[0] || '');
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    if (product) {
      const similar = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      setSimilarProducts(similar);
    }
  }, [product, products]);

  if (!product) {
    return <Container><div className="py-8">Product not found</div></Container>;
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem({
        id: `${product.id}-${selectedVariant.sku}`,
        name: product.name,
        price: calculateDiscountedPrice(selectedVariant),
        quantity: 1,
        imageUrl: selectedVariant.images[0] || product.coverImage,
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout'); // Assuming you have a checkout page
  };

  const calculateDiscountedPrice = (variant) => {
    if (variant.discount) {
      return variant.discountType === 'percentage'
        ? variant.price * (1 - variant.discount / 100)
        : variant.price - variant.discount;
    }
    return variant.price;
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to products
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-lg"
              style={{ aspectRatio: '1 / 1' }}
            />
            <Box mt={2} display="flex" gap={2} overflow="auto">
              {selectedVariant?.images?.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`Variant ${index + 1}`} 
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>{product.name}</Typography>
            <Typography variant="body1" paragraph>{product.description}</Typography>
            
            <Divider className="my-6" /> {/* Increased margin for better spacing */}
            
            <Typography style={{marginBlock: '1em'}} variant="h6" gutterBottom className="mt-6">Available Variants</Typography> 
            <Grid container spacing={2}>
              {product.variants.map((variant, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    className={`cursor-pointer transition-all ${selectedVariant === variant ? 'border-primary shadow-md' : 'hover:border-gray-300'}`}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setSelectedImage(variant.images[0] || product.coverImage);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Size: {variant.size}
                        </Badge>
                        <Badge variant="secondary" className="text-xs flex items-center">
                          Color: 
                          <span 
                            className="w-3 h-3 rounded-full ml-1 inline-block"
                            style={{backgroundColor: variant.color}}
                          ></span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Material: {variant.material}
                        </Badge>
                      </div>
                      <Typography variant="h6" gutterBottom>
                        {formatCurrency(calculateDiscountedPrice(variant))}
                        {variant.discount && (
                          <span className="text-red-500 line-through text-sm ml-2">
                            {formatCurrency(variant.price)}
                          </span>
                        )}
                      </Typography>
                      {variant.discount && (
                        <Badge variant="destructive" className="mb-2">
                          {variant.discountType === 'percentage'
                            ? `${variant.discount}% OFF`
                            : `${formatCurrency(variant.discount)} OFF`}
                        </Badge>
                      )}
                      <Typography variant="body2">
                        {variant.stock > 0 ? `In Stock: ${variant.stock}` : 'Out of Stock'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {selectedVariant && (
              <Box mt={4}>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={selectedVariant.stock <= 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="default"
                    size="lg"
                    className="flex-1"
                    onClick={handleBuyNow}
                    disabled={selectedVariant.stock <= 0}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
                {selectedVariant.stock <= 0 && (
                  <Typography variant="body2" color="error" className="mt-2 text-center">
                    This variant is currently out of stock
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
        </Grid>

        {similarProducts.length > 0 && (
          <Box mt={8}>
            <Typography variant="h5" gutterBottom>Similar Products</Typography>
            <Grid container spacing={3}>
              {similarProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard 
                    product={{
                      ...product,
                      image: product.coverImage,
                      variants: product.variants.map(v => ({
                        ...v,
                        images: v.images || []
                      }))
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
}