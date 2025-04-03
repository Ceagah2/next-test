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
import { useTaskStore } from "@/store/useTaskStore";
import { useState } from "react";

const PriorityMap = {
  Alta: EnumPriority.HIGH,
  Média: EnumPriority.MEDIUM,
  Baixa: EnumPriority.LOW,
} as const;

export function CreateTaskModal() {
  const { addTask } = useTaskStore();
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<string>("Média");
  const [description, setDescription] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

 const handleSubmit = async () => {
   if (!title.trim()) return;

   const newTask = {
     title,
     priority: PriorityMap[priority as keyof typeof PriorityMap],
     status: EnumStatus.TO_DO,
     description,
     subtasks: [],
   };

   try {
     await addTask(newTask);
     setTitle("");
     setPriority("Média");
     setDescription("");
     setIsOpen(false);
   } catch (error) {
     alert((error as Error).message || "Erro ao criar a tarefa!");
   }
 };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          Adicionar Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
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
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} className="w-full">
            Criar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
