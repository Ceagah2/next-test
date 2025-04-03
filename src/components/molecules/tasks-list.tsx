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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Gerenciador de Tarefas
          </h1>
          <div className="lg:hidden">
            <CreateTaskForm />
          </div>
        </div>

        <div className="hidden lg:block">
          <CreateTaskForm />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm md:w-full md:max-w-5xl md:flex md:flex-col sm:p-6">
        <TaskBoard />
      </div>
    </div>
  );
}
