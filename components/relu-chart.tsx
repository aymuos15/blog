"use client"

import { useState, useEffect } from "react"
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

interface ReluChartProps {
  minX?: number
  maxX?: number
  highlightedPoint?: number | null
}

export function ReluChart({ minX = -3, maxX = 3, highlightedPoint = null }: ReluChartProps) {
  const chartData = generateReluData(minX, maxX)
  const highlightedY = highlightedPoint !== null ? Math.max(0, highlightedPoint) : null
  const [colors, setColors] = useState({
    foreground: "#000000",
    background: "#ffffff",
    border: "#e5e5e5"
  })

  useEffect(() => {
    // Get computed CSS variables
    const root = document.documentElement
    const style = getComputedStyle(root)

    const foreground = style.getPropertyValue('--foreground').trim()
    const background = style.getPropertyValue('--background').trim()
    const border = style.getPropertyValue('--border').trim()

    setColors({
      foreground: foreground || "#000000",
      background: background || "#ffffff",
      border: border || "#e5e5e5"
    })

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const style = getComputedStyle(root)
      const foreground = style.getPropertyValue('--foreground').trim()
      const background = style.getPropertyValue('--background').trim()
      const border = style.getPropertyValue('--border').trim()

      setColors({
        foreground: foreground || "#000000",
        background: background || "#ffffff",
        border: border || "#e5e5e5"
      })
    })

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const chartConfig = {
    y: {
      label: "f(x)",
      color: colors.foreground,
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
        <CartesianGrid stroke={colors.border} strokeWidth={1} />
        <XAxis
          dataKey="x"
          domain={[minX, maxX]}
          type="number"
          stroke={colors.foreground}
        >
          <Label value="x" position="insideBottomRight" offset={-5} />
        </XAxis>
        <YAxis
          domain={[minX, maxX]}
          stroke={colors.foreground}
        >
          <Label value="f(x)" angle={-90} position="insideLeft" offset={15} />
        </YAxis>
        <Tooltip
          contentStyle={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
          formatter={(value) => typeof value === 'number' ? value.toFixed(4) : value}
          labelFormatter={(value) => typeof value === 'number' ? `x: ${value.toFixed(2)}` : `x: ${value}`}
        />
        <Line
          type="linear"
          dataKey="y"
          stroke={colors.foreground}
          strokeWidth={2.5}
          dot={false}
        />
        {highlightedY !== null && highlightedPoint !== null && (
          <ReferenceDot x={highlightedPoint} y={highlightedY} r={6} fill="#ef4444" stroke={colors.background} strokeWidth={2} />
        )}
      </LineChart>
    </ChartContainer>
  )
}
