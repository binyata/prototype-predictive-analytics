import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import Sidebar from './sidebar'

describe('Sidebar', () => {
  it('renders dashboard link pointing to root', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /dashboard/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
