import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 max-w-md bg-white px-4 py-3 md:mx-auto">
      <div className="flex items-start justify-between gap-2.5">
        <h1 className="text-text text-xl font-bold">Oiwai</h1>
        <Button className="h-auto rounded-full px-4 py-1.5 text-xs font-bold">
          CREATE EVENT
        </Button>
      </div>
    </header>
  );
}
