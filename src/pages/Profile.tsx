
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ReelCard } from '@/components/reels/ReelCard';
import { Settings, Bell, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout, updateUser, requestAdminRole } = useAuth();
  const [activeTab, setActiveTab] = useState('saved');
  
  // Fetch favorites
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiClient.getFavorites(),
    enabled: isAuthenticated,
  });
  
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your profile</p>
        <Button>Log In</Button>
      </div>
    );
  }
  
  const toggleNotifications = async () => {
    await updateUser({ notificationsEnabled: !user.notificationsEnabled });
  };
  
  const handleRequestAdmin = async () => {
    await requestAdminRole();
  };
  
  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-reelz-purple to-reelz-teal text-white p-6 rounded-b-3xl">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mb-4">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-white/80">@{user.username}</p>
          
          <div className="flex items-center space-x-8 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{user.stats.followers}</p>
              <p className="text-sm text-white/80">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user.stats.following}</p>
              <p className="text-sm text-white/80">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user.stats.likes}</p>
              <p className="text-sm text-white/80">Likes</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="saved">Saved Reels</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-[9/16] bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : favorites?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {favorites.map(reel => (
                  <div key={reel.id} className="aspect-[9/16] h-[250px] sm:h-[300px]">
                    <ReelCard reel={reel} isFavorited={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No saved reels yet</p>
                <Button variant="outline" className="mt-4">Browse reels</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-medium">Enable Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified about trending reels and updates
                  </p>
                </div>
                <Switch 
                  checked={user.notificationsEnabled}
                  onCheckedChange={toggleNotifications}
                />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="space-y-1">
                  <h3 className="font-medium">Request Admin Role</h3>
                  <p className="text-sm text-muted-foreground">
                    Apply to become a Reelz administrator
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={user.isAdmin}
                  onClick={handleRequestAdmin}
                >
                  {user.isAdmin ? 'Already Admin' : 'Request'}
                </Button>
              </div>
              
              <div className="pt-6">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={logout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
