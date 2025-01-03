import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { amount, roomId, senderId, receiverId, description } = await request.json();

    const result = await prisma.$transaction(async (prisma) => {
        const sender = await prisma.player.update({
          where: { id: senderId },
          data: {
            balance: {
              decrement: amount, 
            },
          },
        });
  
        if (sender.balance < 0) {
          throw new Error("Saldo insuficiente");
        }
  
        await prisma.player.update({
          where: { id: receiverId },
          data: {
            balance: {
              increment: amount, 
            },
          },
        });
  
        const transaction = await prisma.transaction.create({
          data: {
            amount,
            roomId,
            senderId,
            receiverId,
            description,
          },
        });
  
        return transaction;
      });

      return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao criar transferencia:", error);
    return NextResponse.json(
      { error: "Erro ao criar a transferencia" },
      { status: 500 }
    );
  }
}
