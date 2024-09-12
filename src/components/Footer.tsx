import React from "react";
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Footer() {
  return (
    <footer className="py-4">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <Card className="rounded-xl flex flex-col sm:flex-row w-full max-w-4xl p-4 space-y-4 sm:space-y-0">
          <Link to="/" className="text-xl font-bold text-primary flex items-end sm:w-1/3">
            Hulu <span className="font-light ml-1">Brand</span>
          </Link>
          <div className="flex justify-between items-center sm:w-2/3">
            <p className="text-sm text-center sm:text-left sm:flex-1">
              &copy; 2024 Hulu Brand. <span className="text-primary font-semibold block sm:inline">Made by FesTech</span>
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
          </div>
        </Card>
      </div>
    </footer>
  );
}