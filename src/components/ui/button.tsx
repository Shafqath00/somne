import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-sm",
        link: "text-primary underline-offset-4 hover:underline",
        // Luxury variants
        luxury: "bg-primary text-primary-foreground hover:bg-navy-light tracking-wide uppercase text-xs font-sans font-semibold rounded-none",
        luxuryOutline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground tracking-wide uppercase text-xs font-sans font-semibold rounded-none",
        gold: "bg-accent text-foreground hover:bg-gold-dark tracking-wide uppercase text-xs font-sans font-semibold shadow-gold hover:shadow-lg rounded-none",
        goldOutline: "border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-foreground tracking-wide uppercase text-xs font-sans font-semibold rounded-none",
        hero: "bg-accent text-primary hover:bg-gold-light tracking-widest uppercase text-xs font-sans font-bold shadow-gold hover:shadow-lg rounded-none rounded-lg",
        heroOutline: "border-2 border-cream bg-transparent text-cream hover:bg-cream hover:text-primary tracking-widest uppercase text-xs font-sans font-bold rounded-none rounded-lg",
        nav: "text-foreground hover:text-accent transition-colors font-sans text-sm tracking-wide bg-transparent",
        cart: "bg-accent/10 text-accent hover:bg-accent hover:text-foreground rounded-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
        nav: "h-auto px-0 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
