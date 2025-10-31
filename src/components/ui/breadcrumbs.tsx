import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { BreadcrumbSchema } from "@/components/seo/structured-data"

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: React.ReactNode
}

export function Breadcrumbs({
  items,
  className,
  showHome = true,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />
}: BreadcrumbsProps) {
  const allItems = showHome 
    ? [{ name: "Início", href: "/" }, ...items]
    : items

  const schemaItems = allItems.map(item => ({
    name: item.name,
    url: `https://crsetsolutions.com${item.href}`
  }))

  return (
    <>
      <nav 
        aria-label="Breadcrumb" 
        className={cn("flex items-center space-x-1 text-sm", className)}
      >
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 flex-shrink-0" aria-hidden="true">
                  {separator}
                </span>
              )}
              
              {item.current ? (
                <span 
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "font-medium text-muted-foreground hover:text-foreground",
                    "transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                  )}
                >
                  {index === 0 && showHome ? (
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {item.name}
                    </span>
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {/* Structured Data */}
      <BreadcrumbSchema items={schemaItems} />
    </>
  )
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  
  const breadcrumbs: BreadcrumbItem[] = []
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Convert segment to readable name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      name,
      href: currentPath,
      current: index === segments.length - 1
    })
  })
  
  return breadcrumbs
}

// Predefined breadcrumbs for common pages
export const commonBreadcrumbs = {
  servicos: [
    { name: "Serviços", href: "/servicos" }
  ],
  precos: [
    { name: "Preços", href: "/precos" }
  ],
  faq: [
    { name: "FAQ", href: "/faq" }
  ],
  mascotes: [
    { name: "Mascotes", href: "/mascotes" }
  ]
}
