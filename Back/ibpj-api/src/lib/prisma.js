import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.__ibpjPrisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__ibpjPrisma = prisma;
}

export default prisma;
