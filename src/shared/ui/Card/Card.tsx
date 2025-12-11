import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

// Card принимает все стандартные свойства div (className, onClick и т.д.)
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'neo' | 'float';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', children, ...props }, ref) => {
    const variants = {
      glass: 'card-glass',
      neo: 'card-neo',
      float: 'card-float'
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };