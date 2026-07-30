export function formatDate(date: string | Date, locale = 'vi-VN'): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid Date'
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
