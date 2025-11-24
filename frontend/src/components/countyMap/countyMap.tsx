import React, { useRef, useState } from 'react'
import useUtahCountyMap from '../../hooks/useUtahCountyMap'
import { TooltipState, CountyData } from '../../types/county'
import './countyMap.css'

type UtahCountyMapProps = {
  countySprainedAnkleData: CountyData[]
}

const UtahCountyMap: React.FC<UtahCountyMapProps> = ({ countySprainedAnkleData }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  useUtahCountyMap({ svgRef, containerRef, setTooltip, countySprainedAnkleData })

  return (
    <div ref={containerRef} className="county-map-container">
      <svg ref={svgRef} className="county-map-svg" />
      {tooltip && (
        <div
          className="county-map-tooltip"
          style={{
            left: tooltip.x + 8,
            top: tooltip.y + 8,
          }}
        >
          <div className="county-map-tooltip-title">{tooltip.name}</div>
          <div>Chance of sprain: {tooltip.chanceOfSprainedAnkle.toLocaleString()}</div>
        </div>
      )}
    </div>
  )
}

export default UtahCountyMap
