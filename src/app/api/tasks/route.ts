import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: { subtasks: true },
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("🔥 ERRO AO BUSCAR TASKS:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  const existingTask = await prisma.task.findFirst({
    where: { title: body.title.toLowerCase() },
  });

  if (existingTask) {
    return NextResponse.json(
      { message: "Já existe uma tarefa com esse título!" },
      { status: 400 }
    );
  }

  const newTask = await prisma.task.create({
    data: {
      title: body.title,
      priority: body.priority,
      status: body.status,
      description: body.description
    },
  });

  return NextResponse.json(newTask);
}