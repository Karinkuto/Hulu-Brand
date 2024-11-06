// @ts-nocheck
import React from 'react';
import { useCartStore } from '../stores/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/currencyFormatter';

export function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Total:</h2>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
            <Button className="w-full mt-4">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}