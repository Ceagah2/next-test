import { create } from "zustand";

export type Task = {
  id: number;
  title: string;
  status: "A Fazer" | "Em andamento" | "Concluída";
  priority: "Alta" | "Média" | "Baixa"
};

type TaskStore = {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  duplicateTask: (id: number) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [
    { id: 1, title: "Tarefa 1", status: "A Fazer", priority: "Alta" },
    { id: 2, title: "Tarefa 2", status: "Concluída", priority: "Média" },
  ],
  fetchTasks: async () => {
    const res = await fetch("/api/tasks");
    set({ tasks: await res.json() });
  },
  addTask: async (task: Omit<Task, "id">) => {},
  deleteTask: async (id: number) => {},
  toggleFavorite: async (id: number) => {},
  duplicateTask: async (id: number) => {},
}));