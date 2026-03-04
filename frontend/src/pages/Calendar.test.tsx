/**
 * Unit tests for Calendar page - TDD Red-Green-Refactor
 */
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Calendar } from './Calendar'
import * as AuthContext from '../contexts/AuthContext'

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Calendar page', () => {
  beforeEach(() => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      getToken: () => null,
      isLoading: false,
      error: null,
    })
  })

  it('should show sign-in prompt when user is not authenticated', () => {
    renderWithRouter(<Calendar />)
    expect(screen.getByText(/Sign in with Google to connect your calendar/i)).toBeInTheDocument()
  })

  it('should show Connect button when user is authenticated and calendar not connected', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(url.includes('status') ? { connected: false } : {}),
        })
      )
    )
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { id: '1', email: 'test@test.com', name: 'Test' },
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
      getToken: () => 'token',
      isLoading: false,
      error: null,
    })
    renderWithRouter(<Calendar />)
    expect(await screen.findByText(/Connect Google Calendar/i)).toBeInTheDocument()
  })
})
