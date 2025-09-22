"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { useRTLStyles } from "@/lib/rtl-utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface RTLNavigationProps {
  children: React.ReactNode
  className?: string
}

export function RTLNavigation({ children, className }: RTLNavigationProps) {
  const { direction } = useLanguage()
  const rtlStyles = useRTLStyles(direction)

  return (
    <nav
      className={cn(
        "flex items-center",
        rtlStyles.isRTL ? "flex-row-reverse space-x-reverse" : "",
        className
      )}
      dir={direction}
    >
      {children}
    </nav>
  )
}

interface RTLBreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    current?: boolean
  }>
  className?: string
}

export function RTLBreadcrumb({ items, className }: RTLBreadcrumbProps) {
  const { direction } = useLanguage()
  const rtlStyles = useRTLStyles(direction)

  const ChevronIcon = rtlStyles.isRTL ? ChevronLeft : ChevronRight

  return (
    <nav
      className={cn("flex items-center space-x-2", className)}
      dir={direction}
      aria-label="Breadcrumb"
    >
      <ol className={cn(
        "flex items-center",
        rtlStyles.isRTL ? "space-x-reverse space-x-2" : "space-x-2"
      )}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronIcon className="mx-2 h-4 w-4 text-muted-foreground" />
            )}
            {item.href && !item.current ? (
              <a
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  "text-sm font-medium",
                  item.current ? "text-foreground" : "text-muted-foreground"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface RTLButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export function RTLButtonGroup({ children, className }: RTLButtonGroupProps) {
  const { direction } = useLanguage()
  const rtlStyles = useRTLStyles(direction)

  return (
    <div
      className={cn(
        "inline-flex rounded-md shadow-sm",
        rtlStyles.isRTL ? "flex-row-reverse" : "",
        className
      )}
      dir={direction}
      role="group"
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0
          const isLast = index === React.Children.count(children) - 1

          let roundedClasses = ""
          if (rtlStyles.isRTL) {
            if (isFirst) {
              roundedClasses = "rounded-l-md"
            } else if (isLast) {
              roundedClasses = "rounded-r-md"
            } else {
              roundedClasses = "rounded-none"
            }
          } else {
            if (isFirst) {
              roundedClasses = "rounded-l-md"
            } else if (isLast) {
              roundedClasses = "rounded-r-md"
            } else {
              roundedClasses = "rounded-none"
            }
          }

          return React.cloneElement(child, {
            className: cn(
              child.props.className,
              roundedClasses,
              !isLast && (rtlStyles.isRTL ? "border-l-0" : "border-r-0")
            ),
          })
        }
        return child
      })}
    </div>
  )
}

interface RTLCardProps {
  children: React.ReactNode
  className?: string
}

export function RTLCard({ children, className }: RTLCardProps) {
  const { direction } = useLanguage()
  const rtlStyles = useRTLStyles(direction)

  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        rtlStyles.isRTL ? "text-right" : "text-left",
        className
      )}
      dir={direction}
    >
      {children}
    </div>
  )
}

interface RTLCardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function RTLCardHeader({ children, className }: RTLCardHeaderProps) {
  const { direction } = useLanguage()

  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      dir={direction}
    >
      {children}
    </div>
  )
}

interface RTLCardContentProps {
  children: React.ReactNode
  className?: string
}

export function RTLCardContent({ children, className }: RTLCardContentProps) {
  const { direction } = useLanguage()

  return (
    <div className={cn("p-6 pt-0", className)} dir={direction}>
      {children}
    </div>
  )
}

interface RTLCardFooterProps {
  children: React.ReactNode
  className?: string
}

export function RTLCardFooter({ children, className }: RTLCardFooterProps) {
  const { direction } = useLanguage()
  const rtlStyles = useRTLStyles(direction)

  return (
    <div
      className={cn(
        "flex items-center p-6 pt-0",
        rtlStyles.isRTL ? "flex-row-reverse space-x-reverse" : "",
        className
      )}
      dir={direction}
    >
      {children}
    </div>
  )
}