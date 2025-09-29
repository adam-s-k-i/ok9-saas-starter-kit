import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const { email, invoice } = await request.json()

    if (!email || !invoice) {
      return NextResponse.json(
        { error: 'Email and invoice are required' },
        { status: 400 }
      )
    }

    await sendInvoiceEmail(email, invoice)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Invoice email error:', error)
    return NextResponse.json(
      { error: 'Failed to send invoice email' },
      { status: 500 }
    )
  }
}