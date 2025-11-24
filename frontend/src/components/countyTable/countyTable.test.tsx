import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CountyTable from './countyTable'

jest.mock('../../config/env', () => ({
  __esModule: true,
  API_URL: 'http://localhost:5000',
}))

const sampleData = [
  { id: 1, name: 'Salt Lake', value: 0 },
  { id: 2, name: 'Cache', value: 5 },
]

const setupFetchMock = () => {
  const mock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  })
  global.fetch = mock as unknown as typeof fetch
  return mock
}

describe('CountyTable', () => {
  beforeEach(() => {
    setupFetchMock()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders county names with initial values and placeholders', () => {
    render(<CountyTable countySprainedAnkleData={sampleData} />)

    expect(screen.getByText('Salt Lake')).toBeInTheDocument()
    expect(screen.getByText('Cache')).toBeInTheDocument()

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
    expect(inputs[0].placeholder).toBe('0')
    expect(inputs[0].value).toBe('')
    expect(inputs[1].value).toBe('5')

    expect(screen.getByRole('button', { name: /update/i })).toBeDisabled()
  })

  it('enables update when a value changes and disables when reverted', async () => {
    const user = userEvent.setup()
    render(<CountyTable countySprainedAnkleData={sampleData} />)

    const inputs = screen.getAllByRole('spinbutton')
    const updateButton = screen.getByRole('button', { name: /update/i })

    await user.type(inputs[1], '{backspace}6')
    expect(updateButton).toBeEnabled()

    await user.clear(inputs[1])
    await user.type(inputs[1], '5')
    expect(updateButton).toBeDisabled()
  })

  it('sends updated values and clears dirty state after clicking update', async () => {
    const user = userEvent.setup()
    const fetchMock = setupFetchMock()

    render(<CountyTable countySprainedAnkleData={sampleData} />)

    const inputs = screen.getAllByRole('spinbutton')
    const updateButton = screen.getByRole('button', { name: /update/i })

    await user.clear(inputs[1])
    await user.type(inputs[1], '7')
    expect(updateButton).toBeEnabled()

    await user.click(updateButton)

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5000/counties', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ id: 2, value: 7 }]),
    })

    expect(updateButton).toBeDisabled()
  })
})
