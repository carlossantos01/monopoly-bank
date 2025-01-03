import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const roomId = searchParams.get("roomId");

        if (!roomId) {
            return NextResponse.json({ error: "Id da sala é obrigatório" }, { status: 400 });
        }

        const room = await prisma.player.findMany({
            where: {
                roomId,
            },
        });

        if (!room) {
            return NextResponse.json({ error: "Jogador(es) não encontrado(s)" }, { status: 404 });
        }

        return NextResponse.json(room);
    } catch (error) {
        console.error("Erro ao buscar jogador(es):", error);
        return NextResponse.json({ error: "Erro ao buscar Jogador(es)" }, { status: 500 });
    }
}
