"use client"

import * as React from "react"
import { cn } from "cn"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

/** Root one-time-code field; compose with InputOTPGroup/InputOTPSlot children. */
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-60",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

/** Rounded frame grouping adjacent OTP slots into one field. */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-xl border-2 border-input bg-card has-aria-invalid:border-destructive-deep has-aria-invalid:ring-4 has-aria-invalid:ring-destructive/25",
        className
      )}
      {...props}
    />
  )
}

/** Single character cell of an InputOTP; `index` selects which slot to render. */
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-10 items-center justify-center border-r-2 border-input text-sm font-bold transition-all outline-none first:rounded-l-xl last:rounded-r-xl last:border-r-0 aria-invalid:border-destructive-deep data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-4 data-[active=true]:ring-ring/30 aria-invalid:data-[active=true]:border-destructive-deep aria-invalid:data-[active=true]:ring-destructive/25",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

/** Dash separator between OTP groups. */
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center px-1 text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
