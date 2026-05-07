import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatCurrency, formatDate, formatDistanceToNow } from './utils'

describe('utils', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats an ISO date for French users', () => {
    expect(formatDate('2026-05-06T12:00:00.000Z')).toBe('06/05/2026')
  })

  it('formats amounts as MAD currency', () => {
    const formatted = formatCurrency(1234567)

    expect(formatted).toContain('MAD')
    expect(formatted.replace(/\D/g, '')).toBe('1234567')
  })

  it('formats a relative date in minutes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-06T12:10:00.000Z'))

    expect(formatDistanceToNow('2026-05-06T12:00:00.000Z')).toBe('il y a 10 min')
  })
})
