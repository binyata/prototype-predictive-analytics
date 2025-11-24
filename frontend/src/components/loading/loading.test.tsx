import { render, screen } from '@testing-library/react'
import Loading from './Loading'

describe('Loading', () => {
  it('shows loading text', () => {
    render(<Loading />)
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument()
  })
})
