export const monthLabel = (date: string): string => new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(date));
