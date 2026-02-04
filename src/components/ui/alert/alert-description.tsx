import { type HTMLAttributes } from "react";
import { cn } from "lib/utils";

interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const AlertDescription = ({
  className,
  ...props
}: AlertDescriptionProps) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
);
