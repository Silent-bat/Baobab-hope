"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { useRTLStyles } from "@/lib/rtl-utils"

export interface RTLInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const RTLInput = React.forwardRef<HTMLInputElement, RTLInputProps>(
  ({ className, type, ...props }, ref) => {
    const { direction } = useLanguage()
    const rtlStyles = useRTLStyles(direction)

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          rtlStyles.isRTL ? "text-right" : "text-left",
          className
        )}
        dir={direction}
        ref={ref}
        {...props}
      />
    )
  }
)
RTLInput.displayName = "RTLInput"

export { RTLInput }