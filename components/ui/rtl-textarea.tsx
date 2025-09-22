"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { useRTLStyles } from "@/lib/rtl-utils"

export interface RTLTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const RTLTextarea = React.forwardRef<HTMLTextAreaElement, RTLTextareaProps>(
  ({ className, ...props }, ref) => {
    const { direction } = useLanguage()
    const rtlStyles = useRTLStyles(direction)

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
RTLTextarea.displayName = "RTLTextarea"

export { RTLTextarea }