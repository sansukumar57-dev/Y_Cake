import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985]",
  {
    variants: {
      variant: {
        primary:
          "bg-espresso text-cream shadow-[0_8px_24px_-16px_rgba(44,33,27,0.8)] hover:bg-cocoa",
        secondary:
          "border border-sand bg-transparent text-espresso hover:border-mocha/50 hover:bg-porcelain",
        ghost: "text-espresso hover:bg-porcelain",
        light: "bg-cream text-espresso hover:bg-white",
        outlineLight:
          "border border-cream/30 bg-transparent text-cream hover:border-cream/60 hover:bg-cream/10",
        danger:
          "bg-danger text-cream hover:bg-[#7a342d] focus-visible:ring-danger",
      },
      size: {
        sm: "h-10 px-4 text-[13px]",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
