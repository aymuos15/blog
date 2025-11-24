"use client"

import { cn } from "@/lib/utils"

interface TensorGridProps {
  tensor: number[][]
  selectedIndices: Set<string>
  onCellEdit?: (row: number, col: number, value: number) => void
  className?: string
}

export function TensorGrid({ tensor, selectedIndices, onCellEdit, className }: TensorGridProps) {
  const rows = tensor.length
  const cols = tensor[0]?.length || 0

  const handleCellClick = (row: number, col: number) => {
    if (!onCellEdit) return

    const input = prompt(`Enter new value for [${row}, ${col}]:`, tensor[row][col].toString())
    if (input !== null) {
      const value = parseFloat(input)
      if (!isNaN(value)) {
        onCellEdit(row, col, value)
      }
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full", className)}>
      <div className="w-full max-w-xl h-[320px] rounded-lg flex items-center justify-center overflow-hidden mx-auto">
        <div
          className="inline-grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
          }}
        >
        {tensor.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            const key = `${rowIdx},${colIdx}`
            const isSelected = selectedIndices.has(key)

            return (
              <button
                key={key}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                className={cn(
                  "w-14 h-14 flex items-center justify-center rounded border-2 font-mono text-sm transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                    : "bg-background border-border hover:border-primary/50 hover:scale-102"
                )}
                title={`[${rowIdx}, ${colIdx}] = ${value}\nClick to edit`}
              >
                {value}
              </button>
            )
          })
        )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Shape: ({rows}, {cols}) • Click cells to edit values
      </div>
    </div>
  )
}
