
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ReelCard } from '@/components/reels/ReelCard';
import { Settings, Bell, LogOut, Upload } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout, updateUser, requestAdminRole } = useAuth();
  const [activeTab, setActiveTab] = useState('uploads');
  
  // Fetch favorites
  const { data: favorites, isLoading: isFavoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiClient.getFavorites(),
    enabled: isAuthenticated,
  });
  
  // Fetch user uploads
  const { data: myUploads, isLoading: isUploadsLoading } = useQuery({
    queryKey: ['my-clips'],
    queryFn: () => apiClient.getMyUploads(),
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

  // Animation variants for staggered card animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } }
  };
  
  return (
    <div className="pb-20">
      <div className="relative">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-reelz-purple to-reelz-teal opacity-20 -z-10 overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
              backgroundSize: ["100% 100%", "200% 200%", "100% 100%"]
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)",
            }}
          />
        </div>
        
        <div className="backdrop-blur-sm pt-6 px-6 pb-10 rounded-b-3xl">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div 
              className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/80 mb-4 shadow-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {user.name}
            </h1>
            <p className="text-muted-foreground">@{user.username}</p>
            
            <motion.div 
              className="flex items-center space-x-8 mt-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div className="text-center glass px-4 py-2 rounded-xl" variants={itemVariants}>
                <p className="text-2xl font-bold">{user.stats.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </motion.div>
              <motion.div className="text-center glass px-4 py-2 rounded-xl" variants={itemVariants}>
                <p className="text-2xl font-bold">{user.stats.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </motion.div>
              <motion.div className="text-center glass px-4 py-2 rounded-xl" variants={itemVariants}>
                <p className="text-2xl font-bold">{user.stats.likes}</p>
                <p className="text-sm text-muted-foreground">Likes</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6 glass">
            <TabsTrigger value="uploads" className="relative">
              <Upload size={16} className="mr-2" /> 
              <span className="hidden sm:inline">My</span> Uploads
              <motion.div 
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                {myUploads?.length || 0}
              </motion.div>
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Bell size={16} className="mr-2" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings size={16} className="mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="uploads" className="space-y-6">
            {isUploadsLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i} 
                    className="aspect-[9/16] bg-muted rounded-lg" 
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ))}
              </div>
            ) : myUploads?.length ? (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {myUploads.map(reel => (
                  <motion.div 
                    key={reel.id} 
                    className="aspect-[9/16] h-[250px] sm:h-[300px]"
                    variants={itemVariants}
                  >
                    <ReelCard 
                      reel={reel} 
                      isFavorited={false}
                      showOwnerControls={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-12 glass rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No uploaded clips yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  Upload your first clip
                </Button>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-6">
            {isFavoritesLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i} 
                    className="aspect-[9/16] bg-muted rounded-lg" 
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ))}
              </div>
            ) : favorites?.length ? (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {favorites.map(reel => (
                  <motion.div 
                    key={reel.id} 
                    className="aspect-[9/16] h-[250px] sm:h-[300px]"
                    variants={itemVariants}
                  >
                    <ReelCard reel={reel} isFavorited={true} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-12 glass rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No saved reels yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  Browse reels
                </Button>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <motion.div 
                className="flex justify-between items-center p-4 glass rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
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
              </motion.div>
              
              <motion.div 
                className="flex justify-between items-center pt-2 p-4 glass rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
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
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  {user.isAdmin ? 'Already Admin' : 'Request'}
                </Button>
              </motion.div>
              
              <div className="pt-6">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    variant="destructive" 
                    className="w-full glass bg-destructive/80 hover:bg-destructive/90"
                    onClick={logout}
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </motion.div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
