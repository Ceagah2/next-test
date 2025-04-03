"use client";

import { getStatusColor } from "@/lib/task-helpers";
import { EnumStatus } from "@/store/types";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  getStatusColor(EnumStatus.DONE).split(" ")[0],
  getStatusColor(EnumStatus.IN_PROGRESS).split(" ")[0],
  getStatusColor(EnumStatus.TO_DO).split(" ")[0],
].map((color) => color.replace("bg-", "").replace("-100", "-600"));

interface TasksPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function TasksPieChart({ data }: TasksPieChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: "24px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
