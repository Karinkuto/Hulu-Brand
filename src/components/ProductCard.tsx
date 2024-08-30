// src/components/ProductCard.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../types/product";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "../stores/cartStore";
import { formatCurrency } from '@/utils/currencyFormatter';
import { Info } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const calculateDiscountedPrice = (variant) => {
    if (variant.discount) {
      return variant.discountType === 'percentage'
        ? variant.price * (1 - variant.discount / 100)
        : variant.price - variant.discount;
    }
    return variant.price;
  };

  const formatDiscount = (variant) => {
    if (!variant.discount) return 'No discount';
    return variant.discountType === 'percentage'
      ? `${variant.discount}% off`
      : `${formatCurrency(variant.discount)} off`;
  };

  const lowestPricedVariant = product.variants.reduce((min, variant) => 
    variant.price < min.price ? variant : min
  );

  const discountedVariants = product.variants.filter(v => v.discount);
  const hasMultipleDiscounts = discountedVariants.length > 1;

  const highestDiscount = discountedVariants.reduce((max, v) => {
    const discountAmount = v.discountType === 'percentage'
      ? v.price * (v.discount / 100)
      : v.discount;
    return discountAmount > max ? discountAmount : max;
  }, 0);

  const lowestDiscountedPrice = discountedVariants.reduce((min, v) => {
    const discountedPrice = calculateDiscountedPrice(v);
    return discountedPrice < min ? discountedPrice : min;
  }, Infinity);

  const discountedPrice = calculateDiscountedPrice(lowestPricedVariant);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      quantity: 1,
      imageUrl: product.image
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="h-full flex flex-col cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardContent className="p-3 flex flex-col flex-grow">
        <div className="relative mb-4 w-full h-52">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
          {hasMultipleDiscounts ? (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-1 py-0.5 rounded-full text-xs font-bold">
              Up to {formatCurrency(highestDiscount)} OFF
            </div>
          ) : discountedVariants.length === 1 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-1 py-0.5 rounded-full text-xs font-bold">
              {formatDiscount(discountedVariants[0])}
            </div>
          )}
        </div>
        <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-base">
              {hasMultipleDiscounts ? `From ${formatCurrency(lowestDiscountedPrice)}` : formatCurrency(discountedPrice)}
            </p>
            {(hasMultipleDiscounts || lowestPricedVariant.discount) && (
              <p className="text-gray-500 line-through text-sm">
                {formatCurrency(lowestPricedVariant.price)}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            {product.variants && product.variants.length > 1 ? (
              <div className="flex items-center">
                <Info className="w-4 h-4 mr-1 text-gray-400" />
                <p className="text-gray-400 text-xs">This product has variants.</p>
              </div>
            ) : (
              null
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
