"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ProbabilityPanel({ probs }: { probs: Record<string, number> }) {
  const data = Object.entries(probs).map(([bit, p]) => ({ bit, p: +(p * 100).toFixed(2) }))
  return (
    <ChartContainer
      config={{
        p: { label: "Probability (%)", color: "hsl(192 85% 49%)" },
      }}
      className="h-[320px] rounded-lg border border-white/10 bg-black/30"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="bit" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="p" fill="hsl(192 85% 49%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
