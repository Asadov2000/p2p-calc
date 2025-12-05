import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface TypographyProps extends HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: "h1" | "h2" | "body" | "caption" | "label";
}

export const Typography = ({ 
  variant = "body", 
  className, 
  children, 
  ...props 
}: TypographyProps) => {
  const baseStyles = "text-tg-text transition-colors";
  
  const variants = {
    h1: "text-2xl font-bold tracking-tight",
    h2: "text-xl font-semibold",
    body: "text-base font-normal",
    label: "text-sm font-medium text-tg-hint", // Серый цвет для подписей
    caption: "text-xs text-tg-hint"
  };

  // Если h1/h2 - рендерим h1/h2 теги, иначе p
  const Component = variant === "h1" || variant === "h2" ? variant : "p";

  return (
    <Component 
      className={cn(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </Component>
  );
};