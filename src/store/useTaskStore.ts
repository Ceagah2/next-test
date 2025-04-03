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
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (status: EnumStatus, taskId: string) => Promise<void>;
  addSubtask: (taskId: string, subtask: Subtask) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  fetchTasks: async () => {
    const res = await fetch("/api/tasks");
    set({ tasks: await res.json() });
  },

  addTask: async (task) => {
    const newTask = { ...task, id: Date.now().toString() };
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
  updateTask: async (status: EnumStatus, taskId: string) => {
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
  addSubtask: (taskId, subtask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: [...(task.subtasks || []), subtask] }
          : task
      ),
    })),

  toggleSubtaskCompletion: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            }
          : task
      ),
    })),
}));
