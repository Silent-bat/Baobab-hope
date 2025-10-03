import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for page update
const pageUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(),
  content: z.any().optional(), // JSON content
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  language: z.string().optional(),
  publishedAt: z.string().optional(),
});

// GET /api/admin/pages/[id] - Get a specific page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/pages/[id] - Update a specific page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const validatedData = pageUpdateSchema.parse(body);

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingPage.slug) {
      const slugConflict = await prisma.page.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: "A page with this slug already exists" },
          { status: 400 },
        );
      }
    }

    // Handle published date logic
    let updateData: any = { ...validatedData };

    if (validatedData.status === "PUBLISHED") {
      if (validatedData.publishedAt) {
        updateData.publishedAt = new Date(validatedData.publishedAt);
      } else if (existingPage.status !== "PUBLISHED") {
        updateData.publishedAt = new Date();
      }
    } else if (
      validatedData.status &&
      ["DRAFT", "ARCHIVED"].includes(validatedData.status)
    ) {
      updateData.publishedAt = null;
    }

    // Update the page
    const updatedPage = await prisma.page.update({
      where: { id: params.id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    const userId = "clr0x1x1x00000x1x1x1x1x1"; // Replace with actual user ID from auth
    await prisma.activityLog.create({
      data: {
        userId,
        action: "UPDATE_PAGE",
        entity: "page",
        entityId: updatedPage.id,
        details: {
          title: updatedPage.title,
          status: updatedPage.status,
          changes: validatedData,
        },
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    if (error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/pages/[id] - Delete a specific page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Delete the page
    await prisma.page.delete({
      where: { id: params.id },
    });

    // Log activity
    const userId = "clr0x1x1x00000x1x1x1x1x1"; // Replace with actual user ID from auth
    await prisma.activityLog.create({
      data: {
        userId,
        action: "DELETE_PAGE",
        entity: "page",
        entityId: params.id,
        details: {
          title: existingPage.title,
          slug: existingPage.slug,
        },
      },
    });

    return NextResponse.json({
      message: "Page deleted successfully",
      page: existingPage,
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/pages/[id] - Partial update (e.g., status change only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    let updateData: any = {};

    switch (action) {
      case "publish":
        updateData = {
          status: "PUBLISHED",
          publishedAt: new Date(),
        };
        break;
      case "unpublish":
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
      case "duplicate":
        // Create a duplicate of the page
        const duplicateData = {
          title: `${existingPage.title} (Copy)`,
          slug: `${existingPage.slug}-copy-${Date.now()}`,
          content: existingPage.content,
          metaTitle: existingPage.metaTitle,
          metaDescription: existingPage.metaDescription,
          keywords: existingPage.keywords,
          status: "DRAFT" as const,
          language: existingPage.language,
          createdBy: "clr0x1x1x00000x1x1x1x1x1", // Replace with actual user ID
          publishedAt: null,
        };

        const duplicatedPage = await prisma.page.create({
          data: duplicateData,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        // Log activity
        const userId = "clr0x1x1x00000x1x1x1x1x1"; // Replace with actual user ID
        await prisma.activityLog.create({
          data: {
            userId,
            action: "DUPLICATE_PAGE",
            entity: "page",
            entityId: duplicatedPage.id,
            details: {
              originalPageId: params.id,
              originalTitle: existingPage.title,
              newTitle: duplicatedPage.title,
            },
          },
        });

        return NextResponse.json(duplicatedPage);

      default:
        if (data) {
          updateData = data;
        } else {
          return NextResponse.json(
            { error: "Invalid action or missing data" },
            { status: 400 },
          );
        }
    }

    // Update the page
    const updatedPage = await prisma.page.update({
      where: { id: params.id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity (if not duplicate action)
    if (action !== "duplicate") {
      const userId = "clr0x1x1x00000x1x1x1x1x1"; // Replace with actual user ID
      await prisma.activityLog.create({
        data: {
          userId,
          action: `${action.toUpperCase()}_PAGE`,
          entity: "page",
          entityId: updatedPage.id,
          details: {
            title: updatedPage.title,
            action,
            changes: updateData,
          },
        },
      });
    }

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 },
    );
  }
}
