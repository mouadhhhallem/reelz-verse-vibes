
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  displayName?: string; // Added property
  bio?: string; // Added property
  reelsCount?: number; // Added property
  followersCount?: number; // Added property
  followingCount?: number; // Added property
  isAdmin: boolean;
  notificationsEnabled: boolean;
  stats: {
    followers: number;
    following: number;
    likes: number;
    views: number;
  }
}

export type VideoSourceType = 'youtube' | 'twitch' | 'vimeo' | 'tiktok' | 'upload' | 'other';

export interface Reel {
  id: string;
  title: string;
  description: string;
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  videoUrl: string;
  thumbnailUrl: string;
  isYouTube: boolean;
  youtubeId?: string;
  sourceType: VideoSourceType;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
  mood?: "energetic" | "calm" | "happy" | "sad" | "cosmic" | "nebula" | "aurora" | "neutral";
  clipStart?: number;
  clipDuration?: number;
  isFollowing?: boolean;
  isLocalVideo?: boolean;
}

export interface Comment {
  id: string;
  reelId: string;
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
  likes: number;
}

export type ViewMode = "bubble" | "classic";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type ReelMood = "energetic" | "calm" | "happy" | "sad" | "cosmic" | "nebula" | "aurora" | "neutral";
