import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTransactionStore } from "../stores/transactionStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterIcon } from "lucide-react";

type TransactionStatus = 'all' | 'completed' | 'pending' | 'cancelled';

interface FilterOptions {
  name: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  userName: string;
  transactionId: string;
}

export default function TransactionsPage() {
  const { transactions } = useTransactionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState<TransactionStatus>('all');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    name: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    userName: '',
    transactionId: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const tableRef = useRef(null);
  const filtersRef = useRef(null);
  const transactionsPerPage = 10;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (currentStatus !== 'all' && t.status !== currentStatus) return false;
      if (filterOptions.name && !t.items.some(item => 
        item.name.toLowerCase().includes(filterOptions.name.toLowerCase())
      )) return false;
      if (filterOptions.startDate && new Date(t.date) < new Date(filterOptions.startDate)) return false;
      if (filterOptions.endDate && new Date(t.date) > new Date(filterOptions.endDate)) return false;
      if (filterOptions.minAmount && t.total < parseFloat(filterOptions.minAmount)) return false;
      if (filterOptions.maxAmount && t.total > parseFloat(filterOptions.maxAmount)) return false;
      if (filterOptions.userName && !t.userName.toLowerCase().includes(filterOptions.userName.toLowerCase())) return false;
      if (filterOptions.transactionId && t.id !== filterOptions.transactionId) return false;
      return true;
    });
  }, [transactions, currentStatus, filterOptions]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleStatusChange = (status: TransactionStatus) => {
    setCurrentStatus(status);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilterOptions({
      name: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      userName: '',
      transactionId: '',
    });
  };

  useEffect(() => {
    if (tableRef.current && filtersRef.current) {
      tableRef.current.style.transition = 'width 0.3s';
      filtersRef.current.style.transition = 'width 0.3s, opacity 0.3s, filter 0.3s';
      tableRef.current.style.width = showFilters ? '70%' : '100%';
      filtersRef.current.style.width = showFilters ? '30%' : '0';
      filtersRef.current.style.opacity = showFilters ? '1' : '0';
      filtersRef.current.style.filter = showFilters ? 'blur(0px)' : 'blur(5px)';
    }
  }, [showFilters]);

  return (
    <Container maxWidth="lg">
      <div className="flex w-full space-x-4">
        <div ref={tableRef} className="w-full overflow-hidden">
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Transactions</CardTitle>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <FilterIcon className="mr-2 h-4 w-4" /> 
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={currentStatus} className="mb-4">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => handleStatusChange('all')}>All</TabsTrigger>
                  <TabsTrigger value="completed" onClick={() => handleStatusChange('completed')}>Completed</TabsTrigger>
                  <TabsTrigger value="pending" onClick={() => handleStatusChange('pending')}>Pending</TabsTrigger>
                  <TabsTrigger value="cancelled" onClick={() => handleStatusChange('cancelled')}>Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="h-[600px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-background">ID</TableHead>
                      <TableHead className="sticky top-0 bg-background">Full Name</TableHead>
                      <TableHead className="sticky top-0 bg-background">Date</TableHead>
                      <TableHead className="sticky top-0 bg-background">Status</TableHead>
                      <TableHead className="sticky top-0 bg-background">Products</TableHead>
                      <TableHead className="sticky top-0 bg-background">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>{transaction.userName}</TableCell>
                        <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.items.map((item, index) => (
                            <div key={item.id}>
                              {item.name} x {item.quantity}
                              {index < transaction.items.length - 1 && ', '}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>${transaction.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
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
            </CardContent>
          </Card>
        </div>

        <div 
          ref={filtersRef} 
          className="w-0 overflow-hidden" 
          style={{ opacity: 0, filter: 'blur(5px)' }}
        >
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={filterOptions.name}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={filterOptions.startDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={filterOptions.endDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minAmount">Min Amount</Label>
                  <Input
                    id="minAmount"
                    name="minAmount"
                    type="number"
                    value={filterOptions.minAmount}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Max Amount</Label>
                  <Input
                    id="maxAmount"
                    name="maxAmount"
                    type="number"
                    value={filterOptions.maxAmount}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userName">Full Name</Label>
                  <Input
                    id="userName"
                    name="userName"
                    value={filterOptions.userName}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    name="transactionId"
                    value={filterOptions.transactionId}
                    onChange={handleFilterChange}
                  />
                </div>
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
