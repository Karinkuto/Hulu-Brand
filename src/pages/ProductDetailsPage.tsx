import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import { useReviewStore } from '../stores/reviewStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@mui/material';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewList } from '@/components/ReviewList';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductStore();
  const { getProductReviews, addReview } = useReviewStore();
  const { user } = useAuthStore();
  const product = products.find(p => p.id === id);
  const reviews = getProductReviews(id);

  if (!product) {
    return <Container><div>Product not found</div></Container>;
  }

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'Price not available' : `$${numPrice.toFixed(2)}`;
  };

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Container>
      <div className="py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <Badge>{product.category}</Badge>

            <Tabs defaultValue="variants" className="mt-6">
              <TabsList>
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="variants">
                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-semibold">{variant.size}</p>
                          <p className="text-sm text-gray-500">{variant.color}</p>
                        </div>
                        <div>
                          <p className="font-bold">{formatPrice(variant.price)}</p>
                          <p className="text-sm text-gray-500">Stock: {variant.stock}</p>
                        </div>
                        <Button>Add to Cart</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="details">
                <ul className="list-disc list-inside space-y-2">
                  <li>Category: {product.category}</li>
                  <li>Material: {product.variants[0].material}</li>
                  {/* Add more details as needed */}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <ReviewList reviews={reviews} />
        {user && <ReviewForm productId={id} />}
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {similarProducts.map((similarProduct) => (
            <Link key={similarProduct.id} to={`/product/${similarProduct.id}`}>
              <Card>
                <CardContent className="p-4">
                  <img src={similarProduct.image} alt={similarProduct.name} className="w-full h-48 object-cover rounded-md mb-2" />
                  <h3 className="font-semibold">{similarProduct.name}</h3>
                  <p className="text-sm text-gray-500">{formatPrice(similarProduct.variants[0].price)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}