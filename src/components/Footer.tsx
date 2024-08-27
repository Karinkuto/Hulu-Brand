import React from "react";
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Footer() {
  return (
    <footer className="py-4">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <Card className="rounded-xl flex justify-between items-center w-full max-w-4xl p-4 ">
          <Link to="/" className="text-xl font-bold text-primary flex items-end">
            Hulu <span className="font-light ml-1">Brand</span>
          </Link>
          <p className="text-sm">
            &copy; 2024 Hulu Brand. <span className="text-primary font-semibold">Made by FesTech</span>
          </p>
          <div className="flex space-x-4">
            <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-5 h-5 hover:text-primary" />
            </Link>
            <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 hover:text-primary" />
            </Link>
            <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5 hover:text-primary" />
            </Link>
          </div>
        </Card>
      </div>
    </footer>
  );
}