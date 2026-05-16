import { getOffre, getOffres, removeSuivi, updateSuivi } from './offres'
import api from '@/lib/axios'

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockedApi = jest.mocked(api)

const backendOffre = {
  id: 'offre-1',
  reference: 'AO-2026-001',
  intitule: 'Travaux de construction',
  description: 'Description',
  organisme: 'Commune de Rabat',
  secteur: 'BTP',
  localisation: 'Rabat',
  urlOfficielle: 'https://example.com/offre-1',
  datePublication: '2026-05-01T00:00:00.000Z',
  dateCloture: '2999-06-01T00:00:00.000Z',
}

const pageResponse = {
  content: [backendOffre],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 20,
}

describe('offres API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches offers with backend filters and maps the response', async () => {
    mockedApi.get
      .mockResolvedValueOnce({ data: pageResponse })
      .mockResolvedValueOnce({ data: [{ id: 'suivi-1', offreId: 'offre-1', statut: 'POSTULE' }] })

    const result = await getOffres({
      search: 'ecole',
      region: 'Rabat',
      typeMarche: 'TRAVAUX',
      page: 2,
      size: 10,
    })

    expect(mockedApi.get).toHaveBeenNthCalledWith(1, '/api/offres/search', {
      params: {
        q: 'ecole',
        secteur: 'TRAVAUX',
        localisation: 'Rabat',
        statut: undefined,
        dateMin: undefined,
        dateLimiteMax: undefined,
        page: 2,
        size: 10,
        sort: 'date_desc',
      },
    })
    expect(result.content[0]).toMatchObject({
      id: 'offre-1',
      titre: 'Travaux de construction',
      acheteur: 'Commune de Rabat',
      region: 'Rabat',
      typeMarche: 'TRAVAUX',
      statut: 'OUVERT',
      suivi: 'En analyse',
    })
  })

  it('returns an offer detail from the search payload', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: pageResponse }).mockResolvedValueOnce({ data: [] })

    const result = await getOffre('offre-1')

    expect(mockedApi.get).toHaveBeenCalledWith('/api/offres/search', {
      params: { page: 0, size: 1000 },
    })
    expect(result.reference).toBe('AO-2026-001')
  })

  it('throws when an offer detail is not found', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: pageResponse }).mockResolvedValueOnce({ data: [] })

    await expect(getOffre('missing')).rejects.toThrow('Offre missing introuvable')
  })

  it('creates suivi when no suivi already exists', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] })

    await updateSuivi('offre-1', 'Intéressant')

    expect(mockedApi.post).toHaveBeenCalledWith('/api/suivi/offre-1', { statut: 'INTERESSE' })
  })

  it('updates suivi when it already exists', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [{ id: 'suivi-1', offreId: 'offre-1' }] })

    await updateSuivi('offre-1', 'Archivé')

    expect(mockedApi.patch).toHaveBeenCalledWith('/api/suivi/suivi-1', { statut: 'REJETE' })
  })

  it('removes an existing suivi', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [{ id: 'suivi-1', offreId: 'offre-1' }] })

    await removeSuivi('offre-1')

    expect(mockedApi.delete).toHaveBeenCalledWith('/api/suivi/suivi-1')
  })
})
