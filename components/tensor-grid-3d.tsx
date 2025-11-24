"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

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
  colors,
}: {
  position: [number, number, number]
  value: number
  isSelected: boolean
  onClick: () => void
  colors: {
    selected: string
    unselected: string
    hover: string
    textSelected: string
    textUnselected: string
  }
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
          color={isSelected ? colors.selected : hovered ? colors.hover : colors.unselected}
          opacity={isSelected ? 1 : 0.7}
          transparent
        />
      </mesh>
      <Text
        position={[0, 0, 0.46]}
        fontSize={0.3}
        color={isSelected ? colors.textSelected : colors.textUnselected}
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  )
}

function TensorScene({
  tensor,
  selectedIndices,
  onCellEdit,
  colors
}: Omit<TensorGrid3DProps, "className"> & {
  colors: {
    selected: string
    unselected: string
    hover: string
    textSelected: string
    textUnselected: string
  }
}) {
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
                colors={colors}
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

  const [colors, setColors] = useState({
    selected: 'hsl(220, 70%, 50%)',
    unselected: 'hsl(220, 13%, 69%)',
    hover: 'hsl(220, 70%, 60%)',
    textSelected: 'hsl(0, 0%, 100%)',
    textUnselected: 'hsl(222, 47%, 11%)',
  })

  useEffect(() => {
    const updateColors = () => {
      // Get CSS custom properties from the document
      const root = document.documentElement
      const styles = getComputedStyle(root)

      // Read HSL values from CSS variables and convert to CSS color strings
      const primaryHsl = styles.getPropertyValue('--primary').trim()
      const backgroundHsl = styles.getPropertyValue('--background').trim()
      const borderHsl = styles.getPropertyValue('--border').trim()
      const foregroundHsl = styles.getPropertyValue('--foreground').trim()

      setColors({
        selected: primaryHsl ? `hsl(${primaryHsl})` : 'hsl(220, 70%, 50%)',
        unselected: borderHsl ? `hsl(${borderHsl})` : 'hsl(220, 13%, 69%)',
        hover: primaryHsl ? `hsl(${primaryHsl})` : 'hsl(220, 70%, 60%)',
        textSelected: foregroundHsl ? `hsl(${foregroundHsl})` : 'hsl(0, 0%, 100%)',
        textUnselected: foregroundHsl ? `hsl(${foregroundHsl})` : 'hsl(222, 47%, 11%)',
      })
    }

    // Update colors on mount
    updateColors()

    // Watch for theme changes
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full", className)}>
      <div className="w-full max-w-xl h-[320px] rounded-lg overflow-hidden mx-auto">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ background: 'transparent' }}>
          <TensorScene tensor={tensor} selectedIndices={selectedIndices} onCellEdit={onCellEdit} colors={colors} />
        </Canvas>
      </div>

      <div className="text-xs text-muted-foreground">
        Shape: ({depth}, {rows}, {cols}) • Click and drag to rotate • Scroll to zoom • Click cubes to edit
      </div>
    </div>
  )
}
