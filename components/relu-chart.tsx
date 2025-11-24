"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label, ReferenceDot } from "recharts"
import {
  ChartContainer,
} from "@/components/ui/chart"

// Generate ReLU data points
const generateReluData = (minX: number, maxX: number) => {
  const data = []
  for (let x = minX; x <= maxX; x += 0.2) {
    data.push({
      x: x,
      y: Math.max(0, x), // ReLU function: max(0, x)
    })
  }
  return data
}

const chartConfig = {
  y: {
    label: "f(x)",
    color: "#14120b",
  },
}

interface ReluChartProps {
  minX?: number
  maxX?: number
  highlightedPoint?: number | null
}

export function ReluChart({ minX = -3, maxX = 3, highlightedPoint = null }: ReluChartProps) {
  const chartData = generateReluData(minX, maxX)
  const highlightedY = highlightedPoint !== null ? Math.max(0, highlightedPoint) : null

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
        <CartesianGrid stroke="#d4d4d1" strokeWidth={1} />
        <XAxis
          dataKey="x"
          domain={[minX, maxX]}
          type="number"
        >
          <Label value="x" position="insideBottomRight" offset={-5} />
        </XAxis>
        <YAxis
          domain={[minX, maxX]}
        >
          <Label value="f(x)" angle={-90} position="insideLeft" offset={15} />
        </YAxis>
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
          formatter={(value) => value.toFixed(4)}
          labelFormatter={(value) => `x: ${value.toFixed(2)}`}
        />
        <Line
          type="linear"
          dataKey="y"
          stroke="#14120b"
          strokeWidth={2.5}
          dot={false}
        />
        {highlightedY !== null && (
          <ReferenceDot x={highlightedPoint} y={highlightedY} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
        )}
      </LineChart>
    </ChartContainer>
  )
}
