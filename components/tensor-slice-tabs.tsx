"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { TensorGrid } from "./tensor-grid"
import { SliceControls } from "./slice-controls"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coy, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

const tensorSliceCode = `import torch

x = torch.tensor([[1,2,3,4],
                  [5,6,7,8],
                  [9,10,11,12]])

# Row slicing
x[0]        # First row
x[1:3]      # Rows 1-2

# Column slicing
x[:, 0]     # First column
x[:, 1:3]   # Columns 1-2

# Views vs Copies
view = x[0]           # Shares memory
copy = x[0].clone()   # Independent

# Boolean masking
x[x > 5]    # Elements > 5`

// Parse slice expression and return selected indices
function parseSlice(expr: string, tensor: number[][]): Set<string> {
  const selected = new Set<string>()
  const rows = tensor.length
  const cols = tensor[0]?.length || 0

  try {
    // Remove whitespace
    expr = expr.trim()

    // Handle empty or invalid
    if (!expr || !expr.startsWith('[')) return selected

    // Remove outer brackets
    const inner = expr.slice(1, -1)

    // Split by comma to get row and column parts
    const parts = inner.split(',').map(s => s.trim())

    // Parse row slice
    const rowIndices = parseSlicePart(parts[0] || ':', rows)

    // Parse column slice (if provided)
    const colIndices = parts.length > 1
      ? parseSlicePart(parts[1], cols)
      : Array.from({ length: cols }, (_, i) => i)

    // Generate selected indices
    for (const r of rowIndices) {
      for (const c of colIndices) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          selected.add(`${r},${c}`)
        }
      }
    }
  } catch (e) {
    // Return empty set on parse error
    console.error('Parse error:', e)
  }

  return selected
}

function parseSlicePart(part: string, maxLen: number): number[] {
  if (!part || part === ':') {
    // All indices
    return Array.from({ length: maxLen }, (_, i) => i)
  }

  if (!part.includes(':')) {
    // Single index
    let idx = parseInt(part)
    if (idx < 0) idx = maxLen + idx
    return [idx]
  }

  // Range slice: start:stop:step
  const [startStr, stopStr, stepStr] = part.split(':')

  const start = startStr ? parseInt(startStr) : 0
  const stop = stopStr ? parseInt(stopStr) : maxLen
  const step = stepStr ? parseInt(stepStr) : 1

  const indices: number[] = []
  for (let i = start; i < stop && i < maxLen; i += step) {
    if (i >= 0) indices.push(i)
  }

  return indices
}

