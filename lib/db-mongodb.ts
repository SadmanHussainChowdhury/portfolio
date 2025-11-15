/**
 * MongoDB-based database for portfolio data
 * Used in production (Vercel) where file system is read-only
 */

import { MongoClient, Db, Collection, Document } from 'mongodb'

// MongoDB URI is optional - will fall back to file system if not provided
const getMongoUri = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI
  }
  // In production (Vercel), require MongoDB
  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    console.warn('MONGODB_URI not set in production. Some features may not work.')
    return null
  }
  return null
}

const uri = getMongoUri()
const options = {}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

async function getDb(): Promise<Db> {
  if (!clientPromise) {
    throw new Error('MongoDB not configured. Please set MONGODB_URI environment variable.')
  }
  const client = await clientPromise
  return client.db('portfolio')
}

async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb()
  return db.collection<T>(name)
}

export const dbMongo = {
  // Read data from MongoDB
  async read<T extends Document>(collection: string): Promise<T[]> {
    try {
      const coll = await getCollection<T>(collection)
      return await coll.find({}).toArray() as T[]
    } catch (error) {
      console.error(`Error reading ${collection} from MongoDB:`, error)
      return []
    }
  },

  // Write data to MongoDB (replace all)
  async write<T extends Document>(collection: string, data: T[]): Promise<void> {
    try {
      const coll = await getCollection<T>(collection)
      await coll.deleteMany({})
      if (data.length > 0) {
        await coll.insertMany(data as any)
      }
    } catch (error) {
      console.error(`Error writing ${collection} to MongoDB:`, error)
      throw error
    }
  },

  // Find one item by ID
  async findOne<T extends Document & { id: string }>(collection: string, id: string): Promise<T | null> {
    try {
      const coll = await getCollection<T>(collection)
      return await coll.findOne({ id } as any) as T | null
    } catch (error) {
      console.error(`Error finding ${collection} in MongoDB:`, error)
      return null
    }
  },

  // Create new item
  async create<T extends Document & { id: string }>(collection: string, item: T): Promise<T> {
    try {
      const coll = await getCollection<T>(collection)
      await coll.insertOne(item as any)
      return item
    } catch (error) {
      console.error(`Error creating ${collection} in MongoDB:`, error)
      throw error
    }
  },

  // Update item
  async update<T extends Document & { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const coll = await getCollection<T>(collection)
      const result = await coll.findOneAndUpdate(
        { id } as any,
        { $set: updates },
        { returnDocument: 'after' }
      )
      return result as T | null
    } catch (error) {
      console.error(`Error updating ${collection} in MongoDB:`, error)
      return null
    }
  },

  // Delete item
  async delete(collection: string, id: string): Promise<boolean> {
    try {
      const coll = await getCollection<Document & { id: string }>(collection)
      const result = await coll.deleteOne({ id } as any)
      return result.deletedCount > 0
    } catch (error) {
      console.error(`Error deleting ${collection} in MongoDB:`, error)
      return false
    }
  },
}
