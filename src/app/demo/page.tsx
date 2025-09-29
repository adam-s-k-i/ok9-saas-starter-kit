'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomComponent } from "@/components/custom/custom-component"
import { ThemeToggle } from "@/components/custom/theme-toggle"
import { ResponsiveNavigation } from "@/components/custom/responsive-navigation"
import { LoginForm } from "@/components/forms/login-form"
import { ContactForm } from "@/components/forms/contact-form"
import { OptimizedImage, HeroImage } from "@/components/performance/optimized-image"
import { useAppStore } from "@/stores/app-store"
import { Home, Settings, User, Mail } from "lucide-react"

export default function DemoPage() {
  const { addNotification } = useAppStore()
  const [activeTab, setActiveTab] = useState('components')

  const navigationItems = [
    { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
    { label: 'Profile', href: '/profile', icon: <User className="h-4 w-4" /> },
    { label: 'Contact', href: '/contact', icon: <Mail className="h-4 w-4" /> }
  ]

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    addNotification({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
      message: `This is a ${type} notification example.`,
      type,
      duration: 5000
    })
  }

  const tabs = [
    { id: 'components', label: 'Components' },
    { id: 'forms', label: 'Forms' },
    { id: 'performance', label: 'Performance' },
    { id: 'notifications', label: 'Notifications' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Frontend Agent Demo</h1>
            <div className="flex items-center gap-4">
              <ResponsiveNavigation items={navigationItems} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'components' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6">Custom Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CustomComponent
                  title="Default Component"
                  description="This is a default custom component"
                >
                  <p>Default content goes here.</p>
                </CustomComponent>

                <CustomComponent
                  title="Success Component"
                  description="This is a success variant"
                  variant="success"
                >
                  <p>Success content goes here.</p>
                </CustomComponent>

                <CustomComponent
                  title="Warning Component"
                  description="This is a warning variant"
                  variant="warning"
                >
                  <p>Warning content goes here.</p>
                </CustomComponent>

                <CustomComponent
                  title="Error Component"
                  description="This is an error variant"
                  variant="error"
                >
                  <p>Error content goes here.</p>
                </CustomComponent>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6">Form Components</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Login Form</h3>
                  <LoginForm />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact Form</h3>
                  <ContactForm />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6">Performance Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Optimized Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OptimizedImage
                      src="/next.svg"
                      alt="Next.js Logo"
                      width={200}
                      height={100}
                      className="rounded-lg"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hero Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HeroImage
                      src="/vercel.svg"
                      alt="Vercel Logo"
                      width={200}
                      height={100}
                      className="rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6">Notification System</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => showNotification('success')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Success
                </Button>
                <Button
                  onClick={() => showNotification('error')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Error
                </Button>
                <Button
                  onClick={() => showNotification('warning')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Warning
                </Button>
                <Button
                  onClick={() => showNotification('info')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Info
                </Button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}


