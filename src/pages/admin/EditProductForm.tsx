import React, { useState, useCallback } from "react";
import { useProductStore } from "../../stores/productStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDropzone } from 'react-dropzone';
import { PlusCircle, X, ChevronDown, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateSKU } from '../../utils/skuGenerator';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { formatCurrency } from '@/utils/currencyFormatter';
import { Upload } from "lucide-react"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Reuse these from AddProductForm
const clothingCategories = [
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "outerwear", label: "Outerwear" },
  { value: "accessories", label: "Accessories" },
  { value: "footwear", label: "Footwear" },
];

const clothingMaterials = [
  "Cotton", "Polyester", "Wool", "Silk", "Linen", "Denim", "Leather", "Nylon",
  "Cashmere", "Velvet", "Satin", "Chiffon", "Tweed", "Corduroy", "Fleece", "Spandex"
];

const clothingColors = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Gray", "Brown",
  "Navy", "Beige", "Burgundy", "Teal", "Olive", "Maroon", "Coral", "Turquoise", "Lavender", "Khaki"
];

const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Reuse ComboboxSelect from AddProductForm
const ComboboxSelect = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option === value)
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9" />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default function EditProductForm({ product, onClose }) {
  const { updateProduct } = useProductStore();
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    coverImage: product.coverImage || "",
    category: product.category,
    status: product.status,
    variants: product.variants.map(v => ({
      ...v,
      images: v.images || []
    })),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
    }
  };

  const handleVariantImageUpload = (variantIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      const newVariants = [...formData.variants];
      newVariants[variantIndex].images = [...(newVariants[variantIndex].images || []), ...newImages];
      setFormData(prev => ({ ...prev, variants: newVariants }));
    }
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      ...formData,
      variants: formData.variants.map(v => ({
        ...v,
        sku: v.sku || generateSKU(formData, v),
        stock: parseInt(v.stock.toString(), 10) || 0,
        price: parseFloat(v.price.toString()) || 0,
      })),
    };
    updateProduct(product.id, updatedProduct);
    onClose();
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        stock: "",
        price: "",
        size: "",
        color: "",
        material: "",
        images: []
      }]
    }));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleSizeSelect = (index: number, size: string) => {
    const currentSize = formData.variants[index].size;
    if (currentSize === size) {
      updateVariant(index, "size", "");
    } else {
      updateVariant(index, "size", size);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[calc(80vh-180px)] pr-4">
        <div className="space-y-6 pb-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="h-32"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => handleSelectChange("category", value)} value={formData.category}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {clothingCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select onValueChange={(value) => handleSelectChange("status", value)} value={formData.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">In Stock</SelectItem>
                          <SelectItem value="outOfStock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Upload a cover image and variant images
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <Label>Cover Image</Label>
                        <div className="mt-2 relative">
                          {formData.coverImage ? (
                            <div className="relative aspect-video w-full">
                              <img
                                src={formData.coverImage}
                                alt="Cover image"
                                className="w-full h-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleCoverImageUpload}
                              />
                              <Upload className="h-8 w-8 text-muted-foreground" />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Variants</h2>
              <div className="space-y-6">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="col-span-2 md:col-span-3 flex items-end gap-4">
                        <div className="flex-grow">
                          <Label>Size</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {standardSizes.map((size) => (
                              <Button
                                key={size}
                                type="button"
                                variant={variant.size === size ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleSizeSelect(index, size)}
                              >
                                {size}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <Label htmlFor={`custom-size-${index}`}>Custom Size</Label>
                          <Input
                            id={`custom-size-${index}`}
                            placeholder="Enter custom size"
                            value={!standardSizes.includes(variant.size) ? variant.size : ""}
                            onChange={(e) => updateVariant(index, "size", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`stock-${index}`}>Stock</Label>
                        <Input
                          id={`stock-${index}`}
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, "stock", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price-${index}`}>Price</Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, "price", e.target.value)}
                          required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {formatCurrency(parseFloat(variant.price.toString()) || 0)}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor={`color-${index}`}>Color</Label>
                        <ComboboxSelect
                          options={clothingColors}
                          value={variant.color}
                          onChange={(value) => updateVariant(index, "color", value)}
                          placeholder="Select color..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`material-${index}`}>Material</Label>
                        <ComboboxSelect
                          options={clothingMaterials}
                          value={variant.material}
                          onChange={(value) => updateVariant(index, "material", value)}
                          placeholder="Select material..."
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Variant Images</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {variant.images?.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative aspect-square">
                            <img
                              src={img}
                              alt={`Variant image ${imgIndex + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(index, imgIndex)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <label className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="sr-only"
                            onChange={(e) => handleVariantImageUpload(index, e)}
                          />
                          <Upload className="h-4 w-4 text-muted-foreground" />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addVariant} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Variant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 bg-background pt-6 pb-2">
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Update Product</Button>
        </div>
      </div>
    </form>
  );
}