import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import Main from './main'
import Dashboard from '../dashboard'

jest.mock('../dashboard', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="dashboard-mock">Dashboard Content</div>),
}))

jest.mock('../loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-mock">Loading...</div>,
}))

const DashboardMock = Dashboard as unknown as jest.Mock

describe('Main', () => {
  beforeEach(() => {
    DashboardMock.mockClear()
  })

  it('renders dashboard for the root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Main />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('dashboard-mock')).toBeInTheDocument()
  })
})
