"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ReluChart } from "./relu-chart"
import { ReluInteractive } from "./relu-interactive"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coy, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { BlockMath } from "react-katex"
import "katex/dist/katex.min.css"

const reluCode = `import torch

# Using PyTorch
x = torch.tensor([[-2, -1, 0, 1, 2]])
output = torch.relu(x)

# Or functional API
output = torch.nn.functional.relu(x)`

export function ReluTabs() {
  const [copied, setCopied] = useState(false)
  const [highlightedPoint, setHighlightedPoint] = useState<number | null>(null)
  const [minX, setMinX] = useState(-2)
  const [maxX, setMaxX] = useState(2)
  const [activeTab, setActiveTab] = useState("graph")
  const [heights, setHeights] = useState<Record<string, number>>({})
  const [isDark, setIsDark] = useState(false)

  const graphRef = useRef<HTMLDivElement>(null)
  const equationRef = useRef<HTMLDivElement>(null)
  const theoryRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  const refs = {
    graph: graphRef,
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

  const currentHeight = heights[activeTab] || "auto"

  const handleCopy = () => {
    navigator.clipboard.writeText(reluCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePointChange = (value: number | null) => {
    setHighlightedPoint(value)
  }

  const handleRangeChange = (min: number, max: number) => {
    setMinX(min)
    setMaxX(max)
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div
          className="flex justify-center py-2 max-w-2xl mx-auto"
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30, duration: 0.3 }}
        >
          <TabsList>
            <TabsTrigger value="graph">Graph</TabsTrigger>
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
          <TabsContent ref={graphRef} value="graph" className={`!mt-0 absolute w-full transition-opacity duration-300 ${activeTab === "graph" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6">
              <ReluChart minX={minX} maxX={maxX} highlightedPoint={highlightedPoint} />
              <ReluInteractive className="mt-3" onPointChange={handlePointChange} onRangeChange={handleRangeChange} />
            </div>
          </TabsContent>

          <TabsContent ref={equationRef} value="equation" className={`!mt-0 absolute w-full transition-opacity duration-300 ${activeTab === "equation" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="flex flex-col items-center justify-center py-2 space-y-3 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Primary Definition</p>
                <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                  <BlockMath math="f(x) = \max(0, x)" />
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground mb-2">Piecewise Definition</p>
                <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                  <BlockMath math="f(x) = \begin{cases} 0 & \text{if } x \leq 0 \\ x & \text{if } x > 0 \end{cases}" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent ref={theoryRef} value="theory" className={`!mt-0 absolute w-full transition-opacity duration-300 ${activeTab === "theory" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="flex items-center justify-center py-12 max-w-2xl mx-auto">
              <div className="text-center text-lg leading-relaxed">
                <p>
                  ReLU (Rectified Linear Unit) is a non-linear activation function that outputs the input directly if positive, otherwise outputs zero.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent ref={codeRef} value="code" className={`!mt-0 absolute w-full transition-opacity duration-300 ${activeTab === "code" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="py-3 max-w-2xl mx-auto">
              <div className="relative max-w-sm mx-auto">
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
                  customStyle={{ margin: 0 }}
                  showLineNumbers
                  wrapLines
                >
                  {reluCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  )
}
