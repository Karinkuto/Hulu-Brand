import React, { useState } from 'react';
import { useProductStore } from '../../stores/productStore';

export default function AdminProducts() {
  const { products, addProduct, deleteProduct } = useProductStore();
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, image: '' });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ ...newProduct, id: Date.now().toString() });
    setNewProduct({ name: '', description: '', price: 0, image: '' });
  };

  return (
    <div className="space-y-8 container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
      
      <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border rounded px-3 py-2"
            required
          ></textarea>
        </div>
        <button type="submit" className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-secondary">
          Add Product
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Price</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}