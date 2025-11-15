import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDB } from '@/lib/db'

let initialized = false
if (!initialized) {
  initializeDB()
  initialized = true
}

export async function GET() {
  try {
    const blogPosts = db.read('blog')
    return NextResponse.json({ blogPosts })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
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

    const blogPost = await request.json()
    const newPost = {
      ...blogPost,
      id: blogPost.id || `blog-${Date.now()}`,
      publishedAt: blogPost.publishedAt || new Date().toISOString(),
    }
    
    const created = db.create('blog', newPost)
    return NextResponse.json({ blogPost: created }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog post' },
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
    const updated = db.update('blog', id, updates)
    
    if (!updated) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ blogPost: updated })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update blog post' },
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

    const deleted = db.delete('blog', id)
    if (!deleted) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}

