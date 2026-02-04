import { type HTMLAttributes } from "react";
import { cn } from "lib/utils";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = ({ className, ...props }: CardContentProps) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);
