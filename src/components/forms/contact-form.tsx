'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/stores/app-store"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  subject: z.string().min(5, "Betreff muss mindestens 5 Zeichen lang sein"),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen lang sein"),
  newsletter: z.boolean().optional()
})

type ContactFormData = z.infer<typeof contactFormSchema>

export function ContactForm() {
  const { addNotification } = useAppStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      newsletter: false
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      addNotification({
        title: "Nachricht gesendet",
        message: "Vielen Dank für Ihre Nachricht. Wir melden uns bald bei Ihnen!",
        type: "success",
        duration: 5000
      })
      
      reset()
      console.log("Contact form data:", data)
    } catch (error) {
      addNotification({
        title: "Fehler beim Senden",
        message: "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        type: "error",
        duration: 5000
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Kontakt</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Ihr Name"
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.com"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Betreff *</Label>
            <Input
              id="subject"
              placeholder="Betreff Ihrer Nachricht"
              {...register("subject")}
              aria-invalid={errors.subject ? "true" : "false"}
            />
            {errors.subject && (
              <p className="text-sm text-red-600" role="alert">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nachricht *</Label>
            <textarea
              id="message"
              rows={6}
              placeholder="Ihre Nachricht..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("message")}
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message && (
              <p className="text-sm text-red-600" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="newsletter"
              type="checkbox"
              {...register("newsletter")}
              className="rounded border-gray-300"
            />
            <Label htmlFor="newsletter" className="text-sm">
              Ich möchte den Newsletter erhalten
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


