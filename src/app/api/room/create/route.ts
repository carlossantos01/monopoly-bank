import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const room = await prisma.room.create({
      data: {
        id,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Erro ao criar a sala:", error);
    return NextResponse.json({ error: "Erro ao criar a sala" }, { status: 500 });
  }
}
