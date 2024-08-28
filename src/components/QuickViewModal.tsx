import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product, Variant } from '../types/product';
import { useCartStore } from '../stores/cartStore';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = React.useState<Variant>(product.variants[0]);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, 1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{product.name}</DialogTitle>
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        <p>{product.description}</p>
        <select
          value={selectedVariant.sku}
          onChange={(e) => setSelectedVariant(product.variants.find(v => v.sku === e.target.value)!)}
        >
          {product.variants.map((variant) => (
            <option key={variant.sku} value={variant.sku}>
              {variant.size} - ${variant.price.toFixed(2)}
            </option>
          ))}
        </select>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}