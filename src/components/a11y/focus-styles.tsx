import { cn } from "@/lib/utils"

// Enhanced focus styles for better accessibility
export const focusStyles = {
  // Default focus ring
  default: "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
  
  // Button focus styles
  button: "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-200",
  
  // Link focus styles
  link: "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm transition-all duration-200",
  
  // Input focus styles
  input: "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200",
  
  // Card focus styles (for interactive cards)
  card: "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:scale-[1.02] transition-all duration-200",
  
  // Skip link focus styles
  skipLink: "focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
}

// High contrast mode support
export const highContrastStyles = {
  border: "border-2 border-transparent focus:border-primary",
  background: "focus:bg-primary/10",
  text: "focus:text-primary",
}

// Focus management utilities
export function FocusRing({ 
  children, 
  variant = 'default',
  className,
  ...props 
}: {
  children: React.ReactNode
  variant?: keyof typeof focusStyles
  className?: string
  [key: string]: any
}) {
  return (
    <div 
      className={cn(focusStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Enhanced button with focus management
export function AccessibleButton({
  children,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  disabled?: boolean
  [key: string]: any
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200"
  
  const variants = {
    default: "bg-background border border-input hover:bg-accent hover:text-accent-foreground",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8"
  }
  
  const disabledStyles = "disabled:pointer-events-none disabled:opacity-50"
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        focusStyles.button,
        disabledStyles,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Enhanced link with focus management
export function AccessibleLink({
  children,
  className,
  external = false,
  ...props
}: {
  children: React.ReactNode
  className?: string
  external?: boolean
  [key: string]: any
}) {
  return (
    <a
      className={cn(
        "inline-flex items-center",
        focusStyles.link,
        className
      )}
      {...(external && {
        target: "_blank",
        rel: "noopener noreferrer",
        'aria-label': `${children} (abre numa nova janela)`
      })}
      {...props}
    >
      {children}
      {external && (
        <span className="sr-only"> (abre numa nova janela)</span>
      )}
    </a>
  )
}
