import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 text-sm font-extrabold whitespace-nowrap shadow-ledge transition-[translate,box-shadow,background-color] duration-100 outline-none select-none hover:-translate-y-0.5 hover:shadow-ledge-hover focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 active:translate-y-1 active:shadow-ledge disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 aria-invalid:border-destructive-deep aria-invalid:ring-4 aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary-deep bg-primary text-primary-foreground [--ledge-color:var(--primary-deep)]",
        secondary:
          "border-sky-deep bg-secondary text-secondary-foreground [--ledge-color:var(--sky-deep)]",
        sky: "border-sky-deep bg-sky text-sky-foreground [--ledge-color:var(--sky-deep)]",
        mint: "border-mint-deep bg-mint text-mint-foreground [--ledge-color:var(--mint-deep)]",
        coral:
          "border-coral-deep bg-coral text-coral-foreground [--ledge-color:var(--coral-deep)]",
        lavender:
          "border-lavender-deep bg-lavender text-lavender-foreground [--ledge-color:var(--lavender-deep)]",
        destructive:
          "border-destructive-deep bg-destructive text-destructive-foreground [--ledge-color:var(--destructive-deep)]",
        outline:
          "border-border-strong bg-card text-foreground [--ledge-color:var(--border-strong)] hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border-transparent bg-transparent text-foreground shadow-none hover:translate-y-0 hover:bg-accent hover:text-accent-foreground hover:shadow-none active:translate-y-0 active:shadow-none",
        link: "border-transparent bg-transparent text-primary shadow-none hover:translate-y-0 hover:underline hover:shadow-none active:translate-y-0 active:shadow-none underline-offset-4",
      },
      size: {
        default: "h-11 px-5",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 px-3.5 text-[0.8rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 gap-2 rounded-2xl px-7 text-base",
        icon: "size-11",
        "icon-xs":
          "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-14 rounded-2xl",
      },
      shape: {
        rounded: "",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
)

/**
 * Face of a ledged button: the moving part. Border, fill, and motion live
 * here; the stationary ledge is painted by the `Button` wrapper. Radius is
 * inherited so groups and `shape` only ever set it in one place.
 */
const buttonFaceVariants = cva(
  "group/button-face inline-flex items-center justify-center gap-1.5 rounded-[inherit] border-2 text-sm font-extrabold whitespace-nowrap transition-[translate,background-color] duration-100 outline-none select-none hover:-translate-y-0.5 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 active:translate-y-1 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 aria-invalid:border-destructive-deep aria-invalid:ring-4 aria-invalid:ring-destructive/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-primary-deep bg-primary text-primary-foreground",
        secondary:
          "border-sky-deep bg-secondary text-secondary-foreground",
        sky: "border-sky-deep bg-sky text-sky-foreground",
        mint: "border-mint-deep bg-mint text-mint-foreground",
        coral: "border-coral-deep bg-coral text-coral-foreground",
        lavender:
          "border-lavender-deep bg-lavender text-lavender-foreground",
        destructive:
          "border-destructive-deep bg-destructive text-destructive-foreground",
        outline:
          "border-border-strong bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border-transparent bg-transparent text-foreground hover:translate-y-0 hover:bg-accent hover:text-accent-foreground active:translate-y-0",
        link: "border-transparent bg-transparent text-primary hover:translate-y-0 hover:underline active:translate-y-0 underline-offset-4",
      },
      size: {
        default: "h-11 px-5",
        xs: "h-7 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 px-3.5 text-[0.8rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 gap-2 px-7 text-base",
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** Ledge color per variant; painted on the stationary wrapper. */
const buttonLedgeColor: Record<string, string> = {
  default: "[--ledge-color:var(--primary-deep)]",
  secondary: "[--ledge-color:var(--sky-deep)]",
  sky: "[--ledge-color:var(--sky-deep)]",
  mint: "[--ledge-color:var(--mint-deep)]",
  coral: "[--ledge-color:var(--coral-deep)]",
  lavender: "[--ledge-color:var(--lavender-deep)]",
  destructive: "[--ledge-color:var(--destructive-deep)]",
  outline: "[--ledge-color:var(--border-strong)]",
  ghost: "[--ledge-color:transparent]",
  link: "[--ledge-color:transparent]",
}

/** Corner radius per size; lives on the wrapper, the face inherits it. */
const buttonRadius: Record<string, string> = {
  default: "rounded-xl",
  xs: "rounded-lg",
  sm: "rounded-xl",
  lg: "rounded-2xl",
  icon: "rounded-xl",
  "icon-xs": "rounded-lg",
  "icon-sm": "rounded-xl",
  "icon-lg": "rounded-2xl",
}

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

/**
 * Renders a chunky pressable button with a solid bottom ledge that stays
 * totally still while the face dips into it; pass `asChild` to style a
 * custom element (single-element fallback without the split ledge).
 */
function Button({
  className,
  variant = "default",
  size = "default",
  shape = "rounded",
  asChild = false,
  disabled,
  ...props
}: ButtonProps) {
  if (asChild || variant === "ghost" || variant === "link") {
    const Comp = asChild ? Slot.Root : "button"
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-shape={shape}
        className={cn(buttonVariants({ variant, size, shape, className }))}
        disabled={disabled}
        {...props}
      />
    )
  }

  return (
    <span
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(
        "inline-flex shrink-0 flex-col bg-(--ledge-color) pb-1 whitespace-nowrap select-none has-[:disabled]:bg-transparent",
        buttonLedgeColor[variant ?? "default"],
        shape === "pill" ? "rounded-full" : buttonRadius[size ?? "default"],
        className
      )}
    >
      <button
        data-slot="button-face"
        className={cn(buttonFaceVariants({ variant, size }))}
        disabled={disabled}
        {...props}
      />
    </span>
  )
}

export { Button, buttonFaceVariants, buttonVariants }
