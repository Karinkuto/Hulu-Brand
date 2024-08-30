import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AuthPage from './pages/AuthPage';
import { useAuthStore } from './stores/authStore';
import UsersPage from './pages/admin/UsersPage'; // Updated import
import { Cart } from './components/Cart';
import { Notifications } from './components/Notifications';
import TransactionsPage from './pages/TransactionsPage';

export default function App() {
  const { isAuthenticated, isAdmin } = useAuthStore();

  return (
    <Router>
      <Header />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/notifications" element={<Notifications />} />
            {isAuthenticated && isAdmin && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
              </>
            )}
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}