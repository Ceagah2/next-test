"use client";

import { CreateTaskForm } from "@/components/ui/create-task-form";
import { TasksTable } from "@/components/ui/tasks-table";
import { useTaskStore } from "@/store/useTaskStore";
import { useEffect } from "react";

export function TaskList() {
  const { tasks, fetchTasks } = useTaskStore();

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
        <TasksTable tasks={tasks} />
      </div>
    </>
  );
}
