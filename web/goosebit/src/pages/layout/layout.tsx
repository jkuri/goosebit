import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "./header";

export function Layout() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <Header />
      <main className="container mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 pb-16">
        <Outlet />
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
