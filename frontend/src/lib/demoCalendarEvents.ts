export type CalendarEvent = {
  id: string
  summary: string
  start: string
  end: string
  htmlLink?: string
  isAllDay?: boolean
}

/**
 * Demo calendar events for customer demos.
 * Realistic client meetings, follow-ups, and business events.
 */
export function getDemoEvents(baseDate: Date): CalendarEvent[] {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const pad = (n: number) => String(n).padStart(2, '0')

  return [
    {
      id: 'demo-1',
      summary: 'Premier Client: Acme Corp Q4 Review',
      start: `${year}-${pad(month + 1)}-05T09:00:00`,
      end: `${year}-${pad(month + 1)}-05T10:30:00`,
      isAllDay: false
    },
    {
      id: 'demo-2',
      summary: 'Core Client: Follow-up Call',
      start: `${year}-${pad(month + 1)}-05T14:00:00`,
      end: `${year}-${pad(month + 1)}-05T14:30:00`,
      isAllDay: false
    },
    {
      id: 'demo-3',
      summary: 'Strategy Session - 80/20 Review',
      start: `${year}-${pad(month + 1)}-06T10:00:00`,
      end: `${year}-${pad(month + 1)}-06T11:00:00`,
      isAllDay: false
    },
    {
      id: 'demo-4',
      summary: 'Drainy 80: Outreach Batch',
      start: `${year}-${pad(month + 1)}-06T15:00:00`,
      end: `${year}-${pad(month + 1)}-06T16:00:00`,
      isAllDay: false
    },
    {
      id: 'demo-5',
      summary: 'Premier Client: Board Presentation',
      start: `${year}-${pad(month + 1)}-10T09:00:00`,
      end: `${year}-${pad(month + 1)}-10T11:00:00`,
      isAllDay: false
    },
    {
      id: 'demo-6',
      summary: 'Team Standup',
      start: `${year}-${pad(month + 1)}-10T09:00:00`,
      end: `${year}-${pad(month + 1)}-10T09:15:00`,
      isAllDay: false
    },
    {
      id: 'demo-7',
      summary: 'Quarterly Planning',
      start: `${year}-${pad(month + 1)}-12T13:00:00`,
      end: `${year}-${pad(month + 1)}-12T17:00:00`,
      isAllDay: false
    },
    {
      id: 'demo-8',
      summary: 'Client Onboarding - New Premier',
      start: `${year}-${pad(month + 1)}-15T10:00:00`,
      end: `${year}-${pad(month + 1)}-15T11:30:00`,
      isAllDay: false
    },
    {
      id: 'demo-9',
      summary: 'Revenue Review',
      start: `${year}-${pad(month + 1)}-18T14:00:00`,
      end: `${year}-${pad(month + 1)}-18T15:00:00`,
      isAllDay: false
    },
    {
      id: 'demo-10',
      summary: 'All Hands',
      start: `${year}-${pad(month + 1)}-20T09:00:00`,
      end: `${year}-${pad(month + 1)}-20T10:00:00`,
      isAllDay: false
    }
  ]
}
