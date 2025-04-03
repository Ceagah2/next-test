import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: { id: string } } 
) {
  try {
    const { id } = context.params; 
    const data = await request.json();

    console.log("API Recebido:", { id, data });

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

    console.log("Banco Atualizado:", updatedTask);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Task excluída" });
}
