'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { PLANS } from '@/lib/stripe'

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: planId }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Abonnement verwalten</h1>
        <p className="text-muted-foreground mt-2">
          Wählen Sie den passenden Plan für Ihre Bedürfnisse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Object.entries(PLANS).map(([planId, plan]) => (
          <Card key={planId} className="relative">
            {planId === 'pro' && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  Beliebteste
                </Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${(plan.price / 100).toFixed(2)}
                </span>
                <span className="text-muted-foreground">/Monat</span>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(planId)}
                disabled={loading === planId}
              >
                {loading === planId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird geladen...
                  </>
                ) : (
                  'Jetzt abonnieren'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Häufig gestellte Fragen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Kann ich meinen Plan jederzeit wechseln?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ja, Sie können Ihren Plan jederzeit upgraden oder downgraden. Die Änderungen werden mit Ihrem nächsten Abrechnungszyklus wirksam.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Gibt es eine Geld-zurück-Garantie?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ja, wir bieten eine 14-tägige Geld-zurück-Garantie für alle neuen Abonnements.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Welche Zahlungsmethoden werden akzeptiert?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Wir akzeptieren alle gängigen Kreditkarten über unseren Zahlungsanbieter Stripe.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AuthGuard>
  )
}