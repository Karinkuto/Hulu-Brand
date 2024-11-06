import { useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { ProductCard } from '../components/ProductCard';

export default function ProductsPage() {
  const { products, isLoading, error, fetchProducts, filters } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get active filters count
  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'priceRange') {
      return count + (value[0] !== null || value[1] !== null ? 1 : 0);
    }
    return count + (Array.isArray(value) ? value.length : 0);
  }, 0);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products || products.length === 0) return <div>No products found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title and Filters Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <div className="flex items-center text-gray-600">
          <span>{products.length} items</span>
          {activeFiltersCount > 0 && (
            <span className="ml-2">
              • {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
            </span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
