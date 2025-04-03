"use client";
import { create } from "zustand";
import { EnumPriority, EnumStatus } from "./types";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: EnumPriority;
  status: EnumStatus;
  subtasks: Subtask[];
  favorite?: boolean;
}

type TaskStore = {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "subtasks" | "favorite">) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
  duplicateTask: (taskId: string) => Promise<void>;
  toggleFavorite: (taskId: string) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    set({ tasks, loading: false });
  },

  addTask: async (task) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.message);
      return;
    }
    const newTask = await res.json();
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },

  deleteTask: async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  updateTask: async (updatedTask: Task) => {
    const res = await fetch(`/api/tasks/${updatedTask.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.message);
      return;
    }
    const taskFromBackend = await res.json();
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskFromBackend.id ? taskFromBackend : task
      ),
    }));
  },

  duplicateTask: async (taskId: string) => {
    const taskToDuplicate = get().tasks.find((task) => task.id === taskId);
    if (!taskToDuplicate) return;
    const { ...rest } = taskToDuplicate;
    const duplicatedTask = {
      ...rest,
      title: taskToDuplicate.title + " (Cópia)",
    };
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(duplicatedTask),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const error = await res.json();
      alert(error.message);
      return;
    }
    const newTask = await res.json();
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  toggleFavorite: async (taskId: string) => {
    const task = get().tasks.find((task) => task.id === taskId);
    if (!task) return;
    const updatedTask = { ...task, favorite: !task.favorite };
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    }));
  },
}));
