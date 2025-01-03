import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get("playerId");


        if (!playerId) {
            return NextResponse.json({ error: "Id do jogador é obrigatório" }, { status: 400 });
        }

        const room = await prisma.transaction.findMany({
            where: {
                OR: [
                    { senderId: playerId },
                    { receiverId: playerId }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!room) {
            return NextResponse.json({ error: "Transações não encontradas" }, { status: 404 });
        }

        return NextResponse.json(room);
    } catch (error) {
        console.error("Erro ao buscar transações:", error);
        return NextResponse.json({ error: "Erro ao buscar transações" }, { status: 500 });
    }
}
