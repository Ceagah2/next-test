import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const id = url.pathname.split("/").pop();
  const subtasks = await prisma.subtask.findMany({
    where: { taskId: id },
  });
  return NextResponse.json(subtasks);
}

export async function POST( request: NextRequest) {
  const url = request.nextUrl;
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  const body = await request.json();
  const newSubtask = await prisma.subtask.create({
    data: { title: body.title, completed: false, taskId: id },
  });
  return NextResponse.json(newSubtask);
}

export async function PATCH(request: NextRequest) {
  const url = request.nextUrl;
  const id = url.pathname.split("/").pop();
  const subtask = await prisma.subtask.findUnique({
    where: { id },
  });
  if (!subtask) {
    return NextResponse.json(
      { error: "Subtask não encontrada" },
      { status: 404 }
    );
  }

  const updatedSubtask = await prisma.subtask.update({
    where: { id },
    data: { completed: !subtask.completed },
  });

  return NextResponse.json(updatedSubtask);
}
