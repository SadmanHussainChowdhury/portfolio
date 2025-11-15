import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDB } from '@/lib/db'

// Initialize DB on first request - use singleton pattern
let initPromise: Promise<void> | null = null
const getInitPromise = () => {
  if (!initPromise) {
    initPromise = initializeDB()
  }
  return initPromise
}

export async function GET() {
  try {
    console.log('📥 GET /api/portfolio/projects called')
    console.log('🔍 Environment check:', {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI
    })
    
    await getInitPromise()
    console.log('✅ Database initialized')
    
    const projects = await db.read('projects')
    console.log(`✅ Retrieved ${projects.length} unique projects`)
    
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('❌ Error fetching projects:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('📋 Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects',
        details: process.env.NODE_ENV === 'development' || process.env.VERCEL === '1' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await getInitPromise()
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
    await getInitPromise()
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
    await getInitPromise()
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

