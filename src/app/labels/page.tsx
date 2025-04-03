"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { ConfirmationModal } from "@/components/molecules/confirmation-modal";
import { LabelBadge } from "@/components/molecules/label-badge";
import { predefinedColors } from "@/store/types";
import { useTaskStore } from "@/store/useTaskStore";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function LabelsPage() {
  const { labels, createLabel, deleteLabel } = useTaskStore();
  const [newLabelName, setNewLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0].value);
  const [labelToDelete, setLabelToDelete] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newLabelName) return;
   
    await createLabel({
      name: newLabelName,
      color: selectedColor,
    });
    setNewLabelName("");
  };
 if (labelToDelete !== null) {
   console.log(`Label to delete: ${labelToDelete}`);
 }
  const handleConfirmDelete = async (labelId: string) => {
    await deleteLabel(labelId);
    setLabelToDelete(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Labels</h1>

      <div className="max-w-lg mb-8">
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Nome da label"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCreate} disabled={!newLabelName}>
            Criar Label
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <p className="w-full text-sm text-muted-foreground">
            Selecione uma cor:
          </p>
          {predefinedColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`h-10 w-10 rounded-full border-2 transition-all ${
                selectedColor === color.value
                  ? "border-black scale-110 shadow-lg"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Pré-visualização:
          </span>
          <LabelBadge
            label={{
              name: newLabelName || "Exemplo",
              color: selectedColor,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {labels.map((label) => (
          <div
            key={label.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <LabelBadge label={label} />

            <ConfirmationModal
              title="Excluir Label"
              message="Tem certeza que deseja excluir esta label? Esta ação não pode ser desfeita."
              onConfirm={() => handleConfirmDelete(label.id)}
              onCancel={() => setLabelToDelete(null)}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLabelToDelete(label.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </ConfirmationModal>
          </div>
        ))}
      </div>
    </div>
  );
}
