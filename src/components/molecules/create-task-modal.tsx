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
import { LabelBadge } from "@/components/molecules/label-badge";
import { EnumPriority, EnumStatus } from "@/store/types";
import { useTaskStore } from "@/store/useTaskStore";
import { useEffect, useState } from "react";

const PriorityMap = {
  Alta: EnumPriority.HIGH,
  Média: EnumPriority.MEDIUM,
  Baixa: EnumPriority.LOW,
} as const;

export function CreateTaskModal() {
  const { addTask, labels, fetchLabels } = useTaskStore();
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<string>("Média");
  const [description, setDescription] = useState<string>("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const newTask = {
      title,
      priority: PriorityMap[priority as keyof typeof PriorityMap],
      status: EnumStatus.TO_DO,
      description,
      labels: labels.filter((label) => selectedLabels.includes(label.id)),
      subtasks: [],
    };

    try {
      await addTask(newTask);
      setTitle("");
      setPriority("Média");
      setDescription("");
      setSelectedLabels([]);
      setIsOpen(false);
    } catch (error) {
      alert((error as Error).message || "Erro ao criar a tarefa!");
    }
  };

  const handleLabelSelect = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
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

          <div className="space-y-2">
            <p className="text-sm font-medium">Labels</p>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <LabelBadge
                  key={label.id}
                  label={label}
                  onRemove={() => handleLabelSelect(label.id)}
                  className={
                    selectedLabels.includes(label.id)
                      ? "opacity-100 cursor-pointer"
                      : "opacity-50 hover:opacity-75 cursor-pointer"
                  }
                />
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Criar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
