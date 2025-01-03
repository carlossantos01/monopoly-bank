import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const roomId = searchParams.get("roomId");

        if (!roomId) {
            return NextResponse.json({ error: "Id da sala é obrigatório" }, { status: 400 });
        }

        const room = await prisma.room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!room) {
            return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
        }

        return NextResponse.json(room);
    } catch (error) {
        console.error("Erro ao buscar a sala:", error);
        return NextResponse.json({ error: "Erro ao buscar a sala" }, { status: 500 });
    }
}
