import { type HTMLAttributes } from "react";
import { cn } from "lib/utils";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = ({ className, ...props }: CardTitleProps) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
);
