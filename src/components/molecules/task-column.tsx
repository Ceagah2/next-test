"use client";

import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/atoms/dialog";
import { Task, useTaskStore } from "@/store/useTaskStore";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, CardDescription, CardTitle } from "../atoms/card";

export function TaskColumn({ title, tasks }: { title: string; tasks: Task[] }) {
  const { deleteTask } = useTaskStore();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="bg-white p-3 rounded-lg shadow flex flex-col relative"
          >
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => setTaskToDelete(task)}
            >
              <Trash2 size={18} />
            </button>
            <CardTitle>{task.title}</CardTitle>
            <div>
              <span className="font-bold">Descrição da tarefa: </span>
              <CardDescription>{task.description}</CardDescription>
            </div>
            <CardDescription>Prioridade: {task.priority}</CardDescription>
            <Button variant="outline" size="sm">
              Mover
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir a tarefa &quot;{taskToDelete?.title}
            &quot;?
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setTaskToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (taskToDelete) deleteTask(taskToDelete.id);
                setTaskToDelete(null);
              }}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
