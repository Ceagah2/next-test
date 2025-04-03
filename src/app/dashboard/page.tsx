"use client";

import { Card } from "@/components/atoms/card";
import { StatsCard } from "@/components/molecules/stats-card";
import { TasksPieChart } from "@/components/molecules/tasks-pie-chart";
import { getPriorityColor, getPriorityLabel, getStatusLabel } from "@/lib/task-helpers";
import { EnumPriority, EnumStatus } from "@/store/types";
import { useTaskStore } from "@/store/useTaskStore";

import { ArrowUp, Star } from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { tasks, fetchTasks, loading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

 const chartData = [
   {
     name: getStatusLabel(EnumStatus.DONE),
     value: tasks.filter((t) => t.status === EnumStatus.DONE).length,
     status: EnumStatus.DONE,
   },
   {
     name: getStatusLabel(EnumStatus.IN_PROGRESS),
     value: tasks.filter((t) => t.status === EnumStatus.IN_PROGRESS).length,
     status: EnumStatus.IN_PROGRESS,
   },
   {
     name: getStatusLabel(EnumStatus.TO_DO),
     value: tasks.filter((t) => t.status === EnumStatus.TO_DO).length,
     status: EnumStatus.TO_DO,
   },
 ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === EnumStatus.DONE
  ).length;
  const favoriteTasks = tasks.filter((t) => t.favorite).length;

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Produtividade</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total de Tarefas"
          value={totalTasks}
          icon={<ArrowUp className="w-6 h-6" />}
          trend="up"
        />

        <StatsCard
          title="Taxa de Conclusão"
          value={completedTasks}
          description={`${((completedTasks / totalTasks) * 100 || 0).toFixed(
            1
          )}% do total`}
        />

        <StatsCard
          title="Favoritas"
          value={favoriteTasks}
          icon={<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
          colorClass="bg-yellow-100 text-yellow-800"
        />
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Distribuição de Status</h2>
        <TasksPieChart data={chartData} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Distribuição de Prioridades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(EnumPriority).map((priority) => (
            <StatsCard
              key={priority}
              title={getPriorityLabel(priority)}
              value={tasks.filter((t) => t.priority === priority).length}
              colorClass={getPriorityColor(priority)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
