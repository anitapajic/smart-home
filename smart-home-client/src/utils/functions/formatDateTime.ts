import { format, parseISO } from "date-fns";

export function formatDate(dateTimeString: string) {
  const dateTime = parseISO(dateTimeString);
  return format(dateTime, " dd.MM.yyyy.");
}

export function formatDateTime(dateTimeString: string) {
    const dateTime = parseISO(dateTimeString);
    return format(dateTime, " dd.MM.yyyy. HH:mm");
  }

export function formatTime(dateTimeString: string | undefined) {
  if (!dateTimeString) {
    return "N/A"; 
  }
  const dateTime = parseISO(dateTimeString);
  return format(dateTime, " HH:mm");
}