import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        labels: true,
        subtasks: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(tasks ?? []);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return NextResponse.json(
      { error: "Erro no servidor ao buscar tarefas" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const { title, description, priority, status, labels } =
      await request.json();

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        labels: {
          connect: labels.map((labelId: string) => ({ id: labelId })),
        },
      },
      include: {
        labels: true,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}