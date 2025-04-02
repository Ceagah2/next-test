import { create } from "zustand";
import { EnumPriority, EnumStatus } from "./types";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: EnumStatus;
  priority: EnumPriority;
};

type TaskStore = {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  updateTask: (status: EnumStatus, taskId: number) => Promise<void>;

  // toggleFavorite: (id: number) => Promise<void>;
  duplicateTask: (id: number) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  fetchTasks: async () => {
    const res = await fetch("/api/tasks");
    set({ tasks: await res.json() });
  },

  addTask: async (task) => {
    const newTask = { ...task, id: Date.now() };
    set({ tasks: [...get().tasks, newTask] });

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: { "Content-Type": "application/json" },
    });
  },

  deleteTask: async (id) => {
    set({ tasks: get().tasks.filter((task) => task.id !== id) });

    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },
  updateTask: async (status: EnumStatus, taskId: number) => {
    const taskToUpdate = get().tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, status };
    set({
      tasks: get().tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      ),
    });

    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: { "Content-Type": "application/json" },
    });
  },

  duplicateTask: async (id) => {
    const taskToDuplicate = get().tasks.find((task) => task.id === id);
    if (!taskToDuplicate) return;

    const duplicatedTask = {
      ...taskToDuplicate,
      id: Date.now(),
      title: taskToDuplicate.title + " (Cópia)",
    };
    set({ tasks: [...get().tasks, duplicatedTask] });

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(duplicatedTask),
      headers: { "Content-Type": "application/json" },
    });
  },
}));
