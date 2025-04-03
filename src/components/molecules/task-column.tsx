"use client";

import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { EnumStatus } from "@/store/types";
import { Task, useTaskStore } from "@/store/useTaskStore";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, CardDescription, CardTitle } from "../atoms/card";

export function TaskColumn({
  title,
  tasks,
}: {
  title: string;
  tasks: Task[];
  status: string;
}) {
  const { deleteTask, updateTask, addSubtask, toggleSubtaskCompletion } =
    useTaskStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleDelete = () => {
    console.log(taskToDelete);
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleMoveTask = (newStatus: EnumStatus, taskId: string) => {
    updateTask(newStatus, taskId);
    setSelectedTask(null);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="bg-white p-3 rounded-lg shadow flex flex-col relative cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                setTaskToDelete(task.id);
                setIsDeleteModalOpen(true);
              }}
            >
              <Trash2 size={16} />
            </button>
            <CardTitle>{task.title}</CardTitle>
            <div>
              <span className="font-bold">Descrição da tarefa: </span>
              <CardDescription>{task.description}</CardDescription>
            </div>
            <CardDescription>Prioridade: {task.priority}</CardDescription>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Tarefa</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{selectedTask.title}</h3>
              <p>{selectedTask.description}</p>
              <p>
                <strong>Prioridade:</strong> {selectedTask.priority}
              </p>
              <h4 className="text-md font-bold">Subtarefas</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      selectedTask?.subtasks?.length
                        ? (selectedTask.subtasks.filter((s) => s.completed)
                            .length /
                            selectedTask.subtasks.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <ul>
                {selectedTask?.subtasks?.map((subtask) => (
                  <li key={subtask.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {
                        toggleSubtaskCompletion(selectedTask.id, subtask.id);
                        setSelectedTask((prev) =>
                          prev
                            ? {
                                ...prev,
                                subtasks: prev.subtasks.map((s) =>
                                  s.id === subtask.id
                                    ? { ...s, completed: !s.completed }
                                    : s
                                ),
                              }
                            : prev
                        );
                      }}
                    />
                    <span
                      className={
                        subtask.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Nova sub-tarefa"
                  className="border p-2 rounded w-full"
                />
                <Button
                  onClick={() => {
                    if (newSubtaskTitle.trim()) {
                      const newSubtask = {
                        id: crypto.randomUUID(),
                        title: newSubtaskTitle,
                        completed: false,
                      };

                      addSubtask(selectedTask.id, newSubtask);

                      setSelectedTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              subtasks: [...(prev.subtasks || []), newSubtask],
                            }
                          : prev
                      );

                      setNewSubtaskTitle("");
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleMoveTask(EnumStatus.IN_PROGRESS, selectedTask.id)
                  }
                >
                  Mover para Em Progresso
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleMoveTask(EnumStatus.DONE, selectedTask.id)
                  }
                >
                  Mover para Concluído
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  setTaskToDelete(selectedTask.id);
                  setIsDeleteModalOpen(true)}
                }
              >
                Excluir
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tem certeza?</DialogTitle>
          </DialogHeader>
          <p>Deseja realmente excluir esta tarefa?</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
