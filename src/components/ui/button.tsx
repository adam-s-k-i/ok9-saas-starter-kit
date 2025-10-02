"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "animated";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
  animated: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500"
};

const sizeVariants = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-10 px-6 text-lg",
  icon: "h-9 w-9"
};

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const isAnimated = variant === "animated";

  if (asChild) {
    // For asChild, we need to clone the child element and apply our styles
    const child = React.Children.only(children) as React.ReactElement;
    const childProps = {
      className: cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        buttonVariants[variant],
        sizeVariants[size],
        className
      ),
      ...props
    };

    return React.cloneElement(child, childProps);
  }

  if (isAnimated) {
    return (
      <motion.button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white bg-size-200 bg-pos-0 hover:bg-pos-100",
          sizeVariants[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={props.onClick}
        disabled={props.disabled}
        type={props.type}
        form={props.form}
        formAction={props.formAction}
        formEncType={props.formEncType}
        formMethod={props.formMethod}
        formNoValidate={props.formNoValidate}
        formTarget={props.formTarget}
        name={props.name}
        value={props.value}
        autoFocus={props.autoFocus}
        tabIndex={props.tabIndex}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      form={props.form}
      formAction={props.formAction}
      formEncType={props.formEncType}
      formMethod={props.formMethod}
      formNoValidate={props.formNoValidate}
      formTarget={props.formTarget}
      name={props.name}
      value={props.value}
      autoFocus={props.autoFocus}
      tabIndex={props.tabIndex}
    >
      {children}
    </motion.button>
  );
}

export { Button, buttonVariants };
