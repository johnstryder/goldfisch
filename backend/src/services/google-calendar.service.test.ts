/**
 * RED phase: Failing tests for Google Calendar integration
 * TDD: Google login + Calendar connection
 */
import { describe, it, expect } from 'bun:test'
import {
  fetchCalendarEvents,
  parseCalendarEvent,
  getCalendarAuthUrl,
  type CalendarEvent,
  type CalendarClient,
} from './google-calendar.service'

describe('Google Calendar Service', () => {
  describe('getCalendarAuthUrl', () => {
    it('should return OAuth URL with calendar scopes', () => {
      const url = getCalendarAuthUrl(
        'client-123',
        'http://localhost:3000/calendar-callback',
        'state-xyz'
      )
      expect(url).toContain('accounts.google.com/o/oauth2')
      expect(url).toContain('client_id=client-123')
      expect(url).toContain('redirect_uri=')
      expect(url).toContain('scope=')
      expect(url).toContain('calendar')
      expect(url).toContain('state=state-xyz')
    })

    it('should include calendar.readonly and calendar.events scopes', () => {
      const url = getCalendarAuthUrl('client', 'http://callback', 'state')
      expect(url).toContain('calendar.readonly')
      expect(url).toContain('calendar.events')
    })
  })

  describe('parseCalendarEvent', () => {
    it('should parse Google Calendar API event to CalendarEvent', () => {
      const raw = {
        id: 'evt1',
        summary: 'Team Meeting',
        start: { dateTime: '2024-03-05T10:00:00Z' },
        end: { dateTime: '2024-03-05T11:00:00Z' },
        htmlLink: 'https://calendar.google.com/event?eid=abc',
      }
      const event = parseCalendarEvent(raw as any)
      expect(event.id).toBe('evt1')
      expect(event.summary).toBe('Team Meeting')
      expect(event.start).toBeDefined()
      expect(event.end).toBeDefined()
      expect(event.htmlLink).toBe('https://calendar.google.com/event?eid=abc')
    })

    it('should handle all-day events with date only', () => {
      const raw = {
        id: 'evt2',
        summary: 'Holiday',
        start: { date: '2024-03-06' },
        end: { date: '2024-03-06' },
      }
      const event = parseCalendarEvent(raw as any)
      expect(event.id).toBe('evt2')
      expect(event.summary).toBe('Holiday')
      expect(event.isAllDay).toBe(true)
    })
  })

  describe('fetchCalendarEvents', () => {
    it('should return events when given valid access token', async () => {
      const mockClient: CalendarClient = {
        events: {
          list: async () => ({
            data: {
              items: [
                {
                  id: 'evt1',
                  summary: 'Team Meeting',
                  start: { dateTime: '2024-03-05T10:00:00Z' },
                  end: { dateTime: '2024-03-05T11:00:00Z' },
                  htmlLink: 'https://calendar.google.com/event?eid=abc',
                },
              ],
            },
          }),
        },
      }
      const events = await fetchCalendarEvents(
        'valid-token',
        {
          timeMin: '2024-03-01T00:00:00Z',
          timeMax: '2024-03-31T23:59:59Z',
          maxResults: 10,
        },
        mockClient
      )
      expect(Array.isArray(events)).toBe(true)
      expect(events.length).toBe(1)
      expect(events[0].summary).toBe('Team Meeting')
      events.forEach((e) => {
        expect(e).toHaveProperty('id')
        expect(e).toHaveProperty('summary')
        expect(e).toHaveProperty('start')
        expect(e).toHaveProperty('end')
      })
    })

    it('should throw when access token is invalid', async () => {
      await expect(
        fetchCalendarEvents('invalid-token', {
          timeMin: '2024-03-01T00:00:00Z',
          timeMax: '2024-03-31T23:59:59Z',
        })
      ).rejects.toThrow()
    })
  })
})
