"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    router.push(`/sala/${roomId}`);

    console.log(roomId);
  }
  
  return (
    <main className="flex flex-col items-center justify-center h-dvh gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
        <Input className="w-[280px] h-12 text-zinc-50 text-center uppercase" placeholder="L14D8" value={roomId} onChange={e => setRoomId(e.target.value)} maxLength={5}/>
        <Button className="w-[280px] h-12" disabled={roomId.length < 8} type="submit">Entrar na sala</Button>
      </form>
    </main>
  );
}
