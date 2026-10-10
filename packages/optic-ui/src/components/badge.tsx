import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border-2 border-transparent px-2.5 py-0.5 text-xs font-bold whitespace-nowrap transition-all outline-none focus-visible:ring-4 focus-visible:ring-ring/30 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive-deep [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        sky: "bg-sky text-sky-foreground [a]:hover:bg-sky/80",
        mint: "bg-mint text-mint-foreground [a]:hover:bg-mint/80",
        coral: "bg-coral text-coral-foreground [a]:hover:bg-coral/80",
        lavender: "bg-lavender text-lavender-foreground [a]:hover:bg-lavender/80",
        destructive:
          "bg-destructive text-destructive-foreground [a]:hover:bg-destructive/80",
        outline: "border-border-strong text-foreground [a]:hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Renders a small pill-shaped status label; pass `asChild` to style a custom element.
 */
function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
