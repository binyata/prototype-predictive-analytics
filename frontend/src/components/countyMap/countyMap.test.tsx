import { act, render, screen } from '@testing-library/react'
import UtahCountyMap from './countyMap'
import useUtahCountyMap from '../../hooks/useUtahCountyMap'
import type { TooltipState } from '../../types/county'

jest.mock('../../hooks/useUtahCountyMap', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockUseUtahCountyMap = useUtahCountyMap as jest.MockedFunction<typeof useUtahCountyMap>

const sampleData = [{ id: 1, name: 'Salt Lake', value: 10 }]

describe('UtahCountyMap', () => {
  beforeEach(() => {
    mockUseUtahCountyMap.mockReset()
  })

  it('renders the SVG container and passes county data to the hook', () => {
    const { container } = render(<UtahCountyMap countySprainedAnkleData={sampleData} />)

    expect(mockUseUtahCountyMap).toHaveBeenCalledTimes(1)
    const args = mockUseUtahCountyMap.mock.calls[0][0]
    expect(args.countySprainedAnkleData).toEqual(sampleData)
    expect(typeof args.setTooltip).toBe('function')
    expect(args.svgRef.current).toBeInstanceOf(SVGSVGElement)
    expect(args.containerRef.current).toBeInstanceOf(HTMLDivElement)

    expect(container.querySelector('.county-map-container')).toBeInTheDocument()
    expect(container.querySelector('.county-map-svg')).toBeInTheDocument()
  })

  it('shows tooltip details when the hook sets tooltip state', async () => {
    let setTooltip: ((value: TooltipState | null) => void) | undefined
    mockUseUtahCountyMap.mockImplementation(({ setTooltip: hookSetTooltip }) => {
      setTooltip = hookSetTooltip
    })

    render(<UtahCountyMap countySprainedAnkleData={sampleData} />)

    await act(async () => {
      setTooltip?.({ x: 5, y: 5, name: 'Cache', chanceOfSprainedAnkle: 12.34 })
    })

    expect(screen.getByText('Cache')).toBeInTheDocument()
    expect(screen.getByText(/chance of sprain: 12\.34/i)).toBeInTheDocument()
  })
})
