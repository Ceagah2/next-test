"use client";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { EnumPriority, EnumStatus } from "@/store/types";
import { Task, useTaskStore } from "@/store/useTaskStore";

import { useEffect, useState } from "react";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const { updateTask } = useTaskStore();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<string>(task.priority);
  const [status, setStatus] = useState<string>(task.status);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setStatus(task.status);
  }, [task]);

  const handleSubmit = async () => {
    const updatedTask = {
      ...task,
      title,
      description,
      priority: priority as EnumPriority,
      status: status as EnumStatus,
    };

    await updateTask(updatedTask);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar Tarefa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Descrição da tarefa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HIGH">Alta</SelectItem>
              <SelectItem value="MEDIUM">Média</SelectItem>
              <SelectItem value="LOW">Baixa</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} className="w-full">
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
