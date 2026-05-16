import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OffreCard from './OffreCard'
import type { Offre } from '@/types'

const offre: Offre = {
  id: 'offre-1',
  reference: 'AO-2026-001',
  titre: 'Construction d une ecole',
  acheteur: 'Commune de Rabat',
  region: 'Rabat-Sale-Kenitra',
  secteur: 'Travaux',
  typeMarche: 'TRAVAUX',
  montantEstime: 250000,
  datePublication: '2026-05-01T00:00:00.000Z',
  dateLimiteSoumission: '2026-06-01T00:00:00.000Z',
  statut: 'OUVERT',
  sourceUrl: 'https://example.com/offre-1',
  suivi: 'En analyse',
}

describe('OffreCard', () => {
  it('renders the main offer information and links', () => {
    render(<OffreCard offre={offre} />)

    expect(screen.getByText('Construction d une ecole')).toBeInTheDocument()
    expect(screen.getByText('AO-2026-001')).toBeInTheDocument()
    expect(screen.getByText('Commune de Rabat')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Construction d une ecole' })).toHaveAttribute(
      'href',
      '/offres/offre-1'
    )
    expect(screen.getByRole('link', { name: /source officielle/i })).toHaveAttribute(
      'href',
      'https://example.com/offre-1'
    )
  })

  it('notifies when the suivi status changes', async () => {
    const user = userEvent.setup()
    const onSuiviChange = jest.fn()

    render(<OffreCard offre={offre} onSuiviChange={onSuiviChange} />)

    await user.click(screen.getByRole('button', { name: /archiv/i }))

    expect(onSuiviChange).toHaveBeenCalledWith('offre-1', expect.stringMatching(/archiv/i))
  })
})
