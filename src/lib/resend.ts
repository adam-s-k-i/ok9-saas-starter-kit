import { Resend } from 'resend'
import { render } from '@react-email/render'
import WelcomeEmail from '@/emails/WelcomeEmail'
import InvoiceEmail from '@/emails/InvoiceEmail'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const sendWelcomeEmail = async (email: string, name?: string) => {
  try {
    const emailHtml = await render(WelcomeEmail({ name }))

    await resend.emails.send({
      from: 'OK9 SaaS <welcome@ok9-saas.com>',
      to: email,
      subject: 'Willkommen bei OK9 SaaS!',
      html: emailHtml,
    })

    console.log(`✅ Welcome email sent to ${email}`)
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    throw error
  }
}

export const sendInvoiceEmail = async (
  email: string,
  invoice: { id: string; amount: number; currency: string; status: string; createdAt: string },
  userName?: string
) => {
  try {
    const emailHtml = await render(InvoiceEmail({ invoice, userName }))

    await resend.emails.send({
      from: 'OK9 SaaS <billing@ok9-saas.com>',
      to: email,
      subject: `Rechnung #${invoice.id.slice(-8)}`,
      html: emailHtml,
    })

    console.log(`✅ Invoice email sent to ${email} for invoice ${invoice.id}`)
  } catch (error) {
    console.error('❌ Error sending invoice email:', error)
    throw error
  }
}

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    await resend.emails.send({
      from: 'OK9 SaaS <security@ok9-saas.com>',
      to: email,
      subject: 'Passwort zurücksetzen',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Passwort zurücksetzen</h1>
          <p>Sie haben angefordert, Ihr Passwort zurückzusetzen.</p>
          <p>Klicken Sie auf den folgenden Link, um ein neues Passwort festzulegen:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Passwort zurücksetzen
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px;">
            Dieser Link ist 1 Stunde lang gültig. Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
          </p>

          <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              Mit freundlichen Grüßen,<br>
              Das OK9 SaaS Team
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Error sending password reset email:', error)
  }
}