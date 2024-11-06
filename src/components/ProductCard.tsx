// @ts-nocheck
// src/components/ProductCard.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Product, ProductVariant } from "../types/product";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "../stores/cartStore";
import { formatCurrency } from "@/utils/currencyFormatter";
import { Info } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const navigate = useNavigate();

  const lowestPrice = product.variants && product.variants.length > 0
    ? product.variants.reduce((min, variant) => 
        Math.min(min, variant.price), Infinity)
    : product.price || 0;

  const handleClick = () => {
    if (product?.id) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-lg transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div 
          className="cursor-pointer"
          onClick={handleClick}
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product?.coverImage || '/placeholder-image.jpg'}
              alt={product?.name || 'Product'}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
                e.currentTarget.alt = 'Product image not available';
              }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product?.name || 'Unnamed Product'}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product?.description || 'No description available'}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold">
                {formatCurrency(lowestPrice)}
              </span>
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="rounded-full p-2 hover:bg-gray-100"
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
