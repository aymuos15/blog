"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface SliceControlsProps {
  onSliceChange: (sliceExpression: string) => void
  className?: string
}

const PRESET_SLICES = [
  { label: "First Row", value: "[0]", description: "Select first row" },
  { label: "Last Row", value: "[-1]", description: "Select last row" },
  { label: "Rows 1-3", value: "[1:3]", description: "Select rows 1 to 2" },
  { label: "First Column", value: "[:, 0]", description: "Select first column" },
  { label: "Last Column", value: "[:, -1]", description: "Select last column" },
  { label: "Columns 1-3", value: "[:, 1:3]", description: "Select columns 1 to 2" },
  { label: "Every 2nd Row", value: "[::2]", description: "Select every second row" },
  { label: "Center 2x2", value: "[1:3, 1:3]", description: "Select center region" },
]

export function SliceControls({ onSliceChange, className }: SliceControlsProps) {
  const [customSlice, setCustomSlice] = useState("")
  const [error, setError] = useState("")

  const handlePresetClick = (slice: string) => {
    setCustomSlice(slice)
    setError("")
    onSliceChange(slice)
  }

  const handleCustomApply = () => {
    if (!customSlice.trim()) {
      setError("Please enter a slice expression")
      return
    }
    setError("")
    onSliceChange(customSlice)
  }

  const handleInputChange = (value: string) => {
    setCustomSlice(value)
    setError("")
  }

  return (
    <div className={cn("w-full max-w-2xl space-y-4", className)}>
      {/* Preset Buttons */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_SLICES.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Custom Slice</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSlice}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomApply()}
            placeholder="e.g., [0:2, 1:3] or [::2, :]"
            className={cn(
              "flex-1 px-3 py-2 text-sm border rounded-md bg-background",
              error ? "border-red-500" : "border-border"
            )}
          />
          <button
            onClick={handleCustomApply}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Syntax Help */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-md">
        <p className="font-medium">Syntax:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li><code>[n]</code> - Single row n</li>
          <li><code>[start:stop]</code> - Rows from start to stop-1</li>
          <li><code>[::step]</code> - Every step-th row</li>
          <li><code>[:, n]</code> - Single column n</li>
          <li><code>[rows, cols]</code> - Combine row and column slices</li>
        </ul>
      </div>
    </div>
  )
}
