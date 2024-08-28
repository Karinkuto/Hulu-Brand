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
  Search,
  ShoppingCart,
  Bell,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ModeToggle } from "./mode-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "../stores/cartStore";

export default function Header() {
  const { isAuthenticated, isAdmin, logout, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const mainDockItems = [
    { key: "home", icon: HomeIcon, to: "/", tooltip: "Home" },
    {
      key: "products",
      icon: ShoppingBag,
      to: "/products",
      tooltip: "Products",
    },
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
          key: "users",
          icon: Users,
          to: "/admin/users",
          tooltip: "Manage Users",
        },
      ]
    : [];

  const userDockItems = isAuthenticated
    ? [
        ...(isAdmin ? adminDockItems : []),
      ]
    : [];

  const utilityDockItems = [
    { key: "cart", icon: ShoppingCart, tooltip: "Cart", to: "/cart" },
    { key: "notifications", icon: Bell, tooltip: "Notifications", to: "/notifications" },
  ];

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
    <header className="bg-background mb-4">
      <nav className="container mx-auto px-4 py-2">
        <LayoutGroup>
          <div className="flex justify-center items-center gap-4">
            <motion.div layout>
              <TooltipProvider>
                <Dock direction="middle" className="w-auto">
                  <Link
                    to="/"
                    className="text-xl font-bold text-primary px-2 flex items-end"
                  >
                    Hulu <span className="font-light">Brand</span>
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
                  
                  {/* Move search icon and bar here */}
                  <DockIcon>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                          className="size-10 rounded-full"
                        >
                          <Search className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Search</p>
                      </TooltipContent>
                    </Tooltip>
                  </DockIcon>
                  
                  <AnimatePresence>
                    {isSearchExpanded && (
                      <motion.div
                        layout
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <Input 
                          type="text" 
                          placeholder="Search..." 
                          className="w-64 rounded-lg" 
                        />
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
                  
                  {/* Keep only one ModeToggle */}
                  <DockIcon>
                    <ModeToggle />
                  </DockIcon>
                </Dock>
              </TooltipProvider>
            </motion.div>

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
          </div>
        </LayoutGroup>
      </nav>
    </header>
  );
}