export function TensorSliceTabs() {
  const [copied, setCopied] = useState(false)
  const [tensor, setTensor] = useState([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12]
  ])
  const [sliceExpression, setSliceExpression] = useState("[0]")
  const [selectedIndices, setSelectedIndices] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("simulation")
  const [heights, setHeights] = useState<Record<string, number>>({})
  const [isDark, setIsDark] = useState(false)

  const simulationRef = useRef<HTMLDivElement>(null)
  const equationRef = useRef<HTMLDivElement>(null)
  const theoryRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  const refs = {
    simulation: simulationRef,
    equation: equationRef,
    theory: theoryRef,
    code: codeRef,
  }

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const measureHeights = () => {
      const newHeights: Record<string, number> = {}
      Object.entries(refs).forEach(([key, ref]) => {
        if (ref.current) {
          newHeights[key] = ref.current.offsetHeight
        }
      })
      setHeights(newHeights)
    }

    // Measure on mount
    measureHeights()

    // Measure on window resize
    const resizeObserver = new ResizeObserver(measureHeights)
    Object.values(refs).forEach(ref => {
      if (ref.current) {
        resizeObserver.observe(ref.current)
      }
    })

    return () => resizeObserver.disconnect()
  }, [])

  // Update selected indices when slice expression changes
  useEffect(() => {
    const selected = parseSlice(sliceExpression, tensor)
    setSelectedIndices(selected)
  }, [sliceExpression, tensor])

  const currentHeight = heights[activeTab] || "auto"

  const handleCopy = () => {
    navigator.clipboard.writeText(tensorSliceCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCellEdit = (row: number, col: number, value: number) => {
    const newTensor = tensor.map((r, i) =>
      r.map((v, j) => (i === row && j === col ? value : v))
    )
    setTensor(newTensor)
  }

  const handleSliceChange = (expr: string) => {
    setSliceExpression(expr)
  }

  // Calculate result tensor
  const resultValues = Array.from(selectedIndices)
    .map(key => {
      const [r, c] = key.split(',').map(Number)
      return tensor[r][c]
    })

  const resultShape = selectedIndices.size > 0
    ? `Result: [${resultValues.join(', ')}] (${selectedIndices.size} elements)`
    : "No elements selected"

  return (
    <div className="w-full flex flex-col items-center">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div
          className="flex justify-center py-2 max-w-2xl mx-auto"
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30, duration: 0.3 }}
        >
          <TabsList>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="equation">Equation</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </motion.div>

        <motion.div
          className="relative w-full overflow-visible pt-4"
          animate={{ height: currentHeight }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <TabsContent ref={simulationRef} value="simulation" className={`!mt-0 absolute w-full transition-opacity duration-300 ${activeTab === "simulation" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-6 space-y-4">
              <TensorGrid
                tensor={tensor}
                selectedIndices={selectedIndices}
                onCellEdit={handleCellEdit}
              />

              <div className="text-sm font-mono bg-muted/50 px-4 py-2 rounded-md">
                Slice: <span className="text-primary font-semibold">{sliceExpression}</span>
              </div>

              <div className="text-sm text-muted-foreground">
                {resultShape}
              </div>

              <SliceControls onSliceChange={handleSliceChange} className="mt-4" />
            </div>
          </TabsContent>

          <TabsContent ref={equationRef} value="equation" className={`!mt-0 absolute w-full transition-opacity duration-300 ${activeTab === "equation" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="flex flex-col items-center justify-center py-2 space-y-3 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Slice Notation</p>
                <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                  <BlockMath math="\text{tensor}[\text{start}:\text{stop}:\text{step}]" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Shape Transformation</p>
                <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                  <BlockMath math="(m, n) \xrightarrow{\text{slice}} (m', n')" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">View vs Copy</p>
                <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                  <BlockMath math="T' \xrightarrow{\text{view}} T \quad \text{vs} \quad T' = \text{clone}(T)" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent ref={theoryRef} value="theory" className={`!mt-0 absolute w-full transition-opacity duration-300 ${activeTab === "theory" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="flex flex-col py-8 space-y-6 max-w-2xl mx-auto px-6 text-base leading-relaxed">
              <div>
                <h3 className="font-semibold mb-2">What is Tensor Slicing?</h3>
                <p className="text-muted-foreground">
                  Tensor slicing extracts a subset of elements using index notation, similar to NumPy arrays.
                  It's fundamental for data manipulation in PyTorch.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Views vs Copies</h3>
                <p className="text-muted-foreground">
                  Basic slicing operations return views that share memory with the original tensor.
                  Modifications to a view affect the original. Use <code className="text-xs bg-muted px-1 py-0.5 rounded">.clone()</code> for independent copies.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Gradient Flow</h3>
                <p className="text-muted-foreground">
                  Slice operations maintain the computational graph. Gradients propagate through slices during backpropagation,
                  enabling gradient-based optimization on tensor subsets.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Memory Contiguity</h3>
                <p className="text-muted-foreground">
                  Slicing can create non-contiguous tensors. Some operations require contiguous memory and may need {' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">.contiguous()</code> calls for optimal performance.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent ref={codeRef} value="code" className={`!mt-0 absolute w-full transition-opacity duration-300 ${activeTab === "code" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="py-3 max-w-2xl mx-auto">
              <div className="relative max-w-md mx-auto">
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 z-10 p-2 rounded-md hover:bg-muted transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <SyntaxHighlighter
                  language="python"
                  style={isDark ? vscDarkPlus : coy}
                  className="!p-4 rounded-lg pr-12"
                  customStyle={{ marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 }}
                  showLineNumbers
                  wrapLines
                >
                  {tensorSliceCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  )
}
