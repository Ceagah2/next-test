import { MainNav } from "@/components/molecules/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Sistema de gerenciamento de tarefas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Task Manager</h1>
            <MainNav />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
