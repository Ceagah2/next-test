"use client";
import { useTaskStore } from "@/store/useTaskStore";
import { TaskColumn } from "./task-column";

export function TaskBoard() {
  const { tasks } = useTaskStore();

  const columns = [
    { title: "A Fazer", status: "TODO" },
    { title: "Em Progresso", status: "IN_PROGRESS" },
    { title: "Concluída", status: "DONE" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {columns.map((column) => (
          <TaskColumn
            key={column.status}
            title={column.title}
            tasks={tasks.filter((task) => task.status === column.status)}
          />
        ))}
      </div>
    </div>
  );
}
