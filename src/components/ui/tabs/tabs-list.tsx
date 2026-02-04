import { type ComponentPropsWithoutRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "lib/utils";

interface TabsListProps extends ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> {}

export const TabsList = ({ className, ...props }: TabsListProps) => (
  <TabsPrimitive.List
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
);
