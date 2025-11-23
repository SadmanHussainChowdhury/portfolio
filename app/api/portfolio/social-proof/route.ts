import { NextRequest, NextResponse } from 'next/server'
import { db, getInitPromise } from '@/lib/db'
import { SocialProof } from '@/types'

export async function GET() {
  try {
    await getInitPromise()
    const socialProof = await db.read<SocialProof>('socialProof')
    return NextResponse.json({ socialProof })
  } catch (error) {
    console.error('Error fetching social proof:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social proof' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await getInitPromise()
    const body = await request.json()
    const social: SocialProof = {
      id: Date.now().toString(),
      ...body,
    }
    await db.create('socialProof', social)
    return NextResponse.json({ socialProof: social })
  } catch (error) {
    console.error('Error creating social proof:', error)
    return NextResponse.json(
      { error: 'Failed to create social proof' },
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
        { error: 'Social proof ID is required' },
        { status: 400 }
      )
    }
    const updated = await db.update('socialProof', id, updates)
    if (!updated) {
      return NextResponse.json(
        { error: 'Social proof not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ socialProof: updated })
  } catch (error) {
    console.error('Error updating social proof:', error)
    return NextResponse.json(
      { error: 'Failed to update social proof' },
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
        { error: 'Social proof ID is required' },
        { status: 400 }
      )
    }
    const deleted = await db.delete('socialProof', id)
    return NextResponse.json({ success: deleted })
  } catch (error) {
    console.error('Error deleting social proof:', error)
    return NextResponse.json(
      { error: 'Failed to delete social proof' },
      { status: 500 }
    )
  }
}

