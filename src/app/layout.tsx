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
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <header className="border-b">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Task Manager</h1>
              <MainNav />
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 py-8 h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
