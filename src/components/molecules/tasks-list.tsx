"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { useEffect } from "react";
import { CreateTaskForm } from "./create-task-form";
import { TaskBoard } from "./tasks-board";

export function TaskList() {
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); 

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Gerenciador de Tarefas</h1>
        <CreateTaskForm />
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <TaskBoard />
      </div>
    </>
  );
}
