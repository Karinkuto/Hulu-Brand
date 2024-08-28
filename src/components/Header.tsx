import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ModeToggle } from "./mode-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const { isAuthenticated, isAdmin, logout, user } = useAuthStore();
  const location = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      ]
    : [];

  const userDockItems = isAuthenticated
    ? [
        {
          key: "user",
          icon: UserIcon,
          tooltip: isAdmin
            ? `Admin: ${user?.username}`
            : `User: ${user?.username}`,
        },
      ]
    : [];

  const utilityDockItems = [
    {
      key: "search",
      icon: Search,
      tooltip: "Search",
      onClick: () => setIsSearchExpanded(!isSearchExpanded),
    },
    { key: "cart", icon: ShoppingCart, tooltip: "Cart" },
    { key: "notifications", icon: Bell, tooltip: "Notifications" },
  ];

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
                  {adminDockItems.map(({ key, icon: Icon, to, tooltip }) => (
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
                  {utilityDockItems.map(
                    ({ key, icon: Icon, tooltip, onClick }) => (
                      <DockIcon key={key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={onClick}
                              className="size-10 rounded-full"
                            >
                              <Icon className="size-4" />
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
            </motion.div>

            <AnimatePresence>
              {isSearchExpanded && (
                <motion.div
                  ref={searchRef}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <Input type="text" placeholder="Search..." className="w-64" />
                </motion.div>
              )}
            </AnimatePresence>

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
                      {user?.username && (
                        <p className="text-sm font-medium whitespace-nowrap px-2">
                          {user.username}
                        </p>
                      )}
                      {userDockItems.map(({ key, icon: Icon, tooltip }) => (
                        <DockIcon key={key}>
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
                                <Icon className="size-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </DockIcon>
                      ))}
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
