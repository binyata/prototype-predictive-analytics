import { useEffect } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { FeatureCollection, Geometry } from 'geojson'

import type { CountyProps, TooltipState, CountyData } from '../types/county'

const WIDTH = 800
const HEIGHT = 500

const blueToRedInterpolator = d3.interpolateRgbBasis([
  '#2166ac',
  '#67a9cf',
  '#fddbc7',
  '#ef8a62',
  '#b2182b',
])

// Meant to mimic forecasting for sprained ankle data
function forecastSprainRisk(value: number): number {
  const base = 0.5 * Math.sqrt(value)
  const seasonal = Math.sin(value / 20) * 2
  const noise = (Math.random() - 0.5) * 1
  let risk = base + seasonal + noise
  if (risk < 0) risk = 0
  if (risk > 100) risk = 100

  return Number(risk.toFixed(2))
}

type UseUtahCountyMapProps = {
  svgRef: React.RefObject<SVGSVGElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  setTooltip: (value: TooltipState | null) => void
  countySprainedAnkleData: CountyData[]
}

function useUtahCountyMap({
  svgRef,
  containerRef,
  setTooltip,
  countySprainedAnkleData,
}: UseUtahCountyMapProps): void {
  useEffect(() => {
    const svgEl = svgRef.current
    const containerEl = containerRef.current
    if (!svgEl || !containerEl) return

    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)

    const sprainedAnkleCountyName = new Map<string, number>()
    for (const county of countySprainedAnkleData) {
      const risk = forecastSprainRisk(county.value)
      sprainedAnkleCountyName.set(county.name, forecastSprainRisk(risk))
    }

    const values = [...sprainedAnkleCountyName.values()]

    const minPop = Math.min(...values)
    const maxPop = Math.max(...values)

    const colorScale = d3.scaleSequential(blueToRedInterpolator).domain([minPop, maxPop])

    // To resolve "Can't perform a state update on an unmounted component" warning
    let isCancelled = false

    async function loadMap() {
      try {
        const us = await d3.json<Topology>('/usa-data.json')
        if (!us || isCancelled) return

        const counties = feature(us, us.objects.counties) as FeatureCollection<
          Geometry,
          CountyProps
        >

        const utahCounties = counties.features.filter((d) => {
          const id = d.id?.toString()
          const geoid = d.properties?.GEOID?.toString()
          const code = id ?? geoid
          return code?.startsWith('49') // Utah FIPS prefix
        })

        if (!utahCounties.length || isCancelled) return

        const utahCollection: FeatureCollection<Geometry, CountyProps> = {
          type: 'FeatureCollection',
          features: utahCounties,
        }

        const projection = d3.geoMercator().fitSize([WIDTH, HEIGHT], utahCollection)

        const path = d3.geoPath().projection(projection)
        const g = svg.append('g')

        g.selectAll('path')
          .data(utahCounties)
          .join('path')
          .attr('d', (d) => path(d) || '')
          .attr('fill', (d) => {
            const name = (d.properties?.name as string) ?? 'Unknown'
            const value = sprainedAnkleCountyName.get(name)
            if (value == null) return '#eeeeee'
            return colorScale(value)
          })
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 0.7)
          .on('mousemove', function (event, d) {
            const [x, y] = d3.pointer(event, containerEl)
            const name = (d.properties?.name as string) ?? 'Unknown'
            const value = sprainedAnkleCountyName.get(name)

            const safeValue = value ?? 0
            const baseColor = colorScale(safeValue)
            const hoverColor = d3.color(baseColor)?.brighter(0.6).toString() || baseColor

            d3.select(this).attr('fill', hoverColor)

            setTooltip({
              x,
              y,
              name,
              chanceOfSprainedAnkle: safeValue,
            })
          })
          .on('mouseleave', function (_event, d) {
            const name = (d.properties?.name as string) ?? 'Unknown'
            const value = sprainedAnkleCountyName.get(name)
            const safeValue = value ?? 0
            d3.select(this).attr('fill', value == null ? '#eeeeee' : colorScale(safeValue))
            setTooltip(null)
          })
      } catch (err) {
        if (!isCancelled) {
          console.error('Error loading TopoJSON:', err)
        }
      }
    }

    loadMap()
    return () => {
      isCancelled = true
    }
  }, [svgRef, containerRef, setTooltip, countySprainedAnkleData])
}

export default useUtahCountyMap
