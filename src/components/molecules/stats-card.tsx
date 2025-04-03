"use client";

import { Card } from "../atoms/card";

interface StatsCardProps {
  title: string;
  value: number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  colorClass?: string; 
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon,
  colorClass,
}: StatsCardProps) {
  const trendColor = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  }[trend || "neutral"];

  const iconColorClass = colorClass
    ? colorClass.replace("bg-", "text-").replace("-100", "-600")
    : trendColor;

  return (
    <Card className={`p-6 ${colorClass || ""}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {icon && <div className={`text-2xl ${iconColorClass}`}>{icon}</div>}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mt-4">{description}</p>
      )}
    </Card>
  );
}
