import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CustomComponentProps {
  title: string
  description?: string
  variant?: "default" | "success" | "warning" | "error"
  children?: React.ReactNode
  className?: string
}

export function CustomComponent({
  title,
  description,
  variant = "default",
  children,
  className
}: CustomComponentProps) {
  const variantStyles = {
    default: "border-border bg-card",
    success: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
    warning: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
    error: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
  }

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader>
        <CardTitle className={cn(
          variant === "success" && "text-green-700 dark:text-green-300",
          variant === "warning" && "text-yellow-700 dark:text-yellow-300",
          variant === "error" && "text-red-700 dark:text-red-300"
        )}>
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardHeader>
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  )
}


