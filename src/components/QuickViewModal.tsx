import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X as XIcon } from 'lucide-react';

export function QuickViewModal({ product, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-[500px] w-full max-h-[80vh]">
        <div className="relative h-full">
          <img 
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          <DialogClose
            className="absolute top-2 right-2 rounded-full bg-white p-2 hover:bg-gray-200"
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}