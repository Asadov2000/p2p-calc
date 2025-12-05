import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Typography } from "../Typography/Typography";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rightSection?: React.ReactNode; // Например, текст "RUB" или "USDT" справа
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, rightSection, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Метка над полем */}
        {label && (
          <Typography variant="label" className="ml-1">
            {label}
          </Typography>
        )}

        <div className="relative group">
          <input
            ref={ref}
            type="text"
            inputMode="decimal" // Открывает цифровую клавиатуру на мобилках
            autoComplete="off"
            className={cn(
              // Базовые стили
              "flex h-12 w-full rounded-xl bg-tg-bg border-2 border-transparent px-4 py-2 pr-12",
              "text-lg font-semibold text-tg-text placeholder:text-tg-hint/50",
              "transition-all duration-200 outline-none",
              // Стили при фокусе (цвет ссылки телеграма)
              "focus:border-tg-link/50 focus:bg-tg-bg",
              // Если ошибка
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          
          {/* Секция справа (валюта) */}
          {rightSection && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-tg-hint font-medium pointer-events-none select-none">
              {rightSection}
            </div>
          )}
        </div>

        {/* Текст ошибки */}
        {error && (
          <Typography variant="caption" className="text-red-500 ml-1">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };