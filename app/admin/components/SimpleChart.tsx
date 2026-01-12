"use client";

import { useState, useEffect } from "react";

interface ChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  type: "bar" | "line" | "doughnut";
  height?: number;
}

export function SimpleChart({ data, title, type, height = 300 }: ChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className={`bg-gray-100 animate-pulse rounded`} style={{ height }} />
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  if (type === "bar") {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4" style={{ height }}>
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div
                  className={`h-6 rounded-full ${item.color || "bg-red-600"} transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "doughnut") {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="20"
              />
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage * 5.03} 502`;
                const strokeDashoffset = -cumulativePercentage * 5.03;
                cumulativePercentage += percentage;

                return (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={item.color || `hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
          <div className="ml-8 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
                />
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Line chart (simplified version)
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y, i) => (
            <line
              key={i}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Line path */}
          <polyline
            fill="none"
            stroke="#dc2626"
            strokeWidth="3"
            points={data
              .map((item, i) => 
                `${(i / (data.length - 1)) * 100}%,${100 - (item.value / maxValue) * 100}%`
              )
              .join(" ")}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Data points */}
          {data.map((item, i) => (
            <circle
              key={i}
              cx={`${(i / (data.length - 1)) * 100}%`}
              cy={`${100 - (item.value / maxValue) * 100}%`}
              r="4"
              fill="#dc2626"
              className="transition-all duration-1000 ease-out"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, i) => (
            <span key={i} className="text-xs text-gray-500">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
