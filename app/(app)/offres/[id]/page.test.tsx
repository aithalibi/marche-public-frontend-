import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OffrePage from './page'
import { useOffre } from '@/hooks/useOffres'
import { updateSuivi } from '@/lib/api/offres'
import type { Offre } from '@/types'

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'offre-1' }),
}))

jest.mock('@/hooks/useOffres', () => ({
  useOffre: jest.fn(),
}))

jest.mock('@/lib/api/offres', () => ({
  updateSuivi: jest.fn(),
}))

const offre: Offre = {
  id: 'offre-1',
  reference: 'AO-2026-001',
  titre: 'Construction d une ecole',
  acheteur: 'Commune de Rabat',
  region: 'Rabat',
  secteur: 'BTP',
  typeMarche: 'TRAVAUX',
  montantEstime: 500000,
  datePublication: '2026-05-01T00:00:00.000Z',
  dateLimiteSoumission: '2026-06-01T00:00:00.000Z',
  statut: 'OUVERT',
  description: 'Travaux de construction et amenagement.',
  sourceUrl: 'https://example.com/source',
  suivi: 'En analyse',
}

describe('OffrePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uses the route id to load the offer', () => {
    jest.mocked(useOffre).mockReturnValue({ offre, isLoading: false, error: undefined })

    render(<OffrePage />)

    expect(useOffre).toHaveBeenCalledWith('offre-1')
  })

  it('renders the loading state', () => {
    const { container } = renderLoadingPage()

    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders an error state when the offer is missing', () => {
    jest.mocked(useOffre).mockReturnValue({ offre: undefined, isLoading: false, error: new Error('fail') })

    render(<OffrePage />)

    expect(screen.getByText(/introuvable/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /retour/i })).toHaveAttribute('href', '/recherche')
  })

  it('renders the offer details', () => {
    jest.mocked(useOffre).mockReturnValue({ offre, isLoading: false, error: undefined })

    render(<OffrePage />)

    expect(screen.getByRole('heading', { name: 'Construction d une ecole' })).toBeInTheDocument()
    expect(screen.getByText('AO-2026-001')).toBeInTheDocument()
    expect(screen.getByText('Commune de Rabat')).toBeInTheDocument()
    expect(screen.getByText('Travaux de construction et amenagement.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /source officielle/i })).toHaveAttribute(
      'href',
      'https://example.com/source'
    )
  })

  it('updates suivi from the detail page', async () => {
    const user = userEvent.setup()
    jest.mocked(updateSuivi).mockResolvedValue()
    jest.mocked(useOffre).mockReturnValue({ offre, isLoading: false, error: undefined })

    render(<OffrePage />)

    await user.click(screen.getByRole('button', { name: /archiv/i }))

    expect(updateSuivi).toHaveBeenCalledWith('offre-1', expect.stringMatching(/archiv/i))
  })
})

function renderLoadingPage() {
  jest.mocked(useOffre).mockReturnValue({ offre: undefined, isLoading: true, error: undefined })
  return render(<OffrePage />)
}
