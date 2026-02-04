import { type HTMLAttributes } from "react";
import { cn } from "lib/utils";

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = ({
  className,
  ...props
}: CardDescriptionProps) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
