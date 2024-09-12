import React, { useState, useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterMenu({ isOpen, onOpenChange }: FilterMenuProps) {
  const { products, filters, setFilters, resetFilters } = useProductStore();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (category: string) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleFilterChange = (filterType: 'colors' | 'sizes' | 'materials', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handlePriceChange = (index: number, value: string) => {
    const newValue = value === '' ? null : parseFloat(value);
    setLocalFilters(prev => ({
      ...prev,
      priceRange: index === 0
        ? [newValue, prev.priceRange[1]]
        : [prev.priceRange[0], newValue]
    }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onOpenChange(false);
  };

  const clearAllFilters = () => {
    resetFilters();
    setLocalFilters({
      categories: [],
      colors: [],
      sizes: [],
      materials: [],
      priceRange: [null, null]
    });
  };

  const categories = ['tops', 'bottoms', 'dresses', 'outerwear', 'footwear', 'accessories'];
  const colors = Array.from(new Set(products.flatMap(p => p.variants.map(v => v.color).filter(Boolean))));
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Other'];
  const materials = Array.from(new Set(products.flatMap(p => p.variants.map(v => v.material).filter(Boolean))));

  const isFiltersApplied = localFilters.categories.length > 0 || 
                           localFilters.colors.length > 0 || 
                           localFilters.sizes.length > 0 ||
                           localFilters.materials.length > 0 ||
                           localFilters.priceRange[0] !== null || 
                           localFilters.priceRange[1] !== null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] h-[90vh] max-w-[700px] flex flex-col rounded-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          {isFiltersApplied && (
            <p className="text-sm text-muted-foreground">Filters are currently applied</p>
          )}
        </DialogHeader>
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div>
              <h4 className="font-medium mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={localFilters.categories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={localFilters.priceRange[0] ?? ''}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  placeholder="Min"
                  className="w-24"
                />
                <span>to</span>
                <Input
                  type="number"
                  value={localFilters.priceRange[1] ?? ''}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  placeholder="Max"
                  className="w-24"
                />
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Colors</h4>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <div key={color} className="flex items-center">
                      <Checkbox
                        id={`color-${color}`}
                        checked={localFilters.colors.includes(color)}
                        onCheckedChange={() => handleFilterChange('colors', color)}
                      />
                      <Label htmlFor={`color-${color}`} className="ml-2">
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <Badge
                    key={size}
                    variant={localFilters.sizes.includes(size) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleFilterChange('sizes', size)}
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <h4 className="font-medium mb-2">Materials</h4>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {materials.map(material => (
                    <div key={material} className="flex items-center">
                      <Checkbox
                        id={`material-${material}`}
                        checked={localFilters.materials.includes(material)}
                        onCheckedChange={() => handleFilterChange('materials', material)}
                      />
                      <Label htmlFor={`material-${material}`} className="ml-2">
                        {material}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={clearAllFilters}>Clear All</Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}