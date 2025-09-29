import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe-server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
    }

    const checkoutSession = await createCheckoutSession(
      session.user.id,
      priceId,
      `${process.env.NEXTAUTH_URL}/dashboard/billing/success`,
      `${process.env.NEXTAUTH_URL}/dashboard/billing`
    )

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}