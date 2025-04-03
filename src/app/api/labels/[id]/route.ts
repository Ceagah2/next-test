import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const url = request.nextUrl;
  const id = url.pathname.split("/").pop();
  try {
    if (!id) {
      return NextResponse.json(
        { error: "ID da label é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.label.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir label:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a label" },
      { status: 500 }
    );
  }
}
