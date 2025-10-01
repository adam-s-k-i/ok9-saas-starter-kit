'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const dynamic = 'force-dynamic'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        redirect: false,
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
        setError('Invalid email. Please use one of the test emails listed below.')
      } else {
        // Redirect to home page after successful sign in
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Anmelden</CardTitle>
            <CardDescription>
              Wählen Sie eine Anmeldemethode
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Development Credentials */}
            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email (Development)</Label>
                 <Input
                   id="email"
                   type="email"
                   placeholder="dev@example.com"
                   value={email}
                   onChange={(e) => {
                     setEmail(e.target.value)
                     setError('')
                   }}
                   required
                 />
              </div>
               <div className="flex gap-2">
                 <Button type="submit" className="flex-1" disabled={isLoading}>
                   {isLoading ? 'Wird angemeldet...' : 'Mit Email anmelden'}
                 </Button>
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => setEmail('')}
                   disabled={isLoading}
                 >
                   Clear
                 </Button>
                </div>
             </form>

             {error && (
               <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                 {error}
               </div>
             )}

             <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Oder fortfahren mit
                </span>
              </div>
            </div>

             {/* OAuth Providers */}
             <div className="space-y-2">
               <Button
                 variant="outline"
                 className="w-full"
                 onClick={() => handleOAuthSignIn('github')}
                 disabled={isLoading}
               >
                 {isLoading ? 'Wird angemeldet...' : 'GitHub'}
               </Button>
               <Button
                 variant="outline"
                 className="w-full"
                 onClick={() => handleOAuthSignIn('google')}
                 disabled={isLoading}
               >
                 {isLoading ? 'Wird angemeldet...' : 'Google'}
               </Button>
             </div>

             <p className="text-xs text-muted-foreground text-center">
               Test emails: admin@example.com, user@example.com, premium@example.com, moderator@example.com
               Für OAuth: Konfigurieren Sie GITHUB_ID/GITHUB_SECRET und GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET in .env.local
             </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}