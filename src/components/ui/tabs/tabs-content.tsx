import { type ComponentPropsWithoutRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "lib/utils";

interface TabsContentProps extends ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
> {}

export const TabsContent = ({ className, ...props }: TabsContentProps) => (
  <TabsPrimitive.Content
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
);
