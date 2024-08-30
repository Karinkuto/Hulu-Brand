import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
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
  UserIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ClipboardListIcon,
  Bell,
  Users,
  Filter,
  CreditCard,
  ShoppingCart, // Add this import
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ModeToggle } from "./mode-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/productStore";
import { FilterMenu } from "./FilterMenu";
import { Container } from "@mui/material";

export default function Header() {
  const { isAuthenticated, isAdmin, logout, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { searchTerm, setSearchTerm } = useProductStore();
  const searchInputRef = useRef(null);

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/products') {
      setIsSearchExpanded(true);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      setIsSearchExpanded(false);
    }
  }, [location]);

  const mainDockItems = [
    { key: "home", icon: HomeIcon, to: "/", tooltip: "Home" },
    {
      key: "products",
      icon: ShoppingBag,
      to: "/products",
      tooltip: "Products",
    },
  ];

  const utilityDockItems = [
    { key: "cart", icon: ShoppingCart, tooltip: "Cart", to: "/cart" },
    { key: "notifications", icon: Bell, tooltip: "Notifications", to: "/notifications" },
    ...(!isAuthenticated
      ? [{ key: "login", icon: LogInIcon, to: "/auth", tooltip: "Login" }]
      : []),
  ];

  const adminDockItems = isAdmin
    ? [
        {
          key: "dashboard",
          icon: LayoutDashboardIcon,
          to: "/admin/dashboard",
          tooltip: "Dashboard",
        },
        {
          key: "adminProducts",
          icon: PackageIcon,
          to: "/admin/products",
          tooltip: "Manage Products",
        },
        {
          key: "orders",
          icon: ClipboardListIcon,
          to: "/admin/orders",
          tooltip: "Orders",
        },
        {
          key: "transactions",
          icon: CreditCard,
          to: "/transactions",
          tooltip: "Transactions",
        },
        {
          key: "users",
          icon: Users,
          to: "/admin/users",
          tooltip: "Manage Users",
        },
      ]
    : [];

  console.log("Admin dock items:", adminDockItems);

  const userDockItems = isAuthenticated
    ? [
        ...(isAdmin ? adminDockItems : []),
      ]
    : [];

  console.log("User dock items:", userDockItems);

  const cartItemsCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  console.log("Header render:", { isAdmin, isAuthenticated, user, adminDockItems, userDockItems });

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

  return (
    <Container>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className={`flex h-14 items-center ${isAuthenticated ? 'justify-between' : 'justify-center'} px-4 pt-5`}>
          <LayoutGroup>
            <div className={`flex items-center space-x-4 ${isAuthenticated ? '' : 'w-full justify-center'}`}>
              <TooltipProvider>
                <Dock direction="middle" className="w-auto">
                  <Link
                    to="/"
                    className="text-xl font-bold text-primary px-2 flex items-end"
                  >
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
                  
                  <AnimatePresence>
                    {isSearchExpanded && (
                      <motion.div
                        layout
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden flex items-center"
                      >
                        <div className="relative flex items-center">
                          <Input 
                            ref={searchInputRef}
                            type="text" 
                            placeholder="Search..." 
                            className="w-64 pr-10 rounded-lg focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <div className="absolute right-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setIsFilterMenuOpen(true)}
                            >
                              <Filter className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Separator orientation="vertical" className="mx-2 h-6" />
                  {utilityDockItems.map(
                    ({ key, icon: Icon, tooltip, to }) => (
                      <DockIcon key={key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-10 rounded-full relative"
                              onClick={() => navigate(to)}
                            >
                              <Icon className="size-4" />
                              {key === "cart" && cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {cartItemsCount}
                                </span>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </DockIcon>
                    )
                  )}
                  
                  <DockIcon>
                    <ModeToggle />
                  </DockIcon>
                </Dock>
              </TooltipProvider>
            </div>

            <AnimatePresence mode="popLayout">
              {isAuthenticated && (
                <motion.div
                  layout
                  key="user-dock"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.3,
                    layout: { duration: 0.3 },
                  }}
                  className="ml-auto"
                >
                  <TooltipProvider>
                    <Dock direction="middle" className="w-auto">
                      {userDockItems.map(({ key, icon: Icon, to, tooltip }) => (
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
                      <Separator orientation="vertical" className="mx-2 h-6" />
                      <DockIcon>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={cn(
                                buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                }),
                                "size-10 rounded-full"
                              )}
                            >
                              <UserIcon className="size-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isAdmin ? `Admin: ${user?.username}` : `User: ${user?.username}`}</p>
                          </TooltipContent>
                        </Tooltip>
                      </DockIcon>
                      {user?.username && (
                        <p className="text-sm font-medium whitespace-nowrap px-2">
                          {user.username}
                        </p>
                      )}
                      <Separator orientation="vertical" className="mx-2 h-6" />
                      <DockIcon>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={logout}
                              className={cn(
                                buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                }),
                                "size-10 rounded-full"
                              )}
                            >
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
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </nav>
        
        <FilterMenu
          isOpen={isFilterMenuOpen}
          onOpenChange={setIsFilterMenuOpen}
        />
      </header>
      <div className="h-[calc(56px+1.25rem)]"></div> {/* Spacer div */}
    </Container>
  );
}