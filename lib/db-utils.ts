/**
 * Database utility functions
 */

// Helper function to remove duplicates based on id
export function removeDuplicates<T extends { id?: string }>(items: T[]): T[] {
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

