import React, { useState, useRef } from "react";
import { useProductStore } from "../../stores/productStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search, Filter, Edit, Trash, Eye, Tag, MoreHorizontal, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddProductForm from "./AddProductForm";
import { Container } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { formatCurrency } from '@/utils/currencyFormatter';
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import EditProductForm from "./EditProductForm";

export default function AdminProducts() {
  const { products, deleteProduct, updateProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountStartDate, setDiscountStartDate] = useState<Date | undefined>(undefined);
  const [discountEndDate, setDiscountEndDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

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
    return isNaN(numPrice) ? 'N/A' : formatCurrency(numPrice);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleEditProduct = (productId: string) => {
    const productToEdit = products.find(p => p.id === productId);
    if (productToEdit) {
      setProductToEdit(productToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleApplyDiscount = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setDiscountAmount(0);
      setDiscountType('percentage');
      setDiscountStartDate(new Date());
      setDiscountEndDate(undefined);
      setSelectedVariants([]);
    }
    setIsDiscountDialogOpen(true);
    setEditingProduct(productId);
  };

  const applyDiscount = () => {
    if (editingProduct) {
      setIsLoading(true);
      setDiscountError(null);

      if (discountAmount <= 0) {
        setDiscountError("Discount amount must be greater than 0.");
        setIsLoading(false);
        return;
      }

      if (!discountEndDate) {
        setDiscountError("Please set an expiration date for the discount.");
        setIsLoading(false);
        return;
      }

      if (discountStartDate && discountEndDate && discountStartDate > discountEndDate) {
        setDiscountError("End date must be after start date.");
        setIsLoading(false);
        return;
      }

      updateProduct(editingProduct, { 
        discountStartDate,
        discountEndDate,
        variants: products.find(p => p.id === editingProduct)?.variants.map(v => 
          selectedVariants.includes(v.sku) ? { ...v, discount: discountAmount, discountType } : v
        )
      });

      console.log('Updated product:', products.find(p => p.id === editingProduct));

      setIsDiscountDialogOpen(false);
      resetDiscountForm();
      toast({
        title: "Discount Applied",
        description: `A ${discountType === 'percentage' ? `${discountAmount}%` : formatCurrency(discountAmount)} discount has been applied to the selected variants.`,
      });
      setIsLoading(false);
    }
  };

  const resetDiscountForm = () => {
    setEditingProduct(null);
    setDiscountAmount(0);
    setDiscountType('percentage');
    setDiscountStartDate(undefined);
    setDiscountEndDate(undefined);
    setSelectedVariants([]);
  };

  const removeDiscount = (productId: string) => {
    setIsLoading(true);
    updateProduct(productId, { 
      discount: undefined,
      discountType: undefined,
      discountStartDate: undefined,
      discountEndDate: undefined
    });
    toast({
      title: "Discount Removed",
      description: "The discount has been removed from the product.",
    });
    setIsLoading(false);
  };

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) return;

    deletedProductRef.current = productToDelete;

    toast({
      title: "Confirm Delete",
      description: "Are you sure you want to delete this product?",
      variant: "destructive",
      action: (
        <ToastAction altText="Delete" onClick={() => confirmDelete(productId)}>
          Delete
        </ToastAction>
      ),
    });
  };

  const confirmDelete = (productId: string) => {
    deleteProduct(productId);
    
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    toast({
      title: "Product Deleted",
      description: "The product has been deleted. Click 'Undo' to restore it.",
      action: (
        <ToastAction altText="Undo" onClick={undoDelete}>
          Undo
        </ToastAction>
      ),
      duration: 15000, // 15 seconds
    });

    undoTimeoutRef.current = setTimeout(() => {
      deletedProductRef.current = null;
    }, 15000);
  };

  const undoDelete = () => {
    if (deletedProductRef.current) {
      const { addProduct } = useProductStore.getState();
      addProduct(deletedProductRef.current);
      deletedProductRef.current = null;
      
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

      toast({
        title: "Product Restored",
        description: "The product has been restored successfully.",
      });
    }
  };

  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deletedProductRef = useRef<Product | null>(null);

  const formatDiscount = (variant: any) => {
    console.log('Formatting discount for variant:', variant);
    if (!variant.discount || isNaN(variant.discount)) {
      return 'No discount';
    }
    
    if (variant.discountType === 'percentage') {
      return `${variant.discount}% off`;
    } else {
      return `${formatCurrency(variant.discount)} off`;
    }
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
                  <TableHead>Discount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-20 h-20 relative">
                        <img 
                          src={product.coverImage} 
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
                              {variant.stock > 0 ? `Stock: ${variant.stock}` : "Out of Stock"}
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
                      {product.variants.some(v => v.discount) ? (
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map((v, index) => 
                            v.discount ? (
                              <Badge key={index} variant="outline">
                                {v.size}: {formatDiscount(v)}
                              </Badge>
                            ) : null
                          )}
                        </div>
                      ) : 'No discount'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleApplyDiscount(product.id)}>
                            <Tag className="mr-2 h-4 w-4" />
                            Apply Discount
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => removeDiscount(product.id)}>
                            <Tag className="mr-2 h-4 w-4" />
                            Remove Discount
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingProduct && products.find(p => p.id === editingProduct)?.variants.length > 1 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="variants" className="text-right">
                  Variants
                </Label>
                <div className="col-span-3 space-y-2">
                  {products.find(p => p.id === editingProduct)?.variants.map((variant) => (
                    <div key={variant.sku}>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          selectedVariants.includes(variant.sku) && "border-primary"
                        )}
                        onClick={() => {
                          setSelectedVariants(prev =>
                            prev.includes(variant.sku)
                              ? prev.filter(sku => sku !== variant.sku)
                              : [...prev, variant.sku]
                          );
                        }}
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          <div 
                            className="w-4 h-4 rounded-sm" 
                            style={{backgroundColor: variant.color}}
                          />
                          <span>{variant.size}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-muted-foreground">{formatCurrency(variant.price)}</span>
                        </div>
                        {selectedVariants.includes(variant.sku) && <Check className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountType" className="text-right">
                Type
              </Label>
              <Select onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)} defaultValue={discountType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                {discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}
              </Label>
              <Input
                id="discount"
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !discountStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {discountStartDate ? format(discountStartDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={discountStartDate}
                    onSelect={setDiscountStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !discountEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {discountEndDate ? format(discountEndDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={discountEndDate}
                    onSelect={setDiscountEndDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {discountError && (
            <p className="text-red-500 text-sm mt-2">{discountError}</p>
          )}
          <DialogFooter>
            <Button onClick={applyDiscount} disabled={isLoading || selectedVariants.length === 0}>
              {isLoading ? "Applying..." : "Apply Discount"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[80vw] max-w-[1200px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <EditProductForm 
              product={productToEdit} 
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
