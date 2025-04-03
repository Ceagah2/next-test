import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.color) {
      return NextResponse.json(
        { error: "Nome e cor são obrigatórios" },
        { status: 400 }
      );
    }

    const newLabel = await prisma.label.create({
      data: {
        name: data.name,
        color: data.color,
      },
    });

    return NextResponse.json(newLabel, { status: 201 });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar label",
      },
      { status: 500 }
    );
  }
}
