import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ContentType = "video_topic" | "draft_script" | "draft_video" | "live_video"

export interface Submission {
  id: string
  type: ContentType
  content: string
  status: "pending" | "approved" | "rejected"
  feedback?: string
  createdAt: Date
  updatedAt: Date
} 