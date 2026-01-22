import { NO_COVER_PLACEHOLDER_URL } from "../constants/placeholders.ts";

type ImageSize = 'cover_small' | 'cover_big' | '720p' | '1080p' | 'screenshot_big' | 'screenshot_huge';

export function getCoverUrl (coverId: string | null, size: ImageSize = '720p'): string {
  if (!coverId) return NO_COVER_PLACEHOLDER_URL;
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${coverId}.jpg`;
}

export function getEsrbThumbnailUrl (esrbThumbnailId: string) {
  const baseServerUrl = import.meta.env.VITE_SERVER_URL;
  return `${baseServerUrl}/public/images/${esrbThumbnailId}.svg`;
}
