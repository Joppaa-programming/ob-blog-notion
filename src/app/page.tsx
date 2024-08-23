import { Button } from "@/components/ui/button";
import { fetchPages } from "@/lib/notion";
import Image from "next/image";

export default async function Home() {
  // const posts = await fetchPages();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">HOME PAGE</div>
    </main>
  );
}
