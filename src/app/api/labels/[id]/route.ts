import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.label.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: "Não foi possível excluir a label" },
      { status: 500 }
    );
  }
}
