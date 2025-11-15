/**
 * Script to clean up duplicate entries in MongoDB
 * Run this once to remove any existing duplicates
 */

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set')
  process.exit(1)
}

async function cleanupDuplicates() {
  // MONGODB_URI is guaranteed to be string here due to check above
  const client = new MongoClient(MONGODB_URI as string)
  
  try {
    await client.connect()
    const db = client.db('portfolio')
    
    const collections = ['projects', 'skills', 'experience', 'services', 'blog', 'config', 'messages']
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName)
      const allDocs = await collection.find({}).toArray()
      
      // Group by id
      const seen = new Map<string, any>()
      const duplicates: any[] = []
      
      for (const doc of allDocs) {
        const id = doc.id
        if (!id) continue
        
        if (seen.has(id)) {
          duplicates.push(doc._id)
        } else {
          seen.set(id, doc._id)
        }
      }
      
      if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} duplicate(s) in ${collectionName}`)
        await collection.deleteMany({ _id: { $in: duplicates } })
        console.log(`✅ Removed ${duplicates.length} duplicate(s) from ${collectionName}`)
      } else {
        console.log(`✅ No duplicates found in ${collectionName}`)
      }
    }
    
    console.log('✅ Cleanup complete')
  } catch (error) {
    console.error('Error cleaning up duplicates:', error)
  } finally {
    await client.close()
  }
}

cleanupDuplicates()

