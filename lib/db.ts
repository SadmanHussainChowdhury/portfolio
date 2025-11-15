/**
 * Simple JSON-based database for portfolio data
 * In production, replace with MongoDB, PostgreSQL, or another database
 */

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data', 'db')
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

const getFilePath = (collection: string) => path.join(DATA_DIR, `${collection}.json`)

export const db = {
  // Read data from JSON file
  read<T>(collection: string): T[] {
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
    ensureDataDir()
    const filePath = getFilePath(collection)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  },

  // Find one item by ID
  findOne<T extends { id: string }>(collection: string, id: string): T | null {
    const items = this.read<T>(collection)
    return items.find(item => item.id === id) || null
  },

  // Create new item
  create<T extends { id: string }>(collection: string, item: T): T {
    const items = this.read<T>(collection)
    items.push(item)
    this.write(collection, items)
    return item
  },

  // Update item
  update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | null {
    const items = this.read<T>(collection)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return null
    items[index] = { ...items[index], ...updates }
    this.write(collection, items)
    return items[index]
  },

  // Delete item
  delete(collection: string, id: string): boolean {
    const items = this.read<{ id: string }>(collection)
    const filtered = items.filter(item => item.id !== id)
    if (filtered.length === items.length) return false
    this.write(collection, filtered)
    return true
  },
}

// Initialize with default data if files don't exist
export const initializeDB = () => {
  ensureDataDir()
  
  // Initialize projects if empty
  if (db.read('projects').length === 0) {
    const { projects } = require('@/data/projects')
    db.write('projects', projects)
  }
  
  // Initialize skills if empty
  if (db.read('skills').length === 0) {
    const { skills } = require('@/data/skills')
    const allSkills = skills.map((skill: any, index: number) => ({
      ...skill,
      id: `skill-${index + 1}`,
    }))
    db.write('skills', allSkills)
  }
  
  // Initialize experience if empty
  if (db.read('experience').length === 0) {
    const { experiences } = require('@/data/experience')
    db.write('experience', experiences)
  }
  
  // Initialize services if empty
  if (db.read('services').length === 0) {
    const { services } = require('@/data/services')
    db.write('services', services)
  }
  
  // Initialize blog if empty
  if (db.read('blog').length === 0) {
    const { blogPosts } = require('@/data/blog')
    db.write('blog', blogPosts)
  }
  
  // Initialize site config
  if (db.read('config').length === 0) {
    const { SITE_CONFIG } = require('@/lib/constants')
    const configWithId = { ...SITE_CONFIG, id: 'config' }
    db.write('config', [configWithId])
  }
}

