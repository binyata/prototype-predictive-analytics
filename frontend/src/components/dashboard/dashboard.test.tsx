import { render, screen } from '@testing-library/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import Dashboard from './dashboard'
import type { CountyData } from '../../types/county'

jest.mock('../../config/env', () => ({
  __esModule: true,
  API_URL: 'http://localhost:5000',
}))

jest.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: jest.fn(),
}))

type ChildProps = { countySprainedAnkleData: CountyData[] }
const tableProps: ChildProps[] = []
const mapProps: ChildProps[] = []

jest.mock('../countyTable', () => ({
  __esModule: true,
  default: (props: ChildProps) => {
    tableProps.push(props)
    return (
      <div data-testid="county-table-mock">
        Table length {props.countySprainedAnkleData.length}
      </div>
    )
  },
}))

jest.mock('../countyMap', () => ({
  __esModule: true,
  default: (props: ChildProps) => {
    mapProps.push(props)
    return (
      <div data-testid="county-map-mock">Map length {props.countySprainedAnkleData.length}</div>
    )
  },
}))

const mockUseSuspenseQuery = useSuspenseQuery as jest.MockedFunction<typeof useSuspenseQuery>

const sampleData: CountyData[] = [
  { id: 1, name: 'Salt Lake', value: 10 },
  { id: 2, name: 'Utah', value: 20 },
]

describe('Dashboard', () => {
  beforeEach(() => {
    tableProps.length = 0
    mapProps.length = 0
    mockUseSuspenseQuery.mockReset()
    mockUseSuspenseQuery.mockReturnValue({ data: sampleData })
  })

  it('renders title and passes fetched data to child components', () => {
    render(<Dashboard />)

    expect(screen.getByText(/sprained ankle cases forecast/i)).toBeInTheDocument()
    expect(screen.getByTestId('county-table-mock')).toBeInTheDocument()
    expect(screen.getByTestId('county-map-mock')).toBeInTheDocument()

    expect(tableProps[0].countySprainedAnkleData).toEqual(sampleData)
    expect(mapProps[0].countySprainedAnkleData).toEqual(sampleData)
  })
})
