import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json();

  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Task excluída" });
}
