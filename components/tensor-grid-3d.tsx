"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TensorGrid3DProps {
  tensor: number[][][]
  selectedIndices: Set<string>
  onCellEdit?: (depth: number, row: number, col: number, value: number) => void
  className?: string
}

function TensorCube({
  position,
  value,
  isSelected,
  onClick,
}: {
  position: [number, number, number]
  value: number
  isSelected: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isSelected ? 1.15 : hovered ? 1.05 : 1}
      >
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color={isSelected ? "#3b82f6" : hovered ? "#60a5fa" : "#94a3b8"}
          opacity={isSelected ? 1 : 0.7}
          transparent
        />
      </mesh>
      <Text
        position={[0, 0, 0.46]}
        fontSize={0.3}
        color={isSelected ? "#ffffff" : "#1e293b"}
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  )
}

function TensorScene({ tensor, selectedIndices, onCellEdit }: Omit<TensorGrid3DProps, "className">) {
  const depth = tensor.length
  const rows = tensor[0]?.length || 0
  const cols = tensor[0]?.[0]?.length || 0

  const handleCellClick = (d: number, r: number, c: number) => {
    if (!onCellEdit) return

    const input = prompt(`Enter new value for [${d}, ${r}, ${c}]:`, tensor[d][r][c].toString())
    if (input !== null) {
      const value = parseFloat(input)
      if (!isNaN(value)) {
        onCellEdit(d, r, c, value)
      }
    }
  }

  // Center the grid
  const centerX = (cols - 1) / 2
  const centerY = (rows - 1) / 2
  const centerZ = (depth - 1) / 2

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {tensor.map((layer, d) =>
        layer.map((row, r) =>
          row.map((value, c) => {
            const key = `${d},${r},${c}`
            const isSelected = selectedIndices.has(key)

            return (
              <TensorCube
                key={key}
                position={[c - centerX, -(r - centerY), d - centerZ]}
                value={value}
                isSelected={isSelected}
                onClick={() => handleCellClick(d, r, c)}
              />
            )
          })
        )
      )}

      <OrbitControls makeDefault />
    </>
  )
}

export function TensorGrid3D({ tensor, selectedIndices, onCellEdit, className }: TensorGrid3DProps) {
  const depth = tensor.length
  const rows = tensor[0]?.length || 0
  const cols = tensor[0]?.[0]?.length || 0

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full", className)}>
      <div className="w-full max-w-xl h-[400px] bg-muted/30 rounded-lg overflow-hidden mx-auto">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ background: 'transparent' }}>
          <TensorScene tensor={tensor} selectedIndices={selectedIndices} onCellEdit={onCellEdit} />
        </Canvas>
      </div>

      <div className="text-xs text-muted-foreground">
        Shape: ({depth}, {rows}, {cols}) • Click and drag to rotate • Scroll to zoom • Click cubes to edit
      </div>
    </div>
  )
}
