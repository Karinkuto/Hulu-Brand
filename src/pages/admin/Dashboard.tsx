import React from 'react';
import { useProductStore } from '../../stores/productStore';

export default function AdminDashboard() {
  const { products } = useProductStore();

  return (
    <div className="space-y-8 container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p>Total Products: {products.length}</p>
        {/* Add more dashboard statistics here */}
      </div>

      {/* Add more dashboard widgets or summaries here */}
    </div>
  );
}