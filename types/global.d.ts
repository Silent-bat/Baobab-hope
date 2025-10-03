// Global TypeScript declarations for missing dependencies

declare module "@prisma/client" {
  export interface User {
    id: string;
    email: string;
    name: string | null;
    password: string;
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "USER";
    avatar: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Page {
    id: string;
    title: string;
    slug: string;
    content: any;
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string[];
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    language: string;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }

  export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featuredImage: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string[];
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    language: string;
    readTime: number | null;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }

  export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    featuredImage: string | null;
    gallery: string[];
    location: string | null;
    startDate: Date | null;
    endDate: Date | null;
    status: "PLANNING" | "ACTIVE" | "COMPLETED" | "PAUSED" | "CANCELLED";
    category: string;
    goalAmount: any; // Decimal
    raisedAmount: any; // Decimal
    currency: string;
    beneficiaries: number | null;
    volunteers: number | null;
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string[];
    language: string;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }

  export interface ActivityLog {
    id: string;
    userId: string | null;
    action: string;
    entity: string | null;
    entityId: string | null;
    details: any;
    ipAddress: string | null;
    userAgent: string | null;
    timestamp: Date;
  }

  export interface UserSession {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
  }

  export class PrismaClient {
    user: {
      findUnique(args: any): Promise<User | null>;
      findMany(args?: any): Promise<User[]>;
      create(args: any): Promise<User>;
      update(args: any): Promise<User>;
      delete(args: any): Promise<User>;
      deleteMany(args: any): Promise<{ count: number }>;
      updateMany(args: any): Promise<{ count: number }>;
      count(args?: any): Promise<number>;
      upsert(args: any): Promise<User>;
    };

    page: {
      findUnique(args: any): Promise<Page | null>;
      findMany(args?: any): Promise<Page[]>;
      create(args: any): Promise<Page>;
      update(args: any): Promise<Page>;
      delete(args: any): Promise<Page>;
      deleteMany(args: any): Promise<{ count: number }>;
      updateMany(args: any): Promise<{ count: number }>;
      count(args?: any): Promise<number>;
      upsert(args: any): Promise<Page>;
    };

    blogPost: {
      findUnique(args: any): Promise<BlogPost | null>;
      findMany(args?: any): Promise<BlogPost[]>;
      create(args: any): Promise<BlogPost>;
      update(args: any): Promise<BlogPost>;
      delete(args: any): Promise<BlogPost>;
      deleteMany(args: any): Promise<{ count: number }>;
      updateMany(args: any): Promise<{ count: number }>;
      count(args?: any): Promise<number>;
      upsert(args: any): Promise<BlogPost>;
    };

    blogCategory: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      upsert(args: any): Promise<any>;
    };

    blogTag: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      upsert(args: any): Promise<any>;
    };

    project: {
      findUnique(args: any): Promise<Project | null>;
      findMany(args?: any): Promise<Project[]>;
      create(args: any): Promise<Project>;
      update(args: any): Promise<Project>;
      delete(args: any): Promise<Project>;
      deleteMany(args: any): Promise<{ count: number }>;
      updateMany(args: any): Promise<{ count: number }>;
      count(args?: any): Promise<number>;
      upsert(args: any): Promise<Project>;
    };

    projectUpdate: {
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
    };

    donation: {
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      count(args?: any): Promise<number>;
    };

    event: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      upsert(args: any): Promise<any>;
    };

    eventAttendee: {
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
    };

    newsletterSubscriber: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      upsert(args: any): Promise<any>;
    };

    volunteerApplication: {
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
    };

    contactMessage: {
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
    };

    mediaFile: {
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
    };

    translation: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      upsert(args: any): Promise<any>;
    };

    setting: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      upsert(args: any): Promise<any>;
    };

    pageView: {
      create(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      count(args?: any): Promise<number>;
    };

    activityLog: {
      create(args: any): Promise<ActivityLog>;
      findMany(args?: any): Promise<ActivityLog[]>;
    };

    userSession: {
      create(args: any): Promise<UserSession>;
      findUnique(args: any): Promise<UserSession | null>;
      findMany(args?: any): Promise<UserSession[]>;
      delete(args: any): Promise<UserSession>;
      deleteMany(args: any): Promise<{ count: number }>;
    };

    $disconnect(): Promise<void>;
    $connect(): Promise<void>;
    $transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T>;

    constructor(options?: {
      log?: string[];
      datasources?: {
        db?: {
          url?: string;
        };
      };
    });
  }
}

declare module "jose" {
  export class SignJWT {
    constructor(payload: any);
    setProtectedHeader(header: any): SignJWT;
    setIssuedAt(): SignJWT;
    setExpirationTime(exp: string): SignJWT;
    sign(secret: Uint8Array): Promise<string>;
  }

