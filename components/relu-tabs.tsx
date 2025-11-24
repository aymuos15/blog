"use client"

import { useState } from "react"
import { ReluChart } from "./relu-chart"
import { ReluInteractive } from "./relu-interactive"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"

const reluEquation = "f(x) = max(0, x)"

const reluCode = `import torch

# Using PyTorch
x = torch.tensor([[-2, -1, 0, 1, 2]])
output = torch.relu(x)

# Or functional API
output = torch.nn.functional.relu(x)`

export function ReluTabs() {
  const [copied, setCopied] = useState(false)
  const [highlightedPoint, setHighlightedPoint] = useState<number | null>(null)
  const [minX, setMinX] = useState(-3)
  const [maxX, setMaxX] = useState(3)

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
      <Tabs defaultValue="graph" className="w-full transition-all duration-700">
        <div className="flex justify-center py-2">
          <TabsList>
            <TabsTrigger value="graph">Graph</TabsTrigger>
            <TabsTrigger value="equation">Equation</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </div>

        <div className="relative w-full overflow-hidden transition-all duration-700">
          <TabsContent value="graph" className="!mt-0">
            <div className="flex flex-col items-center w-full animate-in fade-in duration-300">
              <ReluChart minX={minX} maxX={maxX} highlightedPoint={highlightedPoint} />
              <ReluInteractive onPointChange={handlePointChange} onRangeChange={handleRangeChange} />
            </div>
          </TabsContent>

          <TabsContent value="equation" className="!mt-0">
            <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-in fade-in duration-300">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Primary Definition</p>
                <code className="text-3xl font-mono bg-muted p-6 rounded-lg block">
                  f(x) = max(0, x)
                </code>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Piecewise Definition</p>
                <div className="bg-muted p-8 rounded-lg text-lg flex items-center justify-center">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">f(x) =</span>
                    <div className="border-l-2 border-foreground pl-6 py-2">
                      <div className="mb-3">0, &nbsp;&nbsp;&nbsp;&nbsp;if x ≤ 0</div>
                      <div>x, &nbsp;&nbsp;&nbsp;&nbsp;if x &gt; 0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theory" className="!mt-0">
            <div className="flex items-center justify-center py-12 px-6 animate-in fade-in duration-300">
              <div className="max-w-2xl text-center text-lg leading-relaxed">
                <p>
                  ReLU (Rectified Linear Unit) is a non-linear activation function that outputs the input directly if positive, otherwise outputs zero.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="!mt-0">
            <div className="py-3 animate-in fade-in duration-300">
              <div className="relative max-w-lg mx-auto">
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
                  style={coy}
                  className="!m-0 !p-4 rounded-lg pr-12"
                  customStyle={{ background: "transparent" }}
                  showLineNumbers
                  wrapLines
                >
                  {reluCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>
      </div>
      </Tabs>
    </div>
  )
}
