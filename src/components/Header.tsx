// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Container } from "@mui/material";
import { Dock, DockIcon } from "@/components/magicui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HomeIcon,
  LogOutIcon,
  LogInIcon,
  ShoppingBag,
  LayoutDashboardIcon,
  PackageIcon,
  ClipboardListIcon,
  Bell,
  Users,
  CreditCard,
  ShoppingCart,
  Search,
  Filter,
  Menu,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ModeToggle } from "./mode-toggle";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "../stores/cartStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useProductStore } from "../stores/productStore";
import { Button } from "@/components/ui/button";
import { FilterMenu } from "@/components/FilterMenu"; // Import the FilterMenu component
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  
  const location = useLocation();
  const cartItemsCount = useCartStore((state) => state.items.length);
  const notificationCount = 3; // Replace with actual notification count

  const mainDockItems = [
    { key: "home", icon: HomeIcon, to: "/", tooltip: "Home" },
    { key: "products", icon: ShoppingBag, to: "/products", tooltip: "Products" },
  ];

  const utilityDockItems = [
    { 
      key: "cart", 
      icon: ShoppingCart, 
      tooltip: "Cart", 
      to: "/cart",
      badge: cartItemsCount > 0 ? cartItemsCount : null
    },
    { 
      key: "notifications", 
      icon: Bell, 
      tooltip: "Notifications", 
      to: "/notifications",
      badge: notificationCount > 0 ? notificationCount : null
    },
    ...(!isAuthenticated ? [{ key: "login", icon: LogInIcon, to: "/auth", tooltip: "Login" }] : []),
  ];

  const adminDockItems = [
    { key: "dashboard", icon: LayoutDashboardIcon, to: "/admin/dashboard", tooltip: "Dashboard" },
    { key: "adminProducts", icon: PackageIcon, to: "/admin/products", tooltip: "Manage Products" },
    { key: "orders", icon: ClipboardListIcon, to: "/admin/orders", tooltip: "Orders" },
    { key: "transactions", icon: CreditCard, to: "/transactions", tooltip: "Transactions" },
    { key: "users", icon: Users, to: "/admin/users", tooltip: "Manage Users" },
  ];

  const regularUserDockItems = [
    // Remove the "My Orders" item
    // Add any other regular user specific items here
  ];

  const userDockItems = isAuthenticated ? [...(isAdmin ? adminDockItems : regularUserDockItems)] : [];

  const isActive = (path: string) => location.pathname === path;

  const getLinkClassName = (to: string) => {
    return cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "size-10 rounded-full transition-colors duration-200",
      isActive(to)
        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
        : "hover:bg-secondary hover:text-secondary-foreground"
    );
  };

  const avatarGradient = useMemo(() => {
    const colors = [
      'from-red-500 to-yellow-500',
      'from-green-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-yellow-500 to-green-500',
      'from-blue-500 to-indigo-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const { setSearchTerm } = useProductStore();
  const [searchValue, setSearchValue] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchTerm(value);
  };

  useEffect(() => {
    setIsExpanded(location.pathname === "/products");
  }, [location]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            {isAuthenticated && (
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className={`h-12 w-12 bg-gradient-to-br ${avatarGradient}`}>
                  <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.username}</p>
                  <Badge variant="secondary">{isAdmin ? 'Admin' : 'User'}</Badge>
                </div>
              </div>
            )}
            <nav className="space-y-4">
              {isAuthenticated && isAdmin && (
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Main Navigation</h3>
              )}
              {[...mainDockItems, ...utilityDockItems.filter(item => item.key !== 'login')].map(({ key, icon: Icon, to, tooltip }) => (
                <Link key={key} to={to} className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md">
                  <Icon className="h-5 w-5" />
                  <span>{tooltip}</span>
                </Link>
              ))}
              {isAuthenticated && isAdmin && (
                <>
                  <Separator className="my-4" />
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Admin</h3>
                  {adminDockItems.map(({ key, icon: Icon, to, tooltip }) => (
                    <Link key={key} to={to} className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-md">
                      <Icon className="h-5 w-5" />
                      <span>{tooltip}</span>
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>
          <div className="flex justify-between items-center pt-6 border-t">
            <ModeToggle />
            {isAuthenticated ? (
              <Button onClick={logout} variant="ghost" size="sm" className="ml-auto">
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            ) : (
              <Link to="/auth" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "ml-auto")}>
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <Container>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <LayoutGroup>
          <nav className={`flex h-16 md:h-14 items-center justify-between px-4 ${isMobile ? 'py-2' : 'pt-5'}`}>
            {isMobile ? (
              <>
                <Link to="/" className="text-2xl font-bold text-primary">
                  <span className="flex items-center" style={{ letterSpacing: '-0.35em' }}>
                    <span className="font-bold">H</span>
                    <span className="font-light">B</span>
                  </span>
                </Link>
                <MobileMenu />
              </>
            ) : (
              <>
                <TooltipProvider>
                  <Dock direction="middle" className="w-[fit-content]">
                    <Link to="/" className="text-xl font-bold text-primary px-2 flex items-end">
                      {isAuthenticated ? (
                        <span className="flex items-end" style={{ letterSpacing: '-0.35em' }}>
                          <span className="font-bold">H</span>
                          <span className="font-light">B</span>
                        </span>
                      ) : (
                        <>
                          Hulu <span className="font-light">Brand</span>
                        </>
                      )}
                    </Link>
                    {mainDockItems.map(({ key, icon: Icon, to, tooltip }) => (
                      <DockIcon key={key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link to={to} className={getLinkClassName(to)}>
                              <Icon className="size-4" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </DockIcon>
                    ))}
                    
                    {/* Updated sliding search bar */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "300px", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="relative mx-2 overflow-hidden"
                        >
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="search"
                            placeholder="Search products..."
                            value={searchValue}
                            onChange={handleSearch}
                            className="w-full pl-8 pr-10 h-9 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setIsFilterMenuOpen(true)}
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <DockIcon className="cursor-default">
                      <Separator orientation="vertical" className="mx-2 h-6" />
                    </DockIcon>
                    
                    {utilityDockItems.map(({ key, icon: Icon, to, tooltip, badge }) => (
                      <DockIcon key={key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              <Link to={to} className={getLinkClassName(to)}>
                                <Icon className="size-4" />
                              </Link>
                              {badge !== null && key !== "login" && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {badge}
                                </span>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </DockIcon>
                    ))}
                    <DockIcon>
                      <ModeToggle />
                    </DockIcon>
                  </Dock>
                </TooltipProvider>

                <AnimatePresence>
                  {isAuthenticated && (
                    <TooltipProvider>
                      <Dock direction="middle" className="w-auto">
                        {(isAdmin ? adminDockItems : regularUserDockItems).map(({ key, icon: Icon, to, tooltip }) => (
                          <DockIcon key={key}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link to={to} className={getLinkClassName(to)}>
                                  <Icon className="size-4" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </DockIcon>
                        ))}
                        <DockIcon>
                          <Tooltip>
                            <TooltipTrigger>
                              <Avatar className={`h-8 w-8 bg-gradient-to-br ${avatarGradient}`}>
                                <AvatarFallback className="bg-gray-200/50 text-gray-700 font-medium">
                                  {user?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isAdmin ? `Admin: ${user?.username}` : `User: ${user?.username}`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </DockIcon>
                        <DockIcon>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={logout} className={getLinkClassName("")}>
                                <LogOutIcon className="size-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Logout</p>
                            </TooltipContent>
                          </Tooltip>
                        </DockIcon>
                      </Dock>
                    </TooltipProvider>
                  )}
                </AnimatePresence>
              </>
            )}
          </nav>
        </LayoutGroup>
      </header>
      <div className="h-16 md:h-[calc(56px)]"></div>
      <FilterMenu
        isOpen={isFilterMenuOpen}
        onOpenChange={setIsFilterMenuOpen}
      />
    </Container>
  );
}