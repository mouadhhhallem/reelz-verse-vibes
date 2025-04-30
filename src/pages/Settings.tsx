
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Bell,
  User,
  Lock,
  Moon,
  Sun,
  Languages,
  Shield,
  LogOut,
  Save
} from 'lucide-react';

const Settings = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const { viewMode, toggleViewMode } = useViewMode();
  
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'english',
    notificationsEnabled: user?.notificationsEnabled || false,
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user data
    if (isAuthenticated && user) {
      await updateUser({
        name: formData.name,
        username: formData.username,
        notificationsEnabled: formData.notificationsEnabled
      });
      
      toast.success('Settings saved successfully');
    }
    
    setIsSubmitting(false);
  };
  
  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Password changed successfully');
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    
    setIsSubmitting(false);
  };
  
  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to access settings</p>
        <Button>Log In</Button>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h1 
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Settings
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <CardContent className="p-3">
              <div className="flex flex-col h-auto bg-transparent space-y-1">
                <Button 
                  variant={activeTab === 'account' ? 'subtle' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('account')}
                >
                  <User size={16} />
                  Account
                </Button>
                
                <Button 
                  variant={activeTab === 'appearance' ? 'subtle' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('appearance')}
                >
                  <Moon size={16} />
                  Appearance
                </Button>
                
                <Button 
                  variant={activeTab === 'notifications' ? 'subtle' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell size={16} />
                  Notifications
                </Button>
                
                <Button 
                  variant={activeTab === 'security' ? 'subtle' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('security')}
                >
                  <Lock size={16} />
                  Security
                </Button>
                
                <Button 
                  variant={activeTab === 'language' ? 'subtle' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('language')}
                >
                  <Languages size={16} />
                  Language
                </Button>
                
                <Button 
                  variant={activeTab === 'privacy' ? 'subtle' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('privacy')}
                >
                  <Shield size={16} />
                  Privacy
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6"
          >
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            {activeTab === 'account' && (
              <div className="space-y-6 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account details and profile information.
                  </CardDescription>
                </CardHeader>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-white/5"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="bg-white/5"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white/5"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="cosmic" 
                    onClick={handleSaveSettings}
                    disabled={isSubmitting}
                  >
                    <Save size={16} className="mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div className="space-y-6 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun size={16} />
                      <Switch
                        checked={viewMode === 'bubble'}
                        onCheckedChange={toggleViewMode}
                      />
                      <Moon size={16} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reduced Motion</p>
                      <p className="text-sm text-muted-foreground">
                        Minimize animations for accessibility
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">High Contrast</p>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="space-y-6 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new activity
                      </p>
                    </div>
                    <Switch
                      name="notificationsEnabled"
                      checked={formData.notificationsEnabled}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, notificationsEnabled: checked }))
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      name="emailNotifications"
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, emailNotifications: checked }))
                      }
                      disabled={!formData.notificationsEnabled}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      name="pushNotifications"
                      checked={formData.pushNotifications}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, pushNotifications: checked }))
                      }
                      disabled={!formData.notificationsEnabled}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="cosmic" 
                    onClick={handleSaveSettings}
                    disabled={isSubmitting}
                  >
                    <Save size={16} className="mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your password and security settings.
                  </CardDescription>
                </CardHeader>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="bg-white/5"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="bg-white/5"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-white/5"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="cosmic" 
                    onClick={handleChangePassword}
                    disabled={isSubmitting || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  >
                    <Lock size={16} className="mr-2" />
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'language' && (
              <div className="space-y-6 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Language</CardTitle>
                  <CardDescription>
                    Change your preferred language.
                  </CardDescription>
                </CardHeader>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="language">Language</Label>
                    <select 
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="p-3 rounded-md bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="japanese">Japanese</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="cosmic" 
                    onClick={handleSaveSettings}
                    disabled={isSubmitting}
                  >
                    <Save size={16} className="mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div className="space-y-6 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Privacy</CardTitle>
                  <CardDescription>
                    Control your privacy settings and account visibility.
                  </CardDescription>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Control who can see your profile
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button 
                        variant={formData.profileVisibility === 'public' ? 'cosmic' : 'outline'}
                        size="sm"
                        className="flex justify-center"
                        onClick={() => setFormData(prev => ({ ...prev, profileVisibility: 'public' }))}
                      >
                        Public
                      </Button>
                      <Button 
                        variant={formData.profileVisibility === 'followers' ? 'cosmic' : 'outline'}
                        size="sm" 
                        className="flex justify-center"
                        onClick={() => setFormData(prev => ({ ...prev, profileVisibility: 'followers' }))}
                      >
                        Followers Only
                      </Button>
                      <Button 
                        variant={formData.profileVisibility === 'private' ? 'cosmic' : 'outline'}
                        size="sm" 
                        className="flex justify-center"
                        onClick={() => setFormData(prev => ({ ...prev, profileVisibility: 'private' }))}
                      >
                        Private
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Activity Status</p>
                      <p className="text-sm text-muted-foreground">
                        Let others know when you're active
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow Tagging</p>
                      <p className="text-sm text-muted-foreground">
                        Let others tag you in reels and comments
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="cosmic" 
                    onClick={handleSaveSettings}
                    disabled={isSubmitting}
                  >
                    <Save size={16} className="mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
