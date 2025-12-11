import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface TypographyProps extends HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: "h1" | "h2" | "body" | "caption" | "label";
  gradient?: boolean;
}

export const Typography = ({ 
  variant = "body", 
  gradient = false,
  className, 
  children, 
  ...props 
}: TypographyProps) => {
  const baseStyles = "text-[var(--text-primary)] transition-colors";
  
  const variants = {
    h1: "text-2xl font-bold tracking-tight",
    h2: "text-xl font-semibold",
    body: "text-base font-normal text-[var(--text-secondary)]",
    label: "text-sm font-medium text-[var(--text-tertiary)]",
    caption: "text-xs text-[var(--text-tertiary)]"
  };

  const gradientClass = gradient ? "text-gradient" : "";

  // Если h1/h2 - рендерим h1/h2 теги, иначе p
  const Component = variant === "h1" || variant === "h2" ? variant : "p";

  return (
    <Component 
      className={cn(baseStyles, variants[variant], gradientClass, className)} 
      {...props}
    >
      {children}
    </Component>
  );
};