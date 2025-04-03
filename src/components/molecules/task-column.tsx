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
import { Copy, Star, StarOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, CardDescription, CardTitle } from "../atoms/card";
import { EditTaskModal } from "./edit-task-modal";

export function TaskColumn({
  title,
  tasks,
}: {
  title: string;
  tasks: Task[];
  status: string;
}) {
  const { deleteTask, updateTask, duplicateTask, toggleFavorite } =
    useTaskStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    }
  };

 const handleMoveTask = (newStatus: EnumStatus, taskId: string) => {
   const taskToUpdate = tasks.find((task) => task.id === taskId);
   if (taskToUpdate) {
     const updatedTask = { ...taskToUpdate, status: newStatus };
     updateTask(updatedTask);
   }
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

              <div className="flex flex-wrap gap-2">
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
                <Button
                  variant="outline"
                  onClick={async () => {
                    await duplicateTask(selectedTask.id);
                  }}
                >
                  <Copy size={16} className="mr-1" /> Duplicar
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await toggleFavorite(selectedTask.id);
                    setSelectedTask((prev) =>
                      prev ? { ...prev, favorite: !prev.favorite } : prev
                    );
                  }}
                >
                  {selectedTask.favorite ? (
                    <>
                      <StarOff size={16} className="mr-1" /> Desfavoritar
                    </>
                  ) : (
                    <>
                      <Star size={16} className="mr-1" /> Favoritar
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                >
                  Editar
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  setTaskToDelete(selectedTask.id);
                  setIsDeleteModalOpen(true);
                }}
              >
                Excluir
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {isEditModalOpen && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
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
