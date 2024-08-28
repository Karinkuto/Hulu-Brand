// src/components/ProductCard.tsx

import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const discountedPrice = product.discount
    ? product.variants[0].price * (1 - product.discount / 100)
    : product.variants[0].price;

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="flex-grow">
          <div className="relative aspect-square mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
            {product.discount && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                {product.discount}% OFF
              </div>
            )}
          </div>
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
        </Link>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-lg">${discountedPrice.toFixed(2)}</p>
            {product.discount && (
              <p className="text-gray-500 line-through">
                ${product.variants[0].price.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button className="flex-grow" asChild>
              <Link to={`/product/${product.id}`}>View Details</Link>
            </Button>
            {onQuickView && (
              <Button variant="outline" onClick={() => onQuickView(product)}>
                Quick View
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
