import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Container, Grid, Box, Typography, Divider } from "@mui/material";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const { addItem } = useCartStore();
  
  const product = products.find((p) => p.id === id);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (product?.coverImage) {
      setSelectedImage(product.coverImage);
    }
  }, [product]);

  useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectedVariant(product.variants[0]);
    } else if (product) {
      // If no variants exist, create a default variant from the product
      setSelectedVariant({
        sku: product.id,
        size: 'Default',
        stock: 1,
        price: product.basePrice,
        images: [product.coverImage]
      });
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      const price = selectedVariant?.price || product.basePrice;
      const variantSku = selectedVariant?.sku || product.id;
      
      addItem({
        id: `${product.id}-${variantSku}`,
        name: product.name,
        price: price,
        quantity: 1,
        imageUrl: selectedVariant?.images?.[0] || product.coverImage,
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <Container>
        <div className="py-8">Loading...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">Error: {error}</div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="py-8">
          <h2 className="text-xl font-semibold mb-4">Product not found</h2>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to products
          </Button>
        </div>
      </Container>
    );
  }

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to products
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={selectedImage || product.coverImage}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
              style={{ aspectRatio: "1 / 1" }}
            />
            
            {product.images && product.images.length > 0 && (
              <Box mt={2} display="flex" gap={2} overflow="auto" className="pb-2">
                <img
                  src={product.coverImage}
                  alt={`${product.name} cover`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === product.coverImage ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(product.coverImage)}
                />
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_STRAPI_MEDIA_URL}${img}`}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === `${import.meta.env.VITE_STRAPI_MEDIA_URL}${img}` 
                        ? 'border-primary' 
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(`${import.meta.env.VITE_STRAPI_MEDIA_URL}${img}`)}
                  />
                ))}
              </Box>
            )}

            {selectedVariant?.images?.length > 0 && (
              <Box mt={2} display="flex" gap={2} overflow="auto" className="pb-2">
                {selectedVariant.images.map((img, index) => (
                  <img
                    key={`variant-${index}`}
                    src={img}
                    alt={`Variant ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === img ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <div className="mb-4">
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
            </div>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider className="my-6" />

            {product.variants.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Available Variants
                </Typography>
                <Grid container spacing={2}>
                  {product.variants.map((variant, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedVariant === variant
                            ? "border-primary shadow-md"
                            : "hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {variant.size && (
                              <Badge variant="secondary">
                                Size: {variant.size}
                              </Badge>
                            )}
                            {variant.color && (
                              <Badge variant="secondary">
                                Color: {variant.color}
                              </Badge>
                            )}
                            {variant.material && (
                              <Badge variant="secondary">
                                Material: {variant.material}
                              </Badge>
                            )}
                          </div>
                          <Typography variant="h6">
                            {formatCurrency(variant.price)}
                          </Typography>
                          <Typography variant="body2">
                            {variant.stock > 0
                              ? `In Stock: ${variant.stock}`
                              : "Out of Stock"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Typography variant="h6" gutterBottom>
                Price: {formatCurrency(product.basePrice)}
              </Typography>
            )}

            <Box mt={4}>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!product}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            </Box>
          </Grid>
        </Grid>

        {similarProducts.length > 0 && (
          <Box mt={8}>
            <Typography variant="h5" gutterBottom>
              Similar Products
            </Typography>
            <Grid container spacing={3}>
              {similarProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
}
