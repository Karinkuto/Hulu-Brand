// @ts-nocheck
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatCurrency } from '@/utils/currencyFormatter';
import {
  CreditCard,
  MoreVertical,
  X,
  Printer,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

export default function AdminOrders() {
  const { transactions } = useTransactionStore();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef = useRef(null);
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
    minTotal: '',
    maxTotal: '',
    customer: '',
    paymentMethod: 'all'
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary">Fulfilled</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const generateEthiopianPhoneNumber = () => {
    const randomDigits = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `+251 9${randomDigits.slice(0, 1)} ${randomDigits.slice(1, 4)} ${randomDigits.slice(4)}`;
  };

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  useEffect(() => {
    if (receiptRef.current && tableRef.current) {
      receiptRef.current.style.transition = 'width 0.3s, opacity 0.3s, filter 0.3s';
      tableRef.current.style.transition = 'width 0.3s';
      receiptRef.current.style.width = showReceipt ? '30%' : '0';
      tableRef.current.style.width = showReceipt ? '70%' : '100%';
      receiptRef.current.style.opacity = showReceipt ? '1' : '0';
      receiptRef.current.style.filter = showReceipt ? 'blur(0px)' : 'blur(5px)';
    }
  }, [showReceipt]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      startDate: '',
      endDate: '',
      minTotal: '',
      maxTotal: '',
      customer: '',
      paymentMethod: 'all'
    });
  };

  const applyFilters = () => {
    // This function would apply the filters to the transactions
    // For now, we'll just close the filter panel
    setShowFilter(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.status !== 'all' && transaction.status !== filters.status) return false;
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) return false;
    if (filters.minTotal && transaction.total < parseFloat(filters.minTotal)) return false;
    if (filters.maxTotal && transaction.total > parseFloat(filters.maxTotal)) return false;
    if (filters.customer && !transaction.customer.toLowerCase().includes(filters.customer.toLowerCase())) return false;
    if (filters.paymentMethod !== 'all' && transaction.paymentMethod !== filters.paymentMethod) return false;
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="lg">
      <div className="flex w-full space-x-4">
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "35%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Filter Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date Range</Label>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                          <Input 
                            id="startDate"
                            type="date" 
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-xs">End Date</Label>
                          <Input 
                            id="endDate"
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Order Total</Label>
                      <div className="flex space-x-2">
                        <Input 
                          type="number" 
                          placeholder="Min"
                          value={filters.minTotal}
                          onChange={(e) => handleFilterChange('minTotal', e.target.value)}
                        />
                        <Input 
                          type="number" 
                          placeholder="Max"
                          value={filters.maxTotal}
                          onChange={(e) => handleFilterChange('maxTotal', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="customer">Customer</Label>
                      <Input 
                        id="customer"
                        value={filters.customer}
                        onChange={(e) => handleFilterChange('customer', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select value={filters.paymentMethod} onValueChange={(value) => handleFilterChange('paymentMethod', value)}>
                        <SelectTrigger id="paymentMethod">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                  <Button onClick={applyFilters}>Apply Filters</Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={tableRef} className="flex-grow overflow-hidden">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Recent orders from your store.</CardDescription>
              </div>
              {/* Add the filter button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      className={transaction.id === selectedTransaction?.id ? "bg-muted" : ""}
                      onClick={() => handleRowClick(transaction)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{formatCurrency(transaction.total)}</TableCell>
                    </TableRow>
                  ))}
                  {/* Add empty rows to maintain consistent height */}
                  {[...Array(Math.max(0, itemsPerPage - currentTransactions.length))].map((_, index) => (
                    <TableRow key={`empty-${index}`}>
                      <TableCell colSpan={4}>&nbsp;</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>

        <div 
          ref={receiptRef} 
          className="w-0 overflow-hidden" 
          style={{ opacity: 0, filter: 'blur(5px)' }}
        >
          {showReceipt && selectedTransaction && (
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="text-lg">Order {selectedTransaction.id}</CardTitle>
                  <CardDescription>Date: {formatDate(selectedTransaction.date)}</CardDescription>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowReceipt(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTransaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid gap-3">
                      <div className="font-semibold">Order Details</div>
                      <ul className="grid gap-3">
                        {selectedTransaction.items.map((item) => (
                          <li key={item.id} className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {item.name} x <span>{item.quantity}</span>
                            </span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <Separator className="my-2" />
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatCurrency(selectedTransaction.total)}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tax (15%)</span>
                          <span>{formatCurrency(selectedTransaction.total * 0.15)}</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                          <span className="text-muted-foreground">Total</span>
                          <span>{formatCurrency(selectedTransaction.total * 1.15)}</span>
                        </li>
                      </ul>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Customer Information</div>
                      <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Customer</dt>
                          <dd>Customer {selectedTransaction.id}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Phone</dt>
                          <dd>{generateEthiopianPhoneNumber()}</dd>
                        </div>
                      </dl>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Payment Information</div>
                      <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center gap-1 text-muted-foreground">
                            <CreditCard className="h-4 w-4" />
                            Credit Card
                          </dt>
                          <dd>**** **** **** 1234</dd>
                        </div>
                      </dl>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex flex-row items-center justify-between bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Status: {getStatusBadge(selectedTransaction.status)}
                </div>
                <Button variant="ghost" size="icon" onClick={() => {/* Add print functionality here */}}>
                  <Printer className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}