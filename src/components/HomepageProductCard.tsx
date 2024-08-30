import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/product";

interface HomepageProductCardProps {
  product: Product;
}

export function HomepageProductCard({ product }: HomepageProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="w-full h-full block">
      <div className="w-full h-full overflow-hidden rounded-lg">
        <img
          src={product.coverImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </Link>
  );
}