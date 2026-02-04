import { type HTMLAttributes } from "react";
import { cn } from "lib/utils";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = ({ className, ...props }: CardHeaderProps) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
