import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDB } from '@/lib/db'

let initialized = false
const initPromise = initializeDB()

export async function GET() {
  try {
    await initPromise
    const services = await db.read('services')
    return NextResponse.json({ services })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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

    const service = await request.json()
    const newService = {
      ...service,
      id: service.id || `service-${Date.now()}`,
    }
    
    const created = await db.create('services', newService)
    return NextResponse.json({ service: created }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create service' },
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
    const updated = await db.update('services', id, updates)
    
    if (!updated) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    return NextResponse.json({ service: updated })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update service' },
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

    const deleted = await db.delete('services', id)
    if (!deleted) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
