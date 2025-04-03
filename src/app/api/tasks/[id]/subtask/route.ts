import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const subtasks = await prisma.subtask.findMany({
    where: { taskId: params.id },
  });
  return NextResponse.json(subtasks);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const newSubtask = await prisma.subtask.create({
    data: { title: body.title, completed: false, taskId: params.id },
  });
  return NextResponse.json(newSubtask);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; subtaskId: string } }
) {
  const subtask = await prisma.subtask.findUnique({
    where: { id: params.subtaskId },
  });
  if (!subtask) {
    return NextResponse.json(
      { error: "Subtask não encontrada" },
      { status: 404 }
    );
  }

  const updatedSubtask = await prisma.subtask.update({
    where: { id: params.subtaskId },
    data: { completed: !subtask.completed },
  });

  return NextResponse.json(updatedSubtask);
}
