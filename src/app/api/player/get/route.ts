import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get("playerId");

        if (!playerId) {
            return NextResponse.json({ error: "Id do jogador é obrigatório" }, { status: 400 });
        }

        const room = await prisma.player.findUnique({
            where: {
                id: playerId,
            },
        });

        if (!room) {
            return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 });
        }

        return NextResponse.json(room);
    } catch (error) {
        console.error("Erro ao buscar a sala:", error);
        return NextResponse.json({ error: "Erro ao buscar Jogador" }, { status: 500 });
    }
}
