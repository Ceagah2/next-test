"use client";
import { EnumStatus } from "@/store/types";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const STATUS_COLORS = {
  [EnumStatus.DONE]: "#16a34a", 
  [EnumStatus.IN_PROGRESS]: "#ca8a04", 
  [EnumStatus.TO_DO]: "#4b5563", 
};

interface TasksPieChartProps {
  data: Array<{
    name: string;
    value: number;
    status: EnumStatus;
  }>;
}

export function TasksPieChart({ data }: TasksPieChartProps) {
  return (
    <div className="h-[300px] w-full lg:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => (
              <div className="bg-white p-2 rounded-lg shadow-lg border">
                <p className="font-medium">{payload?.[0]?.name}</p>
                <p className="text-sm">Quantidade: {payload?.[0]?.value}</p>
              </div>
            )}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: "20px",
            }}
            formatter={(value) => {
              const status = data.find((d) => d.name === value)?.status;
              return (
                <span style={{ color: STATUS_COLORS[status as EnumStatus] }}>
                  {value}
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
