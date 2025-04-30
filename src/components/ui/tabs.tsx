
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Enhanced tabs with animations
const AnimatedTabs = TabsPrimitive.Root

const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-xl bg-muted/40 backdrop-blur-md p-1 text-muted-foreground border border-white/10 shadow-lg",
      className
    )}
    {...props}
  />
))
AnimatedTabsList.displayName = "AnimatedTabsList"

const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { icon?: React.ReactNode }
>(({ className, children, icon, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background/80 data-[state=active]:text-foreground data-[state=active]:shadow-sm backdrop-blur-md relative overflow-hidden",
      className
    )}
    {...props}
  >
    <motion.span
      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-data-[state=active]:opacity-100"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: props["data-state"] === "active" ? 1 : 0,
      }}
      transition={{ duration: 0.2 }}
    />
    
    {icon && (
      <motion.span 
        className="text-muted-foreground group-data-[state=active]:text-primary"
        initial={{ scale: 0.8 }}
        animate={{ 
          scale: props["data-state"] === "active" ? 1.1 : 0.8,
          rotate: props["data-state"] === "active" ? [0, -5, 5, 0] : 0, 
        }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        {icon}
      </motion.span>
    )}
    
    <motion.span
      animate={{ 
        scale: props["data-state"] === "active" ? 1.05 : 1,
        y: props["data-state"] === "active" ? [-2, 0] : 0 
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
    
    <motion.span
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary transform origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: props["data-state"] === "active" ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  </TabsPrimitive.Trigger>
))
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger"

const AnimatedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring" }}
      className="w-full"
    >
      {props.children}
    </motion.div>
  </TabsPrimitive.Content>
))
AnimatedTabsContent.displayName = "AnimatedTabsContent"

export { 
  Tabs, TabsList, TabsTrigger, TabsContent,
  AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent
}
