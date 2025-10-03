import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for page creation/update
const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  content: z.any(), // JSON content
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  language: z.string().optional(),
  publishedAt: z.string().optional(),
});

// GET /api/admin/pages - List all pages with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const language = searchParams.get("language") || "ALL";
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { metaTitle: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status !== "ALL") {
      where.status = status;
    }

    if (language !== "ALL") {
      where.language = language;
    }

    // Get total count for pagination
    const total = await prisma.page.count({ where });

    // Get pages with pagination
    const pages = await prisma.page.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}

// POST /api/admin/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = pageSchema.parse(body);

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "A page with this slug already exists" },
        { status: 400 },
      );
    }

    // For now, use a hardcoded user ID - in production, get from session/JWT
    const createdBy = "clr0x1x1x00000x1x1x1x1x1"; // Replace with actual user ID from auth

    const pageData = {
      title: validatedData.title,
      slug: validatedData.slug,
      content: validatedData.content,
      metaTitle: validatedData.metaTitle,
      metaDescription: validatedData.metaDescription,
      keywords: validatedData.keywords || [],
      status: validatedData.status || "DRAFT",
      language: validatedData.language || "en",
      createdBy,
      publishedAt:
        (validatedData.status || "DRAFT") === "PUBLISHED" &&
        validatedData.publishedAt
          ? new Date(validatedData.publishedAt)
          : (validatedData.status || "DRAFT") === "PUBLISHED"
            ? new Date()
            : null,
    };

    const page = await prisma.page.create({
      data: pageData,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: createdBy,
        action: "CREATE_PAGE",
        entity: "page",
        entityId: page.id,
        details: {
          title: page.title,
          status: page.status,
          language: page.language,
        },
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error: any) {
    if (error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/pages - Bulk update pages
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageIds, action, data } = body;

    if (!pageIds || !Array.isArray(pageIds) || pageIds.length === 0) {
      return NextResponse.json(
        { error: "Page IDs are required" },
        { status: 400 },
      );
    }

    let updateData: any = {};
    const userId = "clr0x1x1x00000x1x1x1x1x1"; // Replace with actual user ID

    switch (action) {
      case "publish":
        updateData = {
          status: "PUBLISHED",
          publishedAt: new Date(),
        };
        break;
      case "draft":
        updateData = {
          status: "DRAFT",
          publishedAt: null,
        };
        break;
      case "archive":
        updateData = {
          status: "ARCHIVED",
          publishedAt: null,
        };
        break;
      case "update":
        if (data) {
          updateData = data;
        }
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update pages
    const result = await prisma.page.updateMany({
      where: {
        id: { in: pageIds },
      },
      data: updateData,
    });

    // Log bulk activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: `BULK_${action.toUpperCase()}_PAGES`,
        entity: "page",
        details: {
          pageIds,
          action,
          count: result.count,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully updated ${result.count} pages`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error bulk updating pages:", error);
    return NextResponse.json(
      { error: "Failed to update pages" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/pages - Bulk delete pages
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageIds = searchParams.get("ids")?.split(",") || [];

    if (pageIds.length === 0) {
      return NextResponse.json(
        { error: "Page IDs are required" },
        { status: 400 },
      );
    }

    const userId = "clr0x1x1x00000x1x1x1x1x1"; // Replace with actual user ID

    // Get page titles for logging
    const pages = await prisma.page.findMany({
      where: { id: { in: pageIds } },
      select: { id: true, title: true },
    });

    // Delete pages
    const result = await prisma.page.deleteMany({
      where: {
        id: { in: pageIds },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: "BULK_DELETE_PAGES",
        entity: "page",
        details: {
          pageIds,
          pages: pages.map((p: any) => ({ id: p.id, title: p.title })),
          count: result.count,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.count} pages`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error deleting pages:", error);
    return NextResponse.json(
      { error: "Failed to delete pages" },
      { status: 500 },
    );
  }
}
