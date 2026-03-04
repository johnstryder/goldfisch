import type { CalendarEvent } from '../lib/demoCalendarEvents'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7
  const days: (number | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  while (days.length < totalCells) days.push(null)
  return days
}

function eventsForDay(events: CalendarEvent[], year: number, month: number, day: number): CalendarEvent[] {
  const pad = (n: number) => String(n).padStart(2, '0')
  const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
  return events.filter((e) => {
    const start = e.start.slice(0, 10)
    return start === dateStr
  })
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

interface CalendarViewProps {
  year: number
  month: number
  events: CalendarEvent[]
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function CalendarView({ year, month, events, onPrevMonth, onNextMonth }: CalendarViewProps) {
  const days = getDaysInMonth(year, month)
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="rounded-lg border border-surface bg-surface/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface bg-surface/50">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-md text-muted hover:text-text hover:bg-glass transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-text">{monthName}</h2>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-md text-muted hover:text-text hover:bg-glass transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 text-xs font-medium text-muted border-b border-surface">
        {WEEKDAYS.map((d) => (
          <div key={d} className="p-2 text-center border-r border-surface last:border-r-0">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr min-h-[400px]">
        {days.map((day, i) => {
          const dayEvents = day !== null ? eventsForDay(events, year, month, day) : []
          const isToday =
            day !== null &&
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year

          return (
            <div
              key={i}
              className={`min-h-[80px] p-2 border-r border-b border-surface last:border-r-0 flex flex-col ${
                day === null ? 'bg-background/50' : 'bg-surface/20'
              }`}
            >
              {day !== null && (
                <>
                  <span
                    className={`text-sm font-medium mb-1 inline-flex items-center justify-center ${
                      isToday ? 'w-7 h-7 rounded-full bg-primary text-primary-foreground' : 'text-muted'
                    }`}
                  >
                    {day}
                  </span>
                  <div className="flex-1 space-y-1 overflow-y-auto">
                    {dayEvents.slice(0, 3).map((evt) => (
                      <div
                        key={evt.id}
                        className="text-xs px-2 py-1 rounded bg-primary/20 text-primary truncate"
                        title={`${evt.summary} ${evt.isAllDay ? '' : formatTime(evt.start)}`}
                      >
                        {!evt.isAllDay && (
                          <span className="text-muted mr-1">{formatTime(evt.start)}</span>
                        )}
                        {evt.summary}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
