import React, { useState } from "react";
import { useProductStore } from "../../stores/productStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search, Filter, Edit, Trash, Eye, Tag } from "lucide-react";
import AddProductForm from "./AddProductForm";
import { Container } from "@mui/material";
import { Badge } from "@/components/ui/badge";

export default function AdminProducts() {
  const { products, deleteProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.category))
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? 'N/A' : `$${numPrice.toFixed(2)}`;
  };

  const handleEditProduct = (productId: string) => {
    // Implement edit functionality
  };

  const handleViewProduct = (productId: string) => {
    // Implement view functionality
  };

  const handleApplyDiscount = (productId: string) => {
    // Implement discount application
  };

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[80vw] max-w-[1200px] h-[80vh]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProductForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <CardHeader>
                <CardTitle>Filter by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={category}>{category}</Label>
                  </div>
                ))}
              </CardContent>
            </PopoverContent>
          </Popover>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-1/2">Variants</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-20 h-20 relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded absolute inset-0"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name || 'Unnamed Product'}</TableCell>
                    <TableCell>{product.category || 'Uncategorized'}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {product.variants.map((variant, index) => (
                          <div key={index} className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
                            <Badge variant="outline" className="text-xs">
                              SKU: {variant.sku}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Size: {variant.size || 'N/A'}
                            </Badge>
                            <Badge variant={variant.stock > 0 ? "success" : "destructive"} className="text-xs">
                              Stock: {variant.stock}
                            </Badge>
                            <Badge variant="default" className="text-xs">
                              {formatPrice(variant.price)}
                            </Badge>
                            {variant.color && (
                              <Badge variant="outline" className="text-xs flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-1" 
                                  style={{backgroundColor: variant.color}}
                                ></div>
                                Color: {variant.color}
                              </Badge>
                            )}
                            {variant.material && (
                              <Badge variant="outline" className="text-xs">
                                Material: {variant.material}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleViewProduct(product.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleEditProduct(product.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleApplyDiscount(product.id)}>
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
