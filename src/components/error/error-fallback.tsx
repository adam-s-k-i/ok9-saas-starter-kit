'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
  title?: string
  message?: string
}

export function ErrorFallback({ 
  error, 
  resetError, 
  title = "Etwas ist schiefgelaufen",
  message = "Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut."
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {message}
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">
                Fehlerdetails (Development)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
          
          <div className="flex gap-2">
            {resetError && (
              <Button onClick={resetError} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Erneut versuchen
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Seite neu laden
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Zur Startseite
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


