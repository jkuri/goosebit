import { format, formatDistanceToNow } from "date-fns";

export function secondsToRecentDate(seconds: number): string {
  // Handle invalid or zero timestamps
  if (!seconds || seconds <= 0 || !Number.isFinite(seconds)) {
    return "Never";
  }

  // Handle timestamps that are too small (likely in wrong format)
  if (seconds < 1000000000) {
    return "Invalid date";
  }

  const date = new Date(seconds * 1000);

  // Check if the date is valid
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();

  const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff > 7) {
    return format(date, "MMM d, yyyy");
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Convert seconds ago to a human-readable "time ago" format
 * This is for when the API returns seconds since last contact, not a timestamp
 */
export function secondsAgoToRecentDate(secondsAgo: number): string {
  // Handle invalid values
  if (!Number.isFinite(secondsAgo) || secondsAgo < 0) {
    return "Never";
  }

  // Calculate the actual date by subtracting seconds from now
  const now = new Date();
  const date = new Date(now.getTime() - secondsAgo * 1000);

  // If more than 7 days ago, show the actual date
  const daysDiff = secondsAgo / (60 * 60 * 24);

  if (daysDiff > 7) {
    return format(date, "MMM d, yyyy");
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatTimestamp(seconds: number): string {
  if (!seconds || seconds <= 0) {
    return "Never";
  }

  const date = new Date(seconds * 1000);
  return format(date, "MMM d, yyyy 'at' h:mm a");
}
