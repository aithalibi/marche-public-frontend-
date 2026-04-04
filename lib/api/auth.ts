import axios from 'axios'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types'

// Uses a plain axios instance (no auth header needed for login/register)
const base = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await base.post<AuthResponse>('/api/auth/login', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await base.post<AuthResponse>('/api/auth/register', payload)
  return data
}
