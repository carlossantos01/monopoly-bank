import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-dvh gap-3">
      <Link href="/sala">
        <Button className="w-[280px] h-12">Entrar em uma sala</Button>
      </Link>
      <div className="w-[100px] flex justify-center items-center gap-3 opacity-50">
        <Separator className="text-zinc-50 w-full"></Separator>
        <span className="text-sm text-zinc-50 font-bold">ou</span>
        <Separator className="text-zinc-50"></Separator>
      </div>
      <Link href="/criar-sala">
        <Button className="w-[280px] h-12">Criar nova sala</Button>
      </Link>
    </main>
  );
}
