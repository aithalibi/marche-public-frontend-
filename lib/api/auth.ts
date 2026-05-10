import axios from 'axios'
import type { BackendAuthResponse, LoginPayload, RegisterPayload } from '@/types'

// Uses a plain axios instance (no auth header needed for login/register)
const base = axios.create({
  baseURL: process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function login(payload: LoginPayload): Promise<BackendAuthResponse> {
  const { data } = await base.post<BackendAuthResponse>('/api/auth/login', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<BackendAuthResponse> {
  const { data } = await base.post<BackendAuthResponse>('/api/auth/register', payload)
  return data
}

export async function requestPasswordReset(email: string): Promise<void> {
  await base.post('/api/auth/password-reset/request', { email })
}

export async function verifyPasswordResetCode(email: string, code: string): Promise<void> {
  await base.post('/api/auth/password-reset/verify', { email, code })
}

export async function confirmPasswordReset(email: string, code: string, newPassword: string): Promise<void> {
  await base.post('/api/auth/password-reset/confirm', { email, code, newPassword })
}
