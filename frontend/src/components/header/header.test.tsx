import { render } from '@testing-library/react'
import Header from './index'

describe('Header', () => {
  it('renders an empty header container', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('.header')
    expect(header).toBeInTheDocument()
    expect(header?.textContent).toBe('')
  })
})
