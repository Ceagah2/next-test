"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../atoms/button";
import { CreateTaskForm } from "./create-task-form";
import { TaskBoard } from "./tasks-board";

export function TaskList() {
  const [isMounted, setIsMounted] = useState(false);
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    setIsMounted(true);
    fetchTasks();
  }, [fetchTasks]);

  if (!isMounted) return null;

  return (
    <>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-4">Gerenciador de Tarefas</h1>
          <CreateTaskForm />
        </div>

        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            Ver Dashboard Analytics
            <ArrowUpRightFromSquare className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <TaskBoard />
      </div>
    </>
  );
}
