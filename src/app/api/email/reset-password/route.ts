import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const { email, resetToken } = await request.json()

    if (!email || !resetToken) {
      return NextResponse.json(
        { error: 'Email and reset token are required' },
        { status: 400 }
      )
    }

    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password reset email error:', error)
    return NextResponse.json(
      { error: 'Failed to send password reset email' },
      { status: 500 }
    )
  }
}