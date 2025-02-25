"use client";

import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 max-w-md bg-white px-4 py-3 md:mx-auto">
      <div className="flex items-start justify-between gap-2.5">
        <h1 className="text-xl font-bold text-text">Oiwai</h1>
        {pathname === "/" ? (
          <SignedOut>
            <SignUpButton>
              <Button className="h-auto rounded-full px-4 py-1.5 text-xs font-bold">
                CREATE EVENT
              </Button>
            </SignUpButton>
          </SignedOut>
        ) : (
          <>
            <SignedOut>
              <SignInButton>
                <Button className="h-auto rounded-full px-4 py-1.5 text-xs font-bold">
                  LOG IN
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        )}
      </div>
    </header>
  );
}
