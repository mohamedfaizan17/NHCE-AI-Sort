'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { AlertTriangle } from 'lucide-react'

interface SandboxVisualizerProps {
  data: number[]
  title?: string
  description?: string
}

export function SandboxVisualizer({ data, title, description }: SandboxVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current || !data.length) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = 200
    const margin = { top: 10, right: 10, bottom: 30, left: 30 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Clear existing
    d3.select(container).selectAll('svg').remove()

    // Create SVG
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, innerWidth])
      .padding(0.2)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 100])
      .nice()
      .range([innerHeight, 0])

    // Color (error red)
    const isDark = theme === 'dark'
    const barColor = isDark ? '#ef4444' : '#dc2626'

    // Draw bars with animation
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => xScale(i.toString()) || 0)
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', barColor)
      .attr('rx', 3)
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => yScale(d))
      .attr('height', (d) => innerHeight - yScale(d))

    // Add value labels
    g.selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', isDark ? '#e5e7eb' : '#374151')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text((d) => d)
      .transition()
      .delay(500)
      .duration(300)
      .attr('opacity', 1)

    // Add axes
    const xAxis = d3.axisBottom(xScale)
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', isDark ? '#9ca3af' : '#6b7280')

    g.selectAll('.domain, line').attr('stroke', isDark ? '#4b5563' : '#d1d5db')

  }, [data, theme])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-red-500/50 bg-red-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            {title || 'Error Case Visualization'}
          </CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div
            ref={containerRef}
            className="w-full"
            style={{ minHeight: '200px' }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
