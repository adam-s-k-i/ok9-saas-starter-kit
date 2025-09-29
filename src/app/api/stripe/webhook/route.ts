import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const userId = session.metadata?.userId

        if (userId) {
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              status: 'active',
              priceId: session.subscription as string,
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
            create: {
              userId,
              status: 'active',
              priceId: session.subscription as string,
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          })
        }
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object as unknown as {
          id: string
          status: string
          cancel_at_period_end: boolean
          current_period_end: number
        }
        const subscriptionUser = await prisma.subscription.findFirst({
          where: { priceId: subscription.id },
        })

        if (subscriptionUser) {
          await prisma.subscription.update({
            where: { userId: subscriptionUser.userId },
            data: {
              status: subscription.status,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          })
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        const deletedUser = await prisma.subscription.findFirst({
          where: { priceId: deletedSubscription.id },
        })

        if (deletedUser) {
          await prisma.subscription.update({
            where: { userId: deletedUser.userId },
            data: {
              status: 'canceled',
            },
          })
        }
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as unknown as {
          subscription: string
          amount_paid: number
          currency: string
        }
        const invoiceUser = await prisma.subscription.findFirst({
          where: { priceId: invoice.subscription as string },
          include: { user: true }
        })

        if (invoiceUser) {
          const createdInvoice = await prisma.invoice.create({
            data: {
              userId: invoiceUser.userId,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: 'paid',
              paidAt: new Date(),
            },
          })

          // Send invoice email
          try {
            const { sendInvoiceEmail } = await import('@/lib/resend')
            await sendInvoiceEmail(
              invoiceUser.user.email,
              {
                id: createdInvoice.id,
                amount: createdInvoice.amount,
                currency: createdInvoice.currency,
                status: createdInvoice.status,
                createdAt: createdInvoice.createdAt.toISOString()
              },
              invoiceUser.user.name || undefined
            )
          } catch (emailError) {
            console.error('Failed to send invoice email:', emailError)
          }
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}