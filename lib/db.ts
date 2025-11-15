/**
 * Hybrid database for portfolio data
 * Uses MongoDB in production (Vercel) and file system in development
 */

import fs from 'fs'
import path from 'path'

// Check if we're in a serverless environment (Vercel)
const isServerless = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// Use MongoDB in production, file system in development
type DbInterface = {
  read<T>(collection: string): Promise<T[]>
  write<T>(collection: string, data: T[]): Promise<void>
  findOne<T extends { id: string }>(collection: string, id: string): Promise<T | null>
  create<T extends { id: string }>(collection: string, item: T): Promise<T>
  update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null>
  delete(collection: string, id: string): Promise<boolean>
}

let dbMongo: DbInterface | null = null
let mongoLoadError: Error | null = null

// Try to load MongoDB in serverless environments
if (isServerless) {
  if (process.env.MONGODB_URI) {
    try {
      dbMongo = require('./db-mongodb').dbMongo as DbInterface
      console.log('✅ MongoDB module loaded successfully')
      console.log('📍 Environment:', process.env.VERCEL ? 'Vercel' : 'Production')
      console.log('🔗 MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✓' : 'Not set ✗')
    } catch (error) {
      mongoLoadError = error instanceof Error ? error : new Error(String(error))
      console.error('❌ Failed to load MongoDB module:', mongoLoadError.message)
      console.error('📦 Stack:', mongoLoadError.stack)
      console.warn('⚠️ MongoDB not available, but this is required in serverless environment')
    }
  } else {
    console.error('❌ MONGODB_URI not set in serverless environment!')
    console.error('📍 Current environment:', {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI
    })
    console.error('📝 To fix:')
    console.error('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables')
    console.error('   2. Add MONGODB_URI with your MongoDB connection string')
    console.error('   3. Make sure to select "Production" environment')
    console.error('   4. Redeploy your application')
  }
}

const DATA_DIR = path.join(process.cwd(), 'data', 'db')
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    } catch (error) {
      // In serverless, directory creation might fail - that's okay
      if (!isServerless) throw error
    }
  }
}

const getFilePath = (collection: string) => path.join(DATA_DIR, `${collection}.json`)

// File system database (for development)
const dbFile = {
  // Read data from JSON file
  read<T>(collection: string): T[] {
    if (isServerless) return [] // Can't read files in serverless
    ensureDataDir()
    const filePath = getFilePath(collection)
    if (!fs.existsSync(filePath)) {
      return []
    }
    try {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading ${collection}:`, error)
      return []
    }
  },

  // Write data to JSON file
  write<T>(collection: string, data: T[]): void {
    if (isServerless) {
      console.warn('File system writes not available in serverless environment')
      return
    }
    ensureDataDir()
    const filePath = getFilePath(collection)
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      console.error(`Error writing ${collection}:`, error)
    }
  },
}

// Unified database interface
export const db = {
  // Read data
  async read<T>(collection: string): Promise<T[]> {
    if (dbMongo) {
      try {
        return await dbMongo.read<T>(collection)
      } catch (error) {
        console.error(`Error reading ${collection} from MongoDB:`, error)
        // In serverless, if MongoDB fails, we can't fall back to file system
        if (isServerless) {
          throw new Error(`Database read failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
        // In development, fall back to file system
        return dbFile.read<T>(collection)
      }
    }
    // File system fallback (development only)
    if (isServerless) {
      throw new Error('Database not configured. MONGODB_URI is required in serverless environment.')
    }
    return dbFile.read<T>(collection)
  },

  // Write data
  async write<T>(collection: string, data: T[]): Promise<void> {
    if (dbMongo) {
      await dbMongo.write<T>(collection, data)
    } else {
      dbFile.write<T>(collection, data)
    }
  },

  // Find one item by ID
  async findOne<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
    if (dbMongo) {
      return await dbMongo.findOne<T>(collection, id)
    }
    const items = dbFile.read<T>(collection)
    return items.find(item => item.id === id) || null
  },

  // Create new item
  async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    if (dbMongo) {
      try {
        return await dbMongo.create<T>(collection, item)
      } catch (error) {
        console.error(`Error creating ${collection} in MongoDB:`, error)
        if (isServerless) {
          throw new Error(`Database create failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
        // Fall back to file system in development
        const items = dbFile.read<T>(collection)
        items.push(item)
        dbFile.write(collection, items)
        return item
      }
    }
    if (isServerless) {
      throw new Error('Database not configured. MONGODB_URI is required in serverless environment.')
    }
    const items = dbFile.read<T>(collection)
    items.push(item)
    dbFile.write(collection, items)
    return item
  },

  // Update item
  async update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    if (dbMongo) {
      return await dbMongo.update<T>(collection, id, updates)
    }
    const items = dbFile.read<T>(collection)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return null
    items[index] = { ...items[index], ...updates }
    dbFile.write(collection, items)
    return items[index]
  },

  // Delete item
  async delete(collection: string, id: string): Promise<boolean> {
    if (dbMongo) {
      return await dbMongo.delete(collection, id)
    }
    const items = dbFile.read<{ id: string }>(collection)
    const filtered = items.filter(item => item.id !== id)
    if (filtered.length === items.length) return false
    dbFile.write(collection, filtered)
    return true
  },
}

// Initialize with default data if files don't exist
export const initializeDB = async () => {
  try {
    // Initialize projects if empty
    const projects = await db.read('projects')
    if (projects.length === 0) {
      const { projects: defaultProjects } = require('@/data/projects')
      await db.write('projects', defaultProjects)
    }
    
    // Initialize skills if empty
    const skills = await db.read('skills')
    if (skills.length === 0) {
      const { skills: defaultSkills } = require('@/data/skills')
      const allSkills = defaultSkills.map((skill: any, index: number) => ({
        ...skill,
        id: `skill-${index + 1}`,
      }))
      await db.write('skills', allSkills)
    }
    
    // Initialize experience if empty
    const experience = await db.read('experience')
    if (experience.length === 0) {
      const { experiences } = require('@/data/experience')
      await db.write('experience', experiences)
    }
    
    // Initialize services if empty
    const services = await db.read('services')
    if (services.length === 0) {
      const { services: defaultServices } = require('@/data/services')
      await db.write('services', defaultServices)
    }
    
    // Initialize blog if empty
    const blog = await db.read('blog')
    if (blog.length === 0) {
      const { blogPosts } = require('@/data/blog')
      await db.write('blog', blogPosts)
    }
    
    // Initialize site config
    const config = await db.read('config')
    if (config.length === 0) {
      const { SITE_CONFIG } = require('@/lib/constants')
      const configWithId = { ...SITE_CONFIG, id: 'config' }
      await db.write('config', [configWithId])
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

