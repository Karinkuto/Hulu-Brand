// src/components/ProductCard.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../types/product";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currencyFormatter";
import { Info } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const navigate = useNavigate();

  const price = product.variants && product.variants.length > 0
    ? Math.min(...product.variants.map(variant => variant.price))
    : product.basePrice || 0;

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="group h-[400px] flex flex-col overflow-hidden rounded-lg transition-all hover:shadow-lg">
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="cursor-pointer flex flex-col h-full"
          onClick={handleClick}
        >
          {/* Image Container - Fixed height */}
          <div className="relative h-[250px] overflow-hidden">
            <img
              src={product?.coverImage || '/placeholder-image.jpg'}
              alt={product?.name || 'Product'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
                e.currentTarget.alt = 'Product image not available';
              }}
            />
            {/* Category Badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm"
            >
              {product.category}
            </Badge>
          </div>

          {/* Content Container - Flex grow to push price to bottom */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Product Info */}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1 hover:text-primary transition-colors">
                {product?.name || 'Unnamed Product'}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                {product?.description || 'No description available'}
              </p>
            </div>

            {/* Price and Actions - Fixed at bottom */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(price)}
                </span>
                {product.variants && product.variants.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  title="Quick view"
                >
                  <Info className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
