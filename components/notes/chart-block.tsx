"use client"

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Line, LineChart, Pie, PieChart, Scatter, ScatterChart, XAxis, YAxis,
} from "recharts"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart"
import type { ChartBlock as ChartBlockType } from "@/lib/types"

const CHART_COLORS = [
  "var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)",
  "var(--color-chart-4)", "var(--color-chart-5)",
]

const SUPPORTED_CHART_TYPES = ["bar", "line", "area", "scatter", "pie"]

export function ChartBlock({ block }: { block: ChartBlockType }) {
  const { chartType, data } = block
  const labels = data?.labels ?? []
  const datasets = data?.datasets ?? []

  // Only keep datasets whose values are all numbers
  const numericDatasets = datasets.filter((ds) =>
    ds.values.every((v) => typeof v === "number")
  )

  const isSupported =
    SUPPORTED_CHART_TYPES.includes(chartType) && numericDatasets.length > 0

  // Fallback table for unsupported types (e.g. "tree") or string-value datasets
  if (!isSupported) {
    return (
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-2 text-left font-semibold text-foreground">
                Label
              </th>
              {datasets.map((ds) => (
                <th
                  key={ds.label}
                  className="px-4 py-2 text-left font-semibold text-foreground"
                >
                  {ds.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((label, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-2 text-muted-foreground">
                  {String(label)}
                </td>
                {datasets.map((ds) => (
                  <td key={ds.label} className="px-4 py-2">
                    {String(ds.values[i] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const config: ChartConfig = {}
  numericDatasets.forEach((ds, i) => {
    config[ds.label] = {
      label: ds.label,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }
  })

  const rows = labels.map((label, i) => {
    const row: Record<string, string | number> = { name: String(label) }
    numericDatasets.forEach((ds) => {
      row[ds.label] = ds.values[i] as number
    })
    return row
  })

  function renderChart() {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={rows}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {numericDatasets.map((ds) => (
              <Bar
                key={ds.label} dataKey={ds.label}
                fill={`var(--color-${ds.label})`} radius={4}
              />
            ))}
          </BarChart>
        )
      case "area":
        return (
          <AreaChart data={rows}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {numericDatasets.map((ds) => (
              <Area
                key={ds.label} dataKey={ds.label} type="natural"
                fill={`var(--color-${ds.label})`} fillOpacity={0.2}
                stroke={`var(--color-${ds.label})`} strokeWidth={2} stackId="a"
              />
            ))}
          </AreaChart>
        )
      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            {numericDatasets.map((ds) => (
              <Scatter
                key={ds.label} name={ds.label}
                data={rows.map((r) => ({ name: r.name, y: r[ds.label] }))}
                dataKey="y" fill={`var(--color-${ds.label})`}
              />
            ))}
          </ScatterChart>
        )
      case "pie": {
        const ds = numericDatasets[0]
        const pieData = labels.map((label, i) => ({
          name: String(label),
          value: ds.values[i] as number,
        }))
        return (
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        )
      }
      case "line":
      default:
        return (
          <LineChart data={rows}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {numericDatasets.map((ds) => (
              <Line
                key={ds.label} dataKey={ds.label} type="monotone"
                stroke={`var(--color-${ds.label})`} strokeWidth={2} dot={false}
              />
            ))}
          </LineChart>
        )
    }
  }

  return (
    <ChartContainer config={config} className="aspect-[16/9] w-full">
      {renderChart()}
    </ChartContainer>
  )
}