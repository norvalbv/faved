import { formatDistanceToNow } from 'date-fns'

export const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return 'Recently'
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch (error) {
    return 'Recently'
  }
} 