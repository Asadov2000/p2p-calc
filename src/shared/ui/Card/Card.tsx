import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

// Card принимает все стандартные свойства div (className, onClick и т.д.)
interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Базовые стили: закругление, фон вторичный (как блоки в iOS/Telegram)
          "rounded-xl bg-tg-secondary p-4 text-tg-text shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };