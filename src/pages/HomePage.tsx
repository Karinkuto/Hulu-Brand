import { useProductStore } from '../stores/productStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { featuredProducts, trendingProducts } = useProductStore();

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <div key={product.id} className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}