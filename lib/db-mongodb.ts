/**
 * MongoDB-based database for portfolio data
 * Used in production (Vercel) where file system is read-only
 */

// Dynamic import to handle missing package gracefully
let MongoClient: any
let Db: any
let Collection: any
let Document: any

try {
  const mongodb = require('mongodb')
  MongoClient = mongodb.MongoClient
  Db = mongodb.Db
  Collection = mongodb.Collection
  Document = mongodb.Document
} catch (error) {
  console.warn('⚠️ MongoDB package not installed. Run: npm install mongodb')
  // Export empty functions in development if package is missing
  if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    console.warn('⚠️ Using file system database in development')
  }
}

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
// Optimize for serverless: reduce connection timeout and enable retry
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
}

let client: any = null
let clientPromise: Promise<any> | null = null

if (uri && MongoClient) {
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
    // In production/serverless mode, use a global variable to reuse connections
    // This is important for Vercel serverless functions
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
      console.log('🔌 MongoDB client created for serverless environment')
    }
    clientPromise = globalWithMongo._mongoClientPromise
  }
} else {
  if (process.env.VERCEL === '1') {
    console.error('❌ MONGODB_URI is not set in Vercel environment!')
    console.error('📝 Please add MONGODB_URI to Vercel environment variables:')
    console.error('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables')
    console.error('   2. Add MONGODB_URI with your MongoDB connection string')
    console.error('   3. Redeploy your application')
  }
}

async function getDb(): Promise<any> {
  if (!MongoClient) {
    throw new Error('MongoDB package not installed. Please run: npm install mongodb')
  }
  if (!clientPromise) {
    const errorMsg = process.env.VERCEL === '1' 
      ? 'MongoDB not configured in Vercel. Please set MONGODB_URI environment variable in Vercel dashboard.'
      : 'MongoDB not configured. Please set MONGODB_URI environment variable.'
    throw new Error(errorMsg)
  }
  try {
    const client = await clientPromise
    return client.db('portfolio')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function getCollection<T extends any>(name: string): Promise<any> {
  const db = await getDb()
  return db.collection<T>(name)
}

// Helper function to remove duplicates based on id
function removeDuplicates<T extends { id?: string }>(items: T[]): T[] {
  if (!items || !Array.isArray(items)) return []
  const seen = new Set<string>()
  return items.filter((item) => {
    const id = item.id
    if (!id) return true // Keep items without id
    if (seen.has(id)) {
      return false // Duplicate
    }
    seen.add(id)
    return true
  })
}

export const dbMongo = {
  // Read data from MongoDB
  async read<T extends any>(collection: string): Promise<T[]> {
    if (!MongoClient) {
      throw new Error('MongoDB package not installed. Please run: npm install mongodb')
    }
    try {
      const coll = await getCollection<T>(collection)
      const result = await coll.find({}).toArray() as T[]
      
      // Remove duplicates based on id field
      const uniqueResult = removeDuplicates(result)
      
      if (result.length !== uniqueResult.length) {
        console.warn(`⚠️ Found ${result.length - uniqueResult.length} duplicate(s) in ${collection}, removed`)
      }
      
      console.log(`✅ Read ${uniqueResult.length} unique items from ${collection} collection`)
      return uniqueResult
    } catch (error) {
      console.error(`❌ Error reading ${collection} from MongoDB:`, error)
      if (error instanceof Error) {
        console.error(`   Message: ${error.message}`)
      }
      throw error // Re-throw to let caller handle it
    }
  },

  // Write data to MongoDB (replace all)
  async write<T extends any>(collection: string, data: T[]): Promise<void> {
    if (!MongoClient) {
      throw new Error('MongoDB package not installed. Please run: npm install mongodb')
    }
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
  async findOne<T extends any & { id: string }>(collection: string, id: string): Promise<T | null> {
    if (!MongoClient) {
      throw new Error('MongoDB package not installed. Please run: npm install mongodb')
    }
    try {
      const coll = await getCollection<T>(collection)
      return await coll.findOne({ id } as any) as T | null
    } catch (error) {
      console.error(`Error finding ${collection} in MongoDB:`, error)
      return null
    }
  },

  // Create new item
  async create<T extends any & { id: string }>(collection: string, item: T): Promise<T> {
    if (!MongoClient) {
      throw new Error('MongoDB package not installed. Please run: npm install mongodb')
    }
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
  async update<T extends any & { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    if (!MongoClient) {
      throw new Error('MongoDB package not installed. Please run: npm install mongodb')
    }
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
    if (!MongoClient) {
      throw new Error('MongoDB package not installed. Please run: npm install mongodb')
    }
    try {
      const coll = await getCollection<any & { id: string }>(collection)
      const result = await coll.deleteOne({ id } as any)
      return result.deletedCount > 0
    } catch (error) {
      console.error(`Error deleting ${collection} in MongoDB:`, error)
      return false
    }
  },
}
