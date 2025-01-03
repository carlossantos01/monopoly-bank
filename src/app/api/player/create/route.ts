import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, roomId } = await request.json();

    const player = await prisma.player.create({
      data: {
        username,
        roomId
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error("Erro ao criar a sala:", error);
    return NextResponse.json({ error: "Erro ao criar a sala" }, { status: 500 });
  }
}
