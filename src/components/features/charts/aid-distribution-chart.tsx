'use client'

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface AidDistributionChartProps {
  data: {
    name: string
    value: number
    color: string
  }[]
}

export function AidDistributionChart({ data }: AidDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        Veri yok
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={105}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
          formatter={(value) => {
            const numValue = typeof value === 'number' ? value : 0
            return [`%${numValue}`, 'Oran'] as const
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
