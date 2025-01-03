"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getPlayer, getRoom, getTransactions } from "@/lib/api";
import { convertToBRL } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { toast } from "sonner";
import { FaArrowTurnUp, FaArrowTurnDown } from "react-icons/fa6";

interface Props {
  params: {
    roomId: string;
  };
}

export interface Room {
  id: string;
  createdAt: string;
}

export interface Player {
  id: string;
  username: string;
  roomId: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
    id: string;
    senderId: string;
    receiverId: string;
    amount: number;
    description: string;
    createdAt: string;
}

export default function Home({ params }: Props) {
  const [room, setRoom] = useState<Room>();
  const [player, setPlayer] = useState<Player>();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  const verifyRoom = async () => {
    setIsLoading(true);
    try {
      const { roomId } = await params;
      const res = await getRoom(roomId);
      const data = await res;
      setRoom(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Erro ao buscar a sala");
      console.error("Erro ao buscar a sala:", error);
      router.replace("/sala");
    }
  };

  const verifyPlayer = async () => {
    setIsLoading(true);
    try {
      const playerId = localStorage.getItem("playerId");
      if (playerId) {
        const res = await getPlayer(playerId);
        const data = await res;
        const resTransactions = await getTransactions(data.id);
        const dataTransactions = await resTransactions;
        setPlayer(data);
        setTransactions(dataTransactions);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao buscar o usuário");
      console.error("Erro ao buscar o usuário:", error);
      router.replace("/sala");
    }
  };

  useEffect(() => {
    if (!room && !player) {
      verifyRoom();
      verifyPlayer();
    }
  }, []);

  return (
    <main className="flex flex-col h-dvh gap-6">
      <div className="w-full h-[84px] flex items-center px-3 justify-between bg-purple-800">
        <h1 className="text-zinc-50 text-2xl font-extrabold">MBank</h1>
        <div>
            <h1 className="text-zinc-50 font-semibold flex items-center gap-2">
              Player: {isLoading ? <Skeleton className="w-16 h-4" /> : player?.username }
            </h1>
          <h1 className="text-zinc-50 flex items-center gap-2 font-semibold">Sala: {isLoading ? <Skeleton className="w-16 h-4" /> : room?.id}</h1>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3">
        <span className="text-zinc-50 font-bold">Conta</span>
        <span className="text-zinc-50 font-bold text-xl">
          {isLoading ? <Skeleton className="w-[150px] h-7 bg-zinc-700" /> : player?.balance ? convertToBRL(player?.balance) : "R$ 0,00"}
        </span>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/sala/${room?.id}/pagar`}
          className="flex flex-col items-center gap-1 px-3"
        >
          <div className="flex items-center justify-center gap-2 w-16 h-16 rounded-full bg-zinc-600">
            <FaMoneyBillTransfer className="text-zinc-50 w-10" />
          </div>
          <span className="text-zinc-50 text-sm font-bold">Pagar</span>
        </Link>
      </div>
        <div className="flex flex-col gap-2 px-3">
            <span className="text-zinc-50 font-bold">Transações</span>
            <div className="flex flex-col gap-2">
            {transactions.map((transaction) => (
                <div key={transaction.id} className="flex flex-col  px-3 py-2 bg-zinc-600 rounded-md">
                    <div className="flex justify-between items-center text-zinc-50">
                        {transaction.senderId === player?.id ? <FaArrowTurnUp className="text-red-500" /> : <FaArrowTurnDown className="text-green-500" />}
                        {transaction.senderId === player?.id ? <span>Transferência Enviada</span> : <span>Transferência Recebida</span> }
                        <span className="text-zinc-50 font-bold">{convertToBRL(transaction.amount)}</span>
                    </div>
                </div>
            ))}
            </div>
        </div>
    </main>
  );
}
