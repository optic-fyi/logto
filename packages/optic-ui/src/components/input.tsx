import * as React from "react"
import { cn } from "cn"

/** Single-line text field on a card surface; forwards all native input props. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border-2 border-input bg-card px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-60 aria-invalid:border-destructive-deep aria-invalid:ring-4 aria-invalid:ring-destructive/25 md:text-sm dark:bg-card dark:disabled:bg-input/60",
        className
      )}
      {...props}
    />
  )
}

export { Input }
