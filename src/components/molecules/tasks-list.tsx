"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { useEffect, useState } from "react";
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
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <TaskBoard />
      </div>
    </>
  );
}
