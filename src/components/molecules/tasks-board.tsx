"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { TaskColumn } from "./task-column";

export function TaskBoard() {
  const { tasks } = useTaskStore();

  const columns = [
    { title: "A Fazer", status: "A Fazer" },
    { title: "Em andamento", status: "Em andamento" },
    { title: "Concluída", status: "Concluída" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
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
