'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function BillingSuccessPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and success state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Erfolgreich abonniert!</CardTitle>
            <CardDescription>
              Vielen Dank für Ihr Abonnement. Ihr Konto wurde erfolgreich aktiviert.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sie haben jetzt Zugang zu allen Funktionen Ihres gewählten Plans.
              Eine Bestätigungsemail wurde an Ihre E-Mail-Adresse gesendet.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">Nächste Schritte:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Erkunden Sie das Dashboard</li>
                <li>• Richten Sie Ihre Projekte ein</li>
                <li>• Laden Sie Teammitglieder ein</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  Zum Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Haben Sie Fragen?{' '}
            <Link href="/support" className="text-primary hover:underline">
              Kontaktieren Sie unseren Support
            </Link>
          </p>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}