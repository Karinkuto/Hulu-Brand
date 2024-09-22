// @ts-nocheck
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Earbuds',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'High-quality wireless earbuds with noise cancellation.'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'Feature-packed smartwatch with health tracking capabilities.'
  },
  {
    id: '3',
    name: 'Portable Charger',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    description: 'High-capacity portable charger for all your devices.'
  },
  // Add more products as needed
];