"use client"

import { cn } from "@/lib/utils"

interface SkipNavProps {
  links?: Array<{
    href: string
    label: string
  }>
  className?: string
}

export function SkipNav({ 
  links = [
    { href: "#main-content", label: "Saltar para o conteúdo principal" },
    { href: "#navigation", label: "Saltar para a navegação" },
    { href: "#footer", label: "Saltar para o rodapé" }
  ],
  className 
}: SkipNavProps) {
  return (
    <div className={cn("sr-only focus-within:not-sr-only", className)}>
      <nav aria-label="Links de navegação rápida" className="fixed top-0 left-0 z-50">
        <ul className="flex flex-col gap-1 p-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "inline-block px-4 py-2 text-sm font-medium",
                  "bg-primary text-primary-foreground",
                  "rounded-md shadow-lg",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "transform -translate-y-full focus:translate-y-0",
                  "transition-transform duration-200"
                )}
                onFocus={(e) => {
                  // Ensure the link is visible when focused
                  e.currentTarget.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                  })
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

// Hook for managing focus
export function useFocusManagement() {
  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  return { focusElement, trapFocus }
}