  export function jwtVerify(
    jwt: string,
    secret: Uint8Array,
  ): Promise<{
    payload: any;
    protectedHeader: any;
  }>;
}

declare module "bcryptjs" {
  export function hash(data: string, rounds: number): Promise<string>;
  export function compare(data: string, hash: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
  export function hashSync(data: string, rounds: number): string;
  export function compareSync(data: string, hash: string): boolean;
  export function genSaltSync(rounds?: number): string;
}

declare module "zod" {
  export class ZodError extends Error {
    errors: Array<{
      code: string;
      expected?: any;
      received?: any;
      path: (string | number)[];
      message: string;
    }>;
  }

  export class ZodString {
    min(length: number, message?: string): ZodString;
    max(length: number, message?: string): ZodString;
    regex(pattern: RegExp, message?: string): ZodString;
    optional(): ZodOptional<ZodString>;
    default(value: string): ZodDefault<ZodString>;
    parse(data: unknown): string;
    safeParse(
      data: unknown,
    ): { success: true; data: string } | { success: false; error: ZodError };
  }

  export class ZodNumber {
    min(value: number, message?: string): ZodNumber;
    max(value: number, message?: string): ZodNumber;
    optional(): ZodOptional<ZodNumber>;
    default(value: number): ZodDefault<ZodNumber>;
    parse(data: unknown): number;
    safeParse(
      data: unknown,
    ): { success: true; data: number } | { success: false; error: ZodError };
  }

  export class ZodBoolean {
    optional(): ZodOptional<ZodBoolean>;
    default(value: boolean): ZodDefault<ZodBoolean>;
    parse(data: unknown): boolean;
    safeParse(
      data: unknown,
    ): { success: true; data: boolean } | { success: false; error: ZodError };
  }

  export class ZodArray<T> {
    optional(): ZodOptional<ZodArray<T>>;
    default(value: T[]): ZodDefault<ZodArray<T>>;
    parse(data: unknown): T[];
    safeParse(
      data: unknown,
    ): { success: true; data: T[] } | { success: false; error: ZodError };
  }

  export class ZodObject<T> {
    optional(): ZodOptional<ZodObject<T>>;
    parse(data: unknown): T;
    safeParse(
      data: unknown,
    ): { success: true; data: T } | { success: false; error: ZodError };
  }

  export class ZodEnum<T> {
    optional(): ZodOptional<ZodEnum<T>>;
    default(value: T): ZodDefault<ZodEnum<T>>;
    parse(data: unknown): T;
    safeParse(
      data: unknown,
    ): { success: true; data: T } | { success: false; error: ZodError };
  }

  export class ZodUnion<T> {
    optional(): ZodOptional<ZodUnion<T>>;
    parse(data: unknown): T;
    safeParse(
      data: unknown,
    ): { success: true; data: T } | { success: false; error: ZodError };
  }

  export class ZodAny {
    optional(): ZodOptional<ZodAny>;
    parse(data: unknown): any;
    safeParse(
      data: unknown,
    ): { success: true; data: any } | { success: false; error: ZodError };
  }

  export class ZodOptional<T> {
    parse(data: unknown): T | undefined;
    safeParse(
      data: unknown,
    ):
      | { success: true; data: T | undefined }
      | { success: false; error: ZodError };
  }

  export class ZodDefault<T> {
    parse(data: unknown): T;
    safeParse(
      data: unknown,
    ): { success: true; data: T } | { success: false; error: ZodError };
  }

  export const z: {
    string(): ZodString;
    number(): ZodNumber;
    boolean(): ZodBoolean;
    date(): ZodAny;
    array<T>(schema: any): ZodArray<T>;
    object<T extends Record<string, any>>(
      shape: T,
    ): ZodObject<{
      [K in keyof T]: any;
    }>;
    enum<T extends readonly [string, ...string[]]>(
      values: T,
    ): ZodEnum<T[number]>;
    union<T extends readonly [any, ...any[]]>(types: T): ZodUnion<any>;
    any(): ZodAny;
    unknown(): ZodAny;
    void(): ZodAny;
    null(): ZodAny;
    undefined(): ZodAny;
    literal<T extends string | number | boolean>(value: T): ZodAny;
    record<T>(valueType: any): ZodAny;
    tuple<T extends readonly any[]>(schemas: T): ZodAny;
    ZodError: typeof ZodError;
  };

  export { z as default };
}

// Global type augmentations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      JWT_SECRET: string;
      SUPER_ADMIN_EMAIL: string;
      SUPER_ADMIN_PASSWORD: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }

  var prisma: import("@prisma/client").PrismaClient | undefined;
}

export {};
