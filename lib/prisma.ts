// Type-safe Prisma client with development fallback
type PrismaClientType = {
  user: any;
  page: any;
  blogPost: any;
  blogCategory: any;
  blogTag: any;
  project: any;
  projectUpdate: any;
  donation: any;
  event: any;
  eventAttendee: any;
  newsletterSubscriber: any;
  volunteerApplication: any;
  contactMessage: any;
  mediaFile: any;
  translation: any;
  setting: any;
  pageView: any;
  activityLog: any;
  userSession: any;
  $disconnect: () => Promise<void>;
  $connect: () => Promise<void>;
  $transaction: (fn: any) => Promise<any>;
};

let prisma: PrismaClientType;

// Try to import Prisma client, fallback to mock for development
try {
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientType | undefined;
  };

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} catch (error) {
  console.warn(
    "Prisma client not available, using mock client for development",
  );

  // Mock client for development/build
  const mockClient = {
    user: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
      updateMany: () => Promise.resolve({ count: 0 }),
      count: () => Promise.resolve(0),
      upsert: () => Promise.resolve({}),
    },
    page: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
      updateMany: () => Promise.resolve({ count: 0 }),
      count: () => Promise.resolve(0),
      upsert: () => Promise.resolve({}),
    },
    blogPost: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
      updateMany: () => Promise.resolve({ count: 0 }),
      count: () => Promise.resolve(0),
      upsert: () => Promise.resolve({}),
    },
    blogCategory: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      upsert: () => Promise.resolve({}),
    },
    blogTag: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      upsert: () => Promise.resolve({}),
    },
    project: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
      updateMany: () => Promise.resolve({ count: 0 }),
      count: () => Promise.resolve(0),
      upsert: () => Promise.resolve({}),
    },
    projectUpdate: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    donation: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      count: () => Promise.resolve(0),
    },
    event: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      upsert: () => Promise.resolve({}),
    },
    eventAttendee: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    newsletterSubscriber: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      upsert: () => Promise.resolve({}),
    },
    volunteerApplication: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    contactMessage: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    mediaFile: {
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    translation: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      upsert: () => Promise.resolve({}),
    },
    setting: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      upsert: () => Promise.resolve({}),
    },
    pageView: {
      create: () => Promise.resolve({}),
      findMany: () => Promise.resolve([]),
      count: () => Promise.resolve(0),
    },
    activityLog: {
      create: () => Promise.resolve({}),
      findMany: () => Promise.resolve([]),
    },
    userSession: {
      create: () => Promise.resolve({}),
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
    },
    $disconnect: () => Promise.resolve(),
    $connect: () => Promise.resolve(),
    $transaction: (fn: any) => Promise.resolve(fn()),
  };

  prisma = mockClient as PrismaClientType;
}

export { prisma };
export default prisma;

// Export types for TypeScript usage
export type { PrismaClientType };
