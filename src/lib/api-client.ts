
import { Reel, User, Comment } from "@/types";

// Base API URL - in a real app, this would be your actual API endpoint
const API_BASE_URL = "/api";

// Wait helper for simulating API delays
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for users
const mockUsers: User[] = [
  {
    id: "user1",
    name: "Jane Smith",
    username: "janesmith",
    avatar: "https://i.pravatar.cc/150?img=1",
    isAdmin: false,
    notificationsEnabled: true,
    stats: {
      followers: 1452,
      following: 231,
      likes: 24500,
      views: 345200
    }
  },
  {
    id: "user2",
    name: "John Doe",
    username: "johndoe",
    avatar: "https://i.pravatar.cc/150?img=2",
    isAdmin: true,
    notificationsEnabled: false,
    stats: {
      followers: 8904,
      following: 156,
      likes: 125600,
      views: 1345200
    }
  }
];

// Mock data for reels
const generateMockReels = (): Reel[] => {
  // YouTube videos suitable for short-form content
  const youtubeIds = [
    "QH2-TGUlwu4", // Nyan Cat
    "dQw4w9WgXcQ", // Rick Astley
    "9bZkp7q19f0", // Gangnam Style
    "kJQP7kiw5Fk", // Despacito
    "jofNR_WkoCE", // The Fox
    "9C_HReR_McQ", // Don't Hug Me I'm Scared
    "ZyhrYis509A", // Barbie Girl
    "feA64wXhbjo", // Shooting Stars
    "y6120QOlsfU", // Darude - Sandstorm
    "F-X4SLhorvw", // All Star
  ];
  
  const moods: ("energetic" | "calm" | "happy" | "sad" | "neutral")[] = [
    "energetic", "calm", "happy", "sad", "neutral"
  ];

  return Array(20).fill(0).map((_, i) => ({
    id: `reel${i+1}`,
    title: `Amazing Reel ${i+1}`,
    description: `This is a description for reel ${i+1}. It showcases something interesting and engaging for viewers.`,
    userId: i % 2 === 0 ? "user1" : "user2",
    user: i % 2 === 0 ? {
      name: "Jane Smith",
      username: "janesmith",
      avatar: "https://i.pravatar.cc/150?img=1"
    } : {
      name: "John Doe",
      username: "johndoe",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    videoUrl: i % 3 === 0 
      ? `https://www.youtube.com/embed/${youtubeIds[i % youtubeIds.length]}` 
      : `https://samplelib.com/lib/preview/mp4/sample-${(i % 5) + 1}.mp4`,
    thumbnailUrl: `https://picsum.photos/500/800?random=${i+1}`,
    isYouTube: i % 3 === 0,
    youtubeId: i % 3 === 0 ? youtubeIds[i % youtubeIds.length] : undefined,
    views: Math.floor(Math.random() * 10000) + 500,
    likes: Math.floor(Math.random() * 1000) + 50,
    comments: Math.floor(Math.random() * 100) + 5,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["trending", "funny", "cool", "awesome", "viral"].slice(0, Math.floor(Math.random() * 4) + 1),
    mood: moods[i % moods.length]
  }));
};

const mockReels = generateMockReels();

// Favorite reels storage
let favoriteReels: string[] = [];

// API client singleton
class ApiClient {
  // Auth methods
  async login(username: string, password: string): Promise<User> {
    await wait(800);
    
    const user = mockUsers.find(u => u.username === username);
    if (!user || password !== "password") {
      throw new Error("Invalid credentials");
    }
    
    return user;
  }
  
  async getCurrentUser(): Promise<User> {
    await wait(300);
    // Just return first user for mock
    return mockUsers[0];
  }
  
  async updateUserSettings(userId: string, settings: Partial<User>): Promise<User> {
    await wait(500);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...settings };
    return mockUsers[userIndex];
  }
  
  async requestAdminRole(userId: string): Promise<{ success: boolean }> {
    await wait(1000);
    return { success: true };
  }
  
  // Reels methods
  async getReels(page = 1, limit = 10): Promise<Reel[]> {
    await wait(600);
    return mockReels.slice((page - 1) * limit, page * limit);
  }
  
  async getReelById(id: string): Promise<Reel | undefined> {
    await wait(400);
    return mockReels.find(reel => reel.id === id);
  }
  
  async searchReels(query: string, tags?: string[]): Promise<Reel[]> {
    await wait(700);
    let filtered = mockReels;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(reel => 
        reel.title.toLowerCase().includes(lowerQuery) || 
        reel.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (tags && tags.length > 0) {
      filtered = filtered.filter(reel => 
        tags.some(tag => reel.tags.includes(tag))
      );
    }
    
    return filtered;
  }
  
  async getTrendingTags(): Promise<{tag: string, count: number}[]> {
    await wait(500);
    return [
      { tag: "trending", count: 1254 },
      { tag: "funny", count: 876 },
      { tag: "viral", count: 654 },
      { tag: "dance", count: 432 },
      { tag: "challenge", count: 345 }
    ];
  }
  
  async getCategories(): Promise<{id: string, name: string, icon: string, color: string}[]> {
    await wait(400);
    return [
      { id: "music", name: "Music", icon: "music", color: "#7C3AED" },
      { id: "comedy", name: "Comedy", icon: "laugh", color: "#F59E0B" },
      { id: "dance", name: "Dance", icon: "dancing", color: "#EC4899" },
      { id: "sports", name: "Sports", icon: "trophy", color: "#10B981" },
      { id: "food", name: "Food", icon: "utensils", color: "#EF4444" }
    ];
  }
  
  // Favorites methods
  async getFavorites(): Promise<Reel[]> {
    await wait(600);
    return mockReels.filter(reel => favoriteReels.includes(reel.id));
  }
  
  async addToFavorites(reelId: string): Promise<{ success: boolean }> {
    await wait(400);
    if (!favoriteReels.includes(reelId)) {
      favoriteReels.push(reelId);
    }
    return { success: true };
  }
  
  async removeFromFavorites(reelId: string): Promise<{ success: boolean }> {
    await wait(400);
    favoriteReels = favoriteReels.filter(id => id !== reelId);
    return { success: true };
  }
  
  async addMultipleToFavorites(reelIds: string[]): Promise<{ success: boolean }> {
    await wait(700);
    reelIds.forEach(id => {
      if (!favoriteReels.includes(id)) {
        favoriteReels.push(id);
      }
    });
    return { success: true };
  }
  
  // Upload methods
  async uploadVideo(file: File | string, metadata: {title: string, description: string, tags: string[]}): Promise<Reel> {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await wait(200);
      // In a real implementation, you would emit progress events
      console.log(`Upload progress: ${i}%`);
    }
    
    // Create new reel
    const newReel: Reel = {
      id: `reel${Date.now()}`,
      title: metadata.title,
      description: metadata.description,
      userId: mockUsers[0].id,
      user: {
        name: mockUsers[0].name,
        username: mockUsers[0].username,
        avatar: mockUsers[0].avatar
      },
      videoUrl: typeof file === 'string' && file.includes('youtube.com') 
        ? file 
        : URL.createObjectURL(file instanceof File ? file : new Blob()),
      thumbnailUrl: `https://picsum.photos/500/800?random=${Date.now()}`,
      isYouTube: typeof file === 'string' && file.includes('youtube.com'),
      youtubeId: typeof file === 'string' && file.includes('youtube.com') 
        ? file.split('v=')[1]?.split('&')[0] 
        : undefined,
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      tags: metadata.tags,
      mood: "neutral"
    };
    
    mockReels.unshift(newReel);
    return newReel;
  }
  
  // Helper methods
  extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }
}

export const apiClient = new ApiClient();
