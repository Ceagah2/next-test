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
}

type TaskStore = {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (status: EnumStatus, taskId: string) => Promise<void>;
  addSubtask: (taskId: string, title: string) => Promise<Subtask | null>;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set) => ({
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
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },

  updateTask: async (status: EnumStatus, taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });

    const updatedTask = await res.json();
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      ),
    }));
  },

  addSubtask: async (
    taskId: string,
    subtaskTitle: string
  ): Promise<Subtask | null> => {
    const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: subtaskTitle }),
    });

    if (!res.ok) {
      console.error("Erro ao criar subtask", await res.json());
      return null;
    }

    const newSubtask: Subtask = await res.json();

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
          : task
      ),
    }));

    return newSubtask;
  },

  toggleSubtaskCompletion: async (taskId, subtaskId) => {
    const res = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Erro ao atualizar a subtask", await res.json());
      return;
    }

    const updatedSubtask = await res.json();
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? updatedSubtask : subtask
              ),
            }
          : task
      ),
    }));
  },
}));
