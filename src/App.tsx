// @ts-nocheck
import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AuthPage from './pages/AuthPage';
import { useAuthStore } from './stores/authStore';
import { Cart } from './components/Cart';
import { Notifications } from './components/Notifications';
import TransactionsPage from './pages/TransactionsPage';

export default function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isAdmin = useAuthStore(state => state.isAdmin);

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
