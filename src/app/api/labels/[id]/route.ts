import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    await prisma.label.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erro ao excluir label:", e);
    return NextResponse.json(
      { error: "Não foi possível excluir a label" },
      { status: 500 }
    );
  }
}
