import { NextRequest, NextResponse } from 'next/server'
import { db, getInitPromise } from '@/lib/db'
import { Testimonial } from '@/types'

export async function GET() {
  try {
    await getInitPromise()
    const testimonials = await db.read<Testimonial>('testimonials')
    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await getInitPromise()
    const body = await request.json()
    const testimonial: Testimonial = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    await db.create('testimonials', testimonial)
    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await getInitPromise()
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }
    const updated = await db.update('testimonials', id, updates)
    if (!updated) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ testimonial: updated })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await getInitPromise()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }
    const deleted = await db.delete('testimonials', id)
    return NextResponse.json({ success: deleted })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}

