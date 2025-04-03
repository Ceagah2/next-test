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
      console.log(error)
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
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80">
      <h2 className="text-lg font-bold mb-4">{title}</h2>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="bg-white p-3 rounded-lg shadow cursor-pointer hover:shadow-md"
            onClick={() => setSelectedTask(task)}
          >
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                setTaskToDelete(task.id);
              }}
            >
              <Trash2 size={16} />
            </button>

            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
            <div className="mt-2 text-sm text-gray-500">
              Prioridade: {task.priority}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTask} onOpenChange={closeTaskDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Tarefa</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
              <p className="text-gray-600">{selectedTask.description}</p>

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

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    moveTask(EnumStatus.IN_PROGRESS, selectedTask.id)
                  }
                >
                  Mover para Em Progresso
                </Button>
                <Button
                  variant="outline"
                  onClick={() => moveTask(EnumStatus.DONE, selectedTask.id)}
                >
                  Mover para Concluído
                </Button>
                <Button
                  variant="outline"
                  onClick={() => duplicateTask(selectedTask.id)}
                >
                  <Copy size={16} className="mr-1" /> Duplicar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFavorite(selectedTask.id)}
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
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setTaskToDelete(selectedTask.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showEditModal && selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <Dialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Tem certeza que deseja excluir esta tarefa?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setTaskToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
