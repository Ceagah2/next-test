"use client";
import { create } from "zustand";
import { Label, Task } from "./types";


type TaskStore = {
  tasks: Task[];
  loading: boolean;
  labels: Label[];
  fetchLabels: () => Promise<void>;
  createLabel: (label: Omit<Label, "id">) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
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
  labels: [],

  fetchTasks: async () => {
    set({ loading: true });
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    set({ tasks, loading: false });
  },

  addTask: async (task) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        ...task,
        labels: task.labels?.map((label) => label.id),
      }),
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
    console.log("updateTask", updatedTask)
    try {
      const res = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          priority: updatedTask.priority,
          status: updatedTask.status,
          labels: updatedTask.labels?.map((l) => l.id),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const taskFromBackend = await res.json();

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskFromBackend.id ? taskFromBackend : task
        ),
      }));
    } catch (error) {
      console.error("Update error:", error);
      alert( "Erro ao atualizar tarefa");
    }
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
    try {
      const task = get().tasks.find((t) => t.id === taskId);
      if (!task) throw new Error("Tarefa não encontrada");

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !task.favorite }),
      });

      if (!res.ok) {
        throw new Error("Falha na atualização");
      }

      const updatedTask = await res.json();

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, favorite: updatedTask.favorite } : t
        ),
      }));

      return updatedTask;
    } catch (error) {
      console.error("Erro ao favoritar:", error);
      throw error;
    }
  },
  fetchLabels: async () => {
    const res = await fetch("/api/labels");
    set({ labels: await res.json() });
  },
  createLabel: async (label) => {
    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(label),
      });

      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${responseText}`);
      }

      try {
        const newLabel = JSON.parse(responseText);
        set((state) => ({ labels: [...state.labels, newLabel] }));
      } catch (e) {
        throw new Error("Resposta inválida do servidor", { cause: e });
      }
    } catch (error) {
      console.error("Error creating label:", error);
      alert("Erro desconhecido ao criar label");
      throw error;
    }
  },

  deleteLabel: async (labelId: string) => {
    try {
      const res = await fetch(`/api/labels/${labelId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      set((state) => ({
        labels: state.labels.filter((label) => label.id !== labelId),

        tasks: state.tasks.map((task) => ({
          ...task,
          labels: task.labels
            ? task.labels.filter((label) => label.id !== labelId)
            : [],
        })),
      }));
    } catch (error) {
      console.error("Erro ao excluir label:", error);
      alert(
        "Não foi possível excluir a label. Verifique se ela não está em uso."
      );
    }
  },
}));
