import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useAppStore } from '@/store/useAppStore'
import { useTheme } from 'next-themes'

export function useD3Sort(containerRef: React.RefObject<HTMLDivElement>) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const { visualizerState, animationSpeed } = useAppStore()
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight
    const margin = { top: 20, right: 20, bottom: 40, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Clear existing SVG
    d3.select(container).selectAll('svg').remove()

    // Create SVG
    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'sort-visualizer')

    svgRef.current = svg.node()

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(visualizerState.data.map((_, i) => i.toString()))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(visualizerState.data) || 100])
      .nice()
      .range([innerHeight, 0])

    // Theme-based styling
    const isDark = theme === 'dark'

    // Color scale based on theme
    const getBarColor = (index: number, state: string) => {
      
      if (state === 'error') {
        return isDark ? '#ef4444' : '#dc2626' // red
      }
      
      if (visualizerState.focusIndices.includes(index)) {
        if (visualizerState.state === 'comparing') {
          return isDark ? '#fbbf24' : '#f59e0b' // yellow
        }
        if (visualizerState.state === 'swapping') {
          return isDark ? '#a78bfa' : '#8b5cf6' // purple
        }
      }
      
      if (visualizerState.state === 'sorted') {
        return isDark ? '#34d399' : '#10b981' // green
      }
      
      return isDark ? '#60a5fa' : '#3b82f6' // blue (default)
    }

    // Draw bars
    const bars = g
      .selectAll<SVGRectElement, number>('.bar')
      .data(visualizerState.data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => xScale(i.toString()) || 0)
      .attr('y', (d) => Math.max(0, yScale(d)))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => Math.max(0, innerHeight - yScale(d)))
      .attr('fill', (_, i) => getBarColor(i, visualizerState.state))
      .attr('rx', 4)
      .style('transition', `fill ${animationSpeed / 2}ms ease`)

    // Add value labels on bars
    g.selectAll<SVGTextElement, number>('.bar-label')
      .data(visualizerState.data)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', isDark ? '#e5e7eb' : '#374151')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .text((d) => d)

    // Add x-axis
    const xAxis = d3.axisBottom(xScale)
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', isDark ? '#9ca3af' : '#6b7280')

    // Add y-axis
    const yAxis = d3.axisLeft(yScale)
    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', isDark ? '#9ca3af' : '#6b7280')

    // Style axes
    g.selectAll('.x-axis path, .y-axis path, .x-axis line, .y-axis line')
      .attr('stroke', isDark ? '#4b5563' : '#d1d5db')

    // Animation function
    const animateTransition = () => {
      bars
        .transition()
        .duration(animationSpeed)
        .ease(d3.easeCubicOut)
        .attr('x', (_, i) => xScale(i.toString()) || 0)
        .attr('y', (d) => Math.max(0, yScale(d)))
        .attr('height', (d) => Math.max(0, innerHeight - yScale(d)))
        .attr('fill', (_, i) => getBarColor(i, visualizerState.state))
    }

    animateTransition()

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      
      svg.attr('width', newWidth).attr('height', newHeight)
      
      const newInnerWidth = newWidth - margin.left - margin.right
      const newInnerHeight = newHeight - margin.top - margin.bottom
      
      xScale.range([0, newInnerWidth])
      yScale.range([newInnerHeight, 0])
      
      bars
        .attr('x', (_, i) => xScale(i.toString()) || 0)
        .attr('y', (d) => Math.max(0, yScale(d)))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => Math.max(0, newInnerHeight - yScale(d)))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [visualizerState, animationSpeed, theme, containerRef])

  return svgRef
}
