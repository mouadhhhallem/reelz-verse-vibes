
import { VideoSourceType } from '@/types';

/**
 * Extract video IDs from different platform URLs
 */
export const extractVideoId = (url: string, platform: VideoSourceType = 'other'): string | null => {
  try {
    switch (platform) {
      case 'youtube': {
        // Handle youtube.com/watch?v=ID or youtu.be/ID
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
      }
      case 'twitch': {
        // Handle twitch.tv/videos/ID or clips
        if (url.includes('/videos/')) {
          const videoIdMatch = url.match(/\/videos\/(\d+)/);
          return videoIdMatch ? videoIdMatch[1] : null;
        } else if (url.includes('/clip/')) {
          const clipIdMatch = url.match(/\/clip\/([A-Za-z0-9-_]+)/);
          return clipIdMatch ? clipIdMatch[1] : null;
        }
        return null;
      }
      case 'vimeo': {
        // Handle vimeo.com/ID
        const regExp = /vimeo\.com\/([0-9]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
      }
      case 'tiktok': {
        // Handle TikTok URLs
        const regExp = /tiktok\.com\/(@[^\/]+\/video\/(\d+)|v\/(\d+)|@([^\/]+)\/(\d+))/;
        const match = url.match(regExp);
        return match ? (match[2] || match[3] || match[5]) : null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
};

/**
 * Get embed URL for a platform based on video ID
 */
export const getEmbedUrl = (videoId: string, platform: VideoSourceType): string => {
  switch (platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}`;
    case 'twitch':
      return `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}`;
    default:
      return '';
  }
};

/**
 * Format duration in seconds to "mm:ss" format
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Generate thumbnail URL from video (mock implementation)
 */
export const generateThumbnailUrl = (videoId: string, platform: VideoSourceType): string => {
  switch (platform) {
    case 'youtube':
      return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    case 'twitch':
      return `https://picsum.photos/seed/${videoId}/640/360`; // Mock
    case 'vimeo':
      return `https://picsum.photos/seed/${videoId}/640/360`; // Mock
    default:
      return `https://picsum.photos/seed/${videoId}/640/360`; // Mock
  }
};
