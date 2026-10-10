import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-2xl border-2 px-3.5 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-border-strong bg-card text-card-foreground",
        sky: "border-sky-deep/40 bg-sky/25 text-foreground *:[svg]:text-sky-deep",
        mint: "border-mint-deep/40 bg-mint/25 text-foreground *:[svg]:text-mint-deep",
        coral:
          "border-coral-deep/40 bg-coral/25 text-foreground *:[svg]:text-coral-deep",
        lavender:
          "border-lavender-deep/40 bg-lavender/25 text-foreground *:[svg]:text-lavender-deep",
        destructive:
          "border-coral-deep/40 bg-coral/25 text-foreground *:[svg]:text-coral-deep *:data-[slot=alert-description]:text-foreground/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Renders a tinted inline alert banner; use `AlertTitle`/`AlertDescription` for content.
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Renders the bold heading line inside an `Alert`. */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-extrabold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Renders secondary body copy inside an `Alert`. */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

/** Renders an absolutely positioned slot in the top-right of an `Alert`. */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
