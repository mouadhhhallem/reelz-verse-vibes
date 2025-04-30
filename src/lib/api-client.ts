
import { User, Reel, Comment } from '@/types';

// Mock data for users
const mockUsers: User[] = [
  {
    id: "user1",
    name: "Jane Smith",
    username: "janesmith",
    email: "jane.smith@example.com",
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
    email: "john.doe@example.com",
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

// Mock api client for development
class ApiClient {
  // Auth methods
  async login(username: string, password: string): Promise<User> {
    // In a real app, this would send a request to your backend
    console.log(`Login attempt: ${username}, ${password}`);
    if (password !== 'password') {
      throw new Error('Invalid password');
    }
    
    const user = mockUsers.find(u => u.username === username) || mockUsers[0];
    return user;
  }
  
  async getCurrentUser(): Promise<User> {
    // Simulate getting current user from session
    return mockUsers[0];
  }
  
  async updateUserSettings(userId: string, data: Partial<User>): Promise<User> {
    // Simulate updating user data
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    return { ...user, ...data };
  }
  
  async requestAdminRole(userId: string): Promise<void> {
    console.log(`Admin role requested for user ${userId}`);
    // In a real app, this would create a request in the database
  }
  
  // Reels methods
  async getReels(page: number = 1, limit: number = 10, filter: string = 'for-you'): Promise<Reel[]> {
    // Simulate fetching reels
    return Array(limit).fill(0).map((_, i) => ({
      id: `reel${i}`,
      title: `Awesome Reel ${i}`,
      description: "This is a description of the reel content, showing what the video is about.",
      userId: mockUsers[i % mockUsers.length].id,
      user: {
        name: mockUsers[i % mockUsers.length].name,
        username: mockUsers[i % mockUsers.length].username,
        avatar: mockUsers[i % mockUsers.length].avatar
      },
      videoUrl: "https://example.com/video.mp4",
      thumbnailUrl: `https://picsum.photos/seed/${i}/720/1280`,
      isYouTube: false,
      sourceType: "upload",
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString(),
      tags: ["fun", "gaming", "tutorial"].slice(0, Math.floor(Math.random() * 3) + 1),
      mood: ["energetic", "calm", "happy", "sad", "neutral"][Math.floor(Math.random() * 5)] as Reel["mood"],
      isFollowing: Math.random() > 0.5
    }));
  }
  
  async getMyUploads(): Promise<Reel[]> {
    // Simulate fetching user's uploaded reels
    return Array(3).fill(0).map((_, i) => ({
      id: `my-reel${i}`,
      title: `My Uploaded Reel ${i}`,
      description: "This is one of my uploaded reels",
      userId: mockUsers[0].id,
      user: {
        name: mockUsers[0].name,
        username: mockUsers[0].username,
        avatar: mockUsers[0].avatar
      },
      videoUrl: "https://example.com/my-video.mp4",
      thumbnailUrl: `https://picsum.photos/seed/my${i}/720/1280`,
      isYouTube: false,
      sourceType: "upload",
      views: Math.floor(Math.random() * 500),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      createdAt: new Date().toISOString(),
      tags: ["personal", "vlog"],
      mood: "energetic",
      isFollowing: false
    }));
  }
  
  async getFavorites(): Promise<Reel[]> {
    // Simulate fetching user's favorites
    return Array(5).fill(0).map((_, i) => ({
      id: `favorite${i}`,
      title: `Favorite Reel ${i}`,
      description: "This is one of my favorite reels",
      userId: mockUsers[i % mockUsers.length].id,
      user: {
        name: mockUsers[i % mockUsers.length].name,
        username: mockUsers[i % mockUsers.length].username,
        avatar: mockUsers[i % mockUsers.length].avatar
      },
      videoUrl: "https://example.com/favorite-video.mp4",
      thumbnailUrl: `https://picsum.photos/seed/fav${i}/720/1280`,
      isYouTube: i % 2 === 0,
      youtubeId: i % 2 === 0 ? "dQw4w9WgXcQ" : undefined,
      sourceType: i % 2 === 0 ? "youtube" : "upload",
      views: Math.floor(Math.random() * 100000),
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      tags: ["favorite", "trending", "music"].slice(0, Math.floor(Math.random() * 3) + 1),
      mood: ["energetic", "calm", "happy", "sad"][Math.floor(Math.random() * 4)] as Reel["mood"],
      isFollowing: true
    }));
  }
  
  async addToFavorites(reelId: string): Promise<void> {
    console.log(`Added reel ${reelId} to favorites`);
    // In a real app, this would update the database
  }
  
  async removeFromFavorites(reelId: string): Promise<void> {
    console.log(`Removed reel ${reelId} from favorites`);
    // In a real app, this would update the database
  }
  
  async addMultipleToFavorites(reelIds: string[]): Promise<void> {
    console.log(`Added reels ${reelIds.join(', ')} to favorites`);
    // In a real app, this would update the database
  }
  
  async deleteReel(reelId: string): Promise<void> {
    console.log(`Deleted reel ${reelId}`);
    // In a real app, this would update the database
  }
  
  async voteOnReel(reelId: string, vote: 'up' | 'down'): Promise<void> {
    console.log(`Voted ${vote} on reel ${reelId}`);
    // In a real app, this would update the database
  }
  
  // Comment methods
  async getComments(reelId: string): Promise<Comment[]> {
    // Simulate fetching comments for a reel
    return Array(5).fill(0).map((_, i) => ({
      id: `comment${i}`,
      reelId,
      userId: mockUsers[i % mockUsers.length].id,
      user: {
        name: mockUsers[i % mockUsers.length].name,
        username: mockUsers[i % mockUsers.length].username,
        avatar: mockUsers[i % mockUsers.length].avatar
      },
      text: `This is comment ${i} on the reel. Very cool content!`,
      createdAt: new Date().toISOString(),
      likes: Math.floor(Math.random() * 20)
    }));
  }
  
  async addComment(reelId: string, text: string): Promise<Comment> {
    // Simulate adding a comment
    console.log(`Added comment to reel ${reelId}: ${text}`);
    return {
      id: `new-comment-${Date.now()}`,
      reelId,
      userId: mockUsers[0].id,
      user: {
        name: mockUsers[0].name,
        username: mockUsers[0].username,
        avatar: mockUsers[0].avatar
      },
      text,
      createdAt: new Date().toISOString(),
      likes: 0
    };
  }
  
  // Leaderboard
  async getLeaderboard(): Promise<User[]> {
    // Return all mock users for the leaderboard
    return mockUsers;
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient();
