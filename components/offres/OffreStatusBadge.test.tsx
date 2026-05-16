import { render, screen } from '@testing-library/react'
import { StatutBadge, SuiviBadge } from './OffreStatusBadge'

describe('OffreStatusBadge', () => {
  it('renders a readable label for an open offer', () => {
    render(<StatutBadge statut="OUVERT" />)

    expect(screen.getByText('Ouvert')).toBeInTheDocument()
  })

  it('renders the suivi status', () => {
    render(<SuiviBadge status="En analyse" />)

    expect(screen.getByText('En analyse')).toBeInTheDocument()
  })
})
