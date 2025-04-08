'use client';

import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-green-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold">Clerk Auth Demo</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <SignedIn>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </SignedIn>
          </ul>
        </nav>
        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal"/>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}