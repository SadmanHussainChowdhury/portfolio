import { NextRequest, NextResponse } from 'next/server'
import { ContactFormData } from '@/types'
import { db, initializeDB } from '@/lib/db'

let initialized = false
const initPromise = initializeDB()

/**
 * Contact Form API Route
 * Handles contact form submissions and saves to database
 * 
 * POST /api/contact
 * Body: { name, email, subject, message }
 */
export async function POST(request: NextRequest) {
  try {
    await initPromise
    const body: ContactFormData = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save message to database
    const messageData = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    }

    await db.create('messages', messageData)

    // Here you can also:
    // 1. Send an email notification using a service like SendGrid, Resend, or Nodemailer
    // 2. Send a notification to your admin panel
    // Example:
    // await sendEmail({
    //   to: 'your-email@example.com',
    //   from: email,
    //   subject: `Portfolio Contact: ${subject}`,
    //   text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    // })

    return NextResponse.json(
      { message: 'Contact form submitted successfully', id: messageData.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
