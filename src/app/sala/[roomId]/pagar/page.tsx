"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPlayer, getPlayers, getRoom, pay } from "@/lib/api";
import { convertToBRL, convertValueToAPI, inputMask } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";
import { Player, Room } from "../page";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    roomId: string;
  };
}
export default function Home({ params }: Props) {
  const [room, setRoom] = useState<Room>();
  const [player, setPlayer] = useState<Player>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [receiver, setReceiver] = useState("");
  const [transactionValue, setTransactionValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  const verifyRoom = useCallback(async () => {
    try {
      const { roomId } = params;
      const res = await getRoom(roomId);
      const data = await res;
      setRoom(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Erro ao buscar a sala");
      console.error("Erro ao buscar a sala:", error);
    }
  }, [params]);

  const verifyPlayer = async () => {
    try {
      const playerId = localStorage.getItem("playerId");
      if (playerId) {
        const res = await getPlayer(playerId);
        const data = await res;
        setPlayer(data);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao buscar o usuário");
      console.error("Erro ao buscar o usuário:", error);
    }
  };

  const getAllPlayers = useCallback(async () => {
    try {
      const { roomId } = params;
      const res = await getPlayers(roomId);
      const data = await res;
      setPlayers(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Erro ao buscar jogador(es)");
      console.error("Erro ao buscar jogador(es):", error);
    }
  }, [params]);

  useEffect(() => {
    verifyRoom();
    verifyPlayer();
    getAllPlayers();
  }, [player, room, verifyRoom, getAllPlayers]);
  
  const handleInputMask = (value: string) => {
    setTransactionValue(inputMask(value));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
        roomId: room?.id,
        playerId: player?.id,
        receiverId: receiver,
        amount: convertValueToAPI(transactionValue),
        description: "Pagamento entre jogadores"
    }

    try{
        if (body.roomId && body.playerId && body.receiverId) {
          await pay(body.roomId, body.playerId, body.receiverId, body.amount, body.description);
        } else {
          toast.error("Erro: Dados insuficientes para realizar a transferência");
        }
        setIsLoading(false);
        toast.success("Transferência realizada com sucesso");
        router.replace(`/sala/${room?.id}`);
    }
    catch(error){
        setIsLoading(false);
        toast.error("Erro ao realizar transferência");
        console.error("Erro ao realizar transferência:", error);
    }

  }
  return (
    <main className="flex flex-col w-full h-dvh">
      <div className="w-full h-[84px] flex items-center px-3 justify-between bg-purple-800">
        <h1 className="text-zinc-50 text-xl font-extrabold">Pagar</h1>
        <Link href={`/sala/${room?.id}`}>
          <IoMdClose className="text-zinc-50 text-2xl" />
        </Link>
      </div>

      <div className="flex flex-col px-2 mt-4 h-full">
        <h1 className="text-zinc-50 text-2xl font-bold mb-2">
          Qual é o valor da transferência?
        </h1>
        <div className="mb-5 flex items-center">
          <span className="text-zinc-50 text-sm">Saldo da conta: &nbsp;</span>
          <span className="text-zinc-50 text-sm font-bold flex">
            {isLoading ? <Skeleton className="w-16 h-4 bg-zinc-700" /> : player?.balance
              ? convertToBRL(player?.balance)
              : convertToBRL(0.0)}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
          <div className="flex flex-col">
            <Input                            
                className="text-zinc-50 text-2xl font-extrabold mb-4 w-full h-16 focus:outline-none focus:border-zinc-50 !outline-none border-x-0 border-t-0 rounded-none border-zinc-500"
                placeholder="R$ 0,00"
                value={transactionValue}
                onChange={(e) => handleInputMask(e.target.value)}
            />

            <Select onValueChange={(e) => setReceiver(e)} defaultValue={receiver}>
                <SelectTrigger className="text-zinc-50 text-2xl font-extrabold mb-4 w-full h-16 focus:outline-none focus:border-zinc-50 !outline-none border-x-0 border-t-0 rounded-none border-zinc-500">
                <SelectValue placeholder="Quem vai receber?" />
                </SelectTrigger>
                <SelectContent>
                {players.map((receiverPlayer) => (
                    <SelectItem value={receiverPlayer.id} key={receiverPlayer.id}>
                    {receiverPlayer.username}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select> 
          </div>

          <Button className="mb-8 w-full h-12 font-bold text-base" disabled={transactionValue.length === 0 || receiver.length === 0 || isLoading} type="submit">Transferir</Button>
        </form>
      </div>
    </main>
  );
}
