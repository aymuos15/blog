"use client"

import { useState } from "react"

export function ReluInteractive({
  onPointChange,
  onRangeChange,
  className,
}: {
  onPointChange: (value: number | null) => void
  onRangeChange: (min: number, max: number) => void
  className?: string
}) {
  const [singleValue, setSingleValue] = useState("")
  const [minX, setMinX] = useState("-2")
  const [maxX, setMaxX] = useState("2")

  const handleSingleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSingleValue(value)
    if (value === "") {
      onPointChange(null)
    } else {
      const num = parseFloat(value)
      if (!isNaN(num)) {
        onPointChange(num)
      }
    }
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinX(value)
    const num = parseFloat(value)
    const max = parseFloat(maxX)
    if (!isNaN(num) && !isNaN(max)) {
      onRangeChange(num, max)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMaxX(value)
    const min = parseFloat(minX)
    const num = parseFloat(value)
    if (!isNaN(min) && !isNaN(num)) {
      onRangeChange(min, num)
    }
  }

  return (
    <div className={`flex gap-4 justify-center ${className || ""}`}>
      {/* Single Point Input */}
      <div className="bg-muted p-2 px-3 rounded-lg flex items-center gap-2 text-sm">
        <label className="font-semibold text-muted-foreground">Evaluate:</label>
        <input
          type="number"
          value={singleValue}
          onChange={handleSingleValueChange}
          placeholder="x"
          className="w-20 px-2 py-1 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-foreground text-center"
          style={{ appearance: "textfield" }}
        />
        {singleValue && !isNaN(parseFloat(singleValue)) && (
          <span className="font-mono whitespace-nowrap">
            = {Math.max(0, parseFloat(singleValue)).toFixed(2)}
          </span>
        )}
      </div>

      {/* Range Inputs */}
      <div className="bg-muted p-2 px-3 rounded-lg flex items-center gap-2 text-sm">
        <label className="font-semibold text-muted-foreground">X-axis range:</label>
        <input
          type="number"
          value={minX}
          onChange={handleMinChange}
          className="w-16 px-2 py-1 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-foreground text-center"
          style={{ appearance: "textfield" }}
        />
        <span className="text-xs font-light">to</span>
        <input
          type="number"
          value={maxX}
          onChange={handleMaxChange}
          className="w-16 px-2 py-1 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-foreground text-center"
          style={{ appearance: "textfield" }}
        />
      </div>
    </div>
  )
}
