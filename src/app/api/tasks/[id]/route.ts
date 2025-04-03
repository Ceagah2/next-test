import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const url = request.nextUrl;
  const id = url.pathname.split("/").pop();

  try {
    const data = await request.json();


    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        labels: data.labels
          ? {
              set: data.labels.map((labelId: string) => ({ id: labelId })),
            }
          : undefined,
      },
      include: { labels: true },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest) {
  const url = request.nextUrl;
  const id = url.pathname.split("/").pop();
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ message: "Task excluída" });
}
