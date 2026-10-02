import { formatDistanceToNow, format } from 'date-fns';

export function formatRelativeTime(date: Date | string | number): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
}

export function formatDate(date: Date | string | number, formatStr = 'MMM d, yyyy'): string {
  try {
    return format(new Date(date), formatStr);
  } catch {
    return '';
  }
}
