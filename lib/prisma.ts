// import { PrismaClient } from '../app/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@/app/generated/prisma/client"

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

//const prisma = globalForPrisma.prisma || new PrismaClient()
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma