import React, { useState, useCallback } from "react";
import { useProductStore } from "../../stores/productStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { useDropzone } from 'react-dropzone';
import { PlusCircle, X, ChevronDown, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateSKU } from '../../utils/skuGenerator';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

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

export default function AddProductForm() {
  const { addProduct } = useProductStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    status: "",
    variants: [{
      stock: "",
      price: "",
      size: "",
      color: "",
      material: ""
    }],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    // In a real scenario, you'd handle file uploads to a server here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'image/*': []},
    multiple: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      id: Date.now().toString(),
      image: previewImages[0] || "",
      variants: formData.variants.map(v => ({
        ...v,
        sku: generateSKU(formData, v),
        stock: parseInt(v.stock, 10) || 0,
        price: parseFloat(v.price) || 0,
      })),
    };
    addProduct(newProduct);
    // Reset form or close dialog
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        stock: "",
        price: "",
        size: "",
        color: "",
        material: ""
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
                <div>
                  <Label>Product Images</Label>
                  <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer mt-1">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the images here ...</p>
                    ) : (
                      <p>Drag 'n' drop images here, or click to select files</p>
                    )}
                  </div>
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {previewImages.map((img, index) => (
                        <div key={index} className="relative aspect-square">
                          <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => setPreviewImages(prev => prev.filter((_, i) => i !== index))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Add Product</Button>
        </div>
      </div>
    </form>
  );
}