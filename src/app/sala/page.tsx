"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPlayer, getRoom } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try{
      await verifyRoom();
      await handleCreatePlayer();
      router.push(`/sala/${roomId.toUpperCase()}`);
    }catch(error){
      console.error("Erro ao entrar na sala:", error);
    }
  }

  async function verifyRoom() {
    try {
      const room = await getRoom(roomId.toUpperCase());
      console.log(room);
      toast.success("Sala encontrada");
    } catch (error) {
      toast.error("Erro ao buscar a sala");
      console.error("Erro ao buscar a sala:", error);
    }
  }

  async function handleCreatePlayer() {
    try {
      const player = await createPlayer(username, roomId.toUpperCase());
      const data = await player.json();
      localStorage.setItem("playerId", data.id);
      console.log(player);
    } catch (error) {
      toast.error("Erro ao criar usuário");
      console.error("Erro ao criar sala:", error);
    }
  }
  
  return (
    <main className="flex flex-col items-center justify-center h-dvh gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
        <Input className="w-[280px] h-12 text-zinc-50 text-center" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} maxLength={12}/>
        <Input className="w-[280px] h-12 text-zinc-50 text-center uppercase" placeholder="ID Sala" value={roomId} onChange={e => setRoomId(e.target.value)} maxLength={5}/>
        <Button className="w-[280px] h-12" disabled={roomId.length < 5 || username.length === 0} type="submit">Entrar na sala</Button>
      </form>
    </main>
  );
}
