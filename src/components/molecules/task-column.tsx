"use client";
import { Button } from "@/components/atoms/button";
import { Card, CardDescription, CardTitle } from "@/components/atoms/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/atoms/dialog";
import { EnumStatus, Task } from "@/store/types";
import { useTaskStore } from "@/store/useTaskStore";
import { Copy, Star, StarOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditTaskModal } from "./edit-task-modal";
import { LabelBadge } from "./label-badge";

export function TaskColumn({ title, tasks }: { title: string; tasks: Task[] }) {
  const { deleteTask, updateTask, duplicateTask, toggleFavorite } =
    useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const moveTask = (newStatus: EnumStatus, taskId: string) => {
    console.log("moveTask", newStatus, taskId);
    const task = tasks.find((t) => t.id === taskId);
    if (task) updateTask({ ...task, status: newStatus });
    closeTaskDetails();
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
      closeTaskDetails();
    }
  };

  const handleFavorite = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newFavoriteState = !task.favorite;
      updateTask({ ...task, favorite: newFavoriteState });

      await toggleFavorite(taskId);
    } catch (error) {
      console.log(error);
      const task = tasks.find((t) => t.id === taskId);
      if (task) updateTask({ ...task, favorite: !task.favorite });
      alert("Erro ao atualizar favorito!");
    }
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
    setTaskToDelete(null);
    setShowEditModal(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full md:w-96 lg:w-80">
      <h2 className="text-lg font-bold mb-4">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md relative transition-all duration-200 ease-in-out hover:hover:scale-105"
          >
            <button
              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                setTaskToDelete(task.id);
              }}
            >
              <Trash2 size={16} />
            </button>

            <div
              onClick={() => setSelectedTask(task)}
              className="cursor-pointer"
            >
              <CardTitle className="text-base md:text-lg">
                {task.title}
              </CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {task.description}
              </CardDescription>
              <div className="mt-2 text-sm text-gray-500">
                Prioridade: {task.priority}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedTask} onOpenChange={closeTaskDetails}>
        <DialogContent className="max-w-[95vw] md:max-w-[80vw] lg:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes da Tarefa</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.labels?.map((label) => (
                    <LabelBadge key={label.id} label={label} />
                  ))}
                  {!selectedTask.labels?.length && (
                    <span className="text-gray-400">
                      Nenhuma label associada
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    moveTask(EnumStatus.IN_PROGRESS, selectedTask.id)
                  }
                  className="w-full"
                >
                  Mover para Em Progresso
                </Button>
                <Button
                  variant="outline"
                  onClick={() => moveTask(EnumStatus.DONE, selectedTask.id)}
                  className="w-full"
                >
                  Mover para Concluído
                </Button>
                <Button
                  variant="outline"
                  onClick={() => duplicateTask(selectedTask.id)}
                  className="w-full"
                >
                  <Copy size={16} className="mr-1" /> Duplicar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFavorite(selectedTask.id)}
                  className="w-full"
                >
                  {selectedTask.favorite ? (
                    <>
                      <StarOff className="h-4 w-4 text-yellow-500 mr-1" />
                      Remover Favorito
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 text-gray-400 mr-1" />
                      Adicionar Favorito
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="w-full"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setTaskToDelete(selectedTask.id)}
                  className="w-full"
                >
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modais */}
      {showEditModal && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <Dialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Tem certeza que deseja excluir esta tarefa?
            </p>
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setTaskToDelete(null)}
                className="w-full"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="w-full"
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}