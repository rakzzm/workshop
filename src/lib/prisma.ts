import { PrismaClient } from '@prisma/client'

// Create Prisma client with automatic error handling
const globalForPrisma = global as unknown as { prisma: PrismaClient }

const createSafePrisma = () => {
  const client = new PrismaClient()
  
  // No database on Vercel? Return a mock client
  const handler = {
    get(target: any, prop: string) {
      if (prop === '$connect' || prop === '$disconnect') {
        return () => Promise.resolve()
      }
      
      // For model queries, return a proxy that catches errors
      if (typeof target[prop] === 'object' && target[prop] !== null) {
        return new Proxy(target[prop], {
          get(modelTarget: any, method: string) {
            if (typeof modelTarget[method] === 'function') {
              return async (...args: any[]) => {
                try {
                  return await modelTarget[method](...args)
                } catch (error) {
                  console.log(`Database unavailable for ${prop}.${method}`)
                  // Return empty data based on method
                  if (method === 'findMany') return []
                  if (method === 'findUnique' || method === 'findFirst') return null
                  if (method === 'count') return 0
                  return null
                }
              }
            }
            return modelTarget[method]
          }
        })
      }
      
      return target[prop]
    }
  }
  
  return new Proxy(client, handler)
}

export const prisma = globalForPrisma.prisma || createSafePrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
