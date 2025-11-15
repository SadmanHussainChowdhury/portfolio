import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDB } from '@/lib/db'

// Initialize DB on first request
let initialized = false
const initPromise = initializeDB()

export async function GET() {
  try {
    await initPromise
    const projects = await db.read('projects')
    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await initPromise
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await request.json()
    const newProject = {
      ...project,
      id: project.id || `project-${Date.now()}`,
    }
    
    const created = await db.create('projects', newProject)
    return NextResponse.json({ project: created }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initPromise
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updates } = await request.json()
    const updated = await db.update('projects', id, updates)
    
    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json({ project: updated })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initPromise
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const deleted = await db.delete('projects', id)
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

