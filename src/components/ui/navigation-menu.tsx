"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavigationMenuProps {
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    children?: Array<{
      label: string;
      href?: string;
      onClick?: () => void;
    }>;
  }>;
  className?: string;
  variant?: "default" | "floating";
}

function NavigationMenu({ items, className, variant = "default" }: NavigationMenuProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (variant === "floating") {
    return (
      <motion.nav
        className={cn(
          "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
          "bg-background/80 backdrop-blur-md border rounded-full px-6 py-3 shadow-lg",
          isScrolled && "bg-background/95 shadow-xl",
          className
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center space-x-6">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              className="relative"
              onHoverStart={() => setActiveItem(item.label)}
              onHoverEnd={() => setActiveItem(null)}
            >
              <motion.a
                href={item.href}
                onClick={item.onClick}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>

              <AnimatePresence>
                {activeItem === item.label && item.children && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background border rounded-lg shadow-lg p-4 min-w-48"
                  >
                    <div className="space-y-2">
                      {item.children.map((child) => (
                        <motion.a
                          key={child.label}
                          href={child.href}
                          onClick={child.onClick}
                          className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          {child.label}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.nav>
    );
  }

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          className="relative"
          onHoverStart={() => setActiveItem(item.label)}
          onHoverEnd={() => setActiveItem(null)}
        >
          <motion.a
            href={item.href}
            onClick={item.onClick}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.label}
          </motion.a>

          <AnimatePresence>
            {activeItem === item.label && item.children && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-full left-0 mt-2 bg-background border rounded-lg shadow-lg p-4 min-w-48"
              >
                <div className="space-y-2">
                  {item.children.map((child) => (
                    <motion.a
                      key={child.label}
                      href={child.href}
                      onClick={child.onClick}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {child.label}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </nav>
  );
}

// Legacy exports for backward compatibility
const NavigationMenuList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex items-center space-x-6", className)}>{children}</div>
);

const NavigationMenuItem = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const NavigationMenuTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("cursor-pointer", className)}>{children}</div>
);

const NavigationMenuContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("absolute top-full left-0 mt-2 bg-background border rounded-lg shadow-lg p-4", className)}>
    {children}
  </div>
);

const NavigationMenuLink = ({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) => (
  <a href={href} className={cn("block", className)}>{children}</a>
);

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
};