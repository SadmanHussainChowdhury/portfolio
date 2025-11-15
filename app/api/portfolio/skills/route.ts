import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDB } from '@/lib/db'

let initialized = false
if (!initialized) {
  initializeDB()
  initialized = true
}

export async function GET() {
  try {
    const skills = db.read('skills')
    return NextResponse.json({ skills })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const skill = await request.json()
    const newSkill = {
      ...skill,
      id: skill.id || `skill-${Date.now()}`,
    }
    
    const created = db.create('skills', newSkill)
    return NextResponse.json({ skill: created }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updates } = await request.json()
    const updated = db.update('skills', id, updates)
    
    if (!updated) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }
    
    return NextResponse.json({ skill: updated })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const deleted = db.delete('skills', id)
    if (!deleted) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    )
  }
}

