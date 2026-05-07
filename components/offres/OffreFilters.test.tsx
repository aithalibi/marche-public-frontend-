import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import OffreFilters from './OffreFilters'

describe('OffreFilters', () => {
  it('updates the search filter and resets the page', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<OffreFilters filters={{ page: 2 }} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText(/rechercher/i), 'ecole')

    expect(onChange).toHaveBeenLastCalledWith({ page: 0, search: 'e' })
  })

  it('opens advanced filters and updates region', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<OffreFilters filters={{}} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /filtres/i }))
    await user.selectOptions(screen.getByLabelText(/r.gion/i), 'Casablanca-Settat')

    expect(onChange).toHaveBeenCalledWith({ region: 'Casablanca-Settat', page: 0 })
  })

  it('resets active filters', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<OffreFilters filters={{ search: 'ecole' }} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /reinitialiser/i }))

    expect(onChange).toHaveBeenCalledWith({})
  })
})
