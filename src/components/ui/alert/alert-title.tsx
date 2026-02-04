import { type HTMLAttributes } from "react";
import { cn } from "lib/utils";

interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const AlertTitle = ({ className, ...props }: AlertTitleProps) => (
  <h5
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
);
