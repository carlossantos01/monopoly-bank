"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoom } from "@/lib/api";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useState } from "react";
import { IoMdLink } from "react-icons/io";
import {QRCodeSVG} from 'qrcode.react';
import { toast } from "sonner";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const id = nanoid(5).toUpperCase();

    const response = await createRoom(id);

    try {
      if (!response.ok) {
        throw new Error("Erro ao criar a sala");
      }

      const data = await response.json();

      toast.success("Sala criada");
      
      setIsLoading(false);
      setRoomId(data.id);
    } catch (error) {
      toast.error("Erro ao criar a sala");
      setIsLoading(false);
      console.error(error);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-dvh gap-3">
      {roomId ? (
        <div className="flex flex-col items-center gap-3">
          <QRCodeSVG value={`${window.location.origin}/sala/${roomId}`}/>
          <Input
            className="w-[280px] h-12 text-zinc-50 text-center"
            placeholder="Código da sala"
            value={roomId}
            disabled
            maxLength={8}
          />
          <Link href={`/sala/${roomId}`}>
            <Button className="w-[280px] h-12">Entrar na sala</Button>
          </Link>
          <Button
            className="w-[280px] h-12"
            onClick={() =>
              navigator.share({
                url: `${window.location.origin}/sala/${roomId}`,
              })
            }
          >
            <IoMdLink />
            Compartilhar link
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3"
        >
          <Button className="w-[280px] h-12" type="submit" disabled={isLoading}>
            Criar sala
          </Button>
        </form>
      )}
    </main>
  );
}
