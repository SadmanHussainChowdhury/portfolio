import { NextRequest, NextResponse } from 'next/server'
import { db, getInitPromise } from '@/lib/db'
import { Achievement } from '@/types'

export async function GET() {
  try {
    await getInitPromise()
    const achievements = await db.read<Achievement>('achievements')
    return NextResponse.json({ achievements })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await getInitPromise()
    const body = await request.json()
    const achievement: Achievement = {
      id: Date.now().toString(),
      ...body,
    }
    await db.create('achievements', achievement)
    return NextResponse.json({ achievement })
  } catch (error) {
    console.error('Error creating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to create achievement' },
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
        { error: 'Achievement ID is required' },
        { status: 400 }
      )
    }
    const updated = await db.update('achievements', id, updates)
    if (!updated) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ achievement: updated })
  } catch (error) {
    console.error('Error updating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to update achievement' },
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
        { error: 'Achievement ID is required' },
        { status: 400 }
      )
    }
    const deleted = await db.delete('achievements', id)
    return NextResponse.json({ success: deleted })
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    )
  }
}

