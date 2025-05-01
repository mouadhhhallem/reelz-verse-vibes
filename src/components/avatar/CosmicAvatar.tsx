
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useMoodTheme } from "@/components/ui/mood-theme-provider";

interface CosmicAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showMood?: boolean;
}

type AvatarState = "idle" | "happy" | "sleeping" | "excited" | "greeting";

export const CosmicAvatar: React.FC<CosmicAvatarProps> = ({
  size = "md",
  className = "",
  showMood = true,
}) => {
  const { user } = useAuth();
  const { mood } = useMoodTheme();
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [level, setLevel] = useState(1);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  // Load user data from localStorage
  useEffect(() => {
    const savedLevel = localStorage.getItem("cosmic_avatar_level");
    if (savedLevel) {
      setLevel(parseInt(savedLevel));
    }
    
    const lastActive = localStorage.getItem("cosmic_avatar_last_active");
    if (lastActive) {
      setLastActivity(parseInt(lastActive));
    }
    
    // Check if avatar should be sleeping (no activity for 4+ hours)
    if (lastActive && Date.now() - parseInt(lastActive) > 4 * 60 * 60 * 1000) {
      setAvatarState("sleeping");
    } else {
      // Wake up with greeting
      setAvatarState("greeting");
      setTimeout(() => setAvatarState("idle"), 3000);
    }
    
    // Update last activity
    localStorage.setItem("cosmic_avatar_last_active", Date.now().toString());
  }, []);

  // Create effect for user interactions
  useEffect(() => {
    // Listen for significant interactions
    const handleInteraction = () => {
      // Update last activity time
      const currentTime = Date.now();
      localStorage.setItem("cosmic_avatar_last_active", currentTime.toString());
      setLastActivity(currentTime);
      
      // Don't change state if already in a special state
      if (avatarState !== "idle" && avatarState !== "sleeping") return;
      
      // Random chance to react
      if (Math.random() > 0.7) {
        setAvatarState("happy");
        setTimeout(() => setAvatarState("idle"), 2000);
      }
    };

    // Set up event listeners for significant actions
    document.addEventListener("click", handleInteraction);
    
    // Clean up
    return () => {
      document.removeEventListener("click", handleInteraction);
    };
  }, [avatarState]);
  
  // Level up effect
  const levelUp = () => {
    if (level < 10) {
      setLevel(prevLevel => {
        const newLevel = prevLevel + 1;
        localStorage.setItem("cosmic_avatar_level", newLevel.toString());
        setAvatarState("excited");
        setTimeout(() => setAvatarState("idle"), 3000);
        return newLevel;
      });
    }
  };

  // Random animations
  useEffect(() => {
    const randomStateInterval = setInterval(() => {
      // Only change if in idle state
      if (avatarState === "idle" || avatarState === "sleeping") {
        const states: AvatarState[] = ["idle", "happy", "greeting"];
        const randomState = states[Math.floor(Math.random() * states.length)];
        setAvatarState(randomState);
        
        // Reset back to idle after a delay
        if (randomState !== "idle") {
          setTimeout(() => setAvatarState("idle"), 3000);
        }
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(randomStateInterval);
  }, [avatarState]);

  // Mood-based color effects
  const getMoodGlow = () => {
    switch (mood) {
      case "energetic": return "shadow-orange-500/40";
      case "calm": return "shadow-blue-500/40";
      case "happy": return "shadow-yellow-500/40";
      case "sad": return "shadow-purple-500/40";
      default: return "shadow-white/30";
    }
  };
  
  // Animation variants for different states
  const avatarVariants = {
    idle: { 
      y: [0, -3, 0], 
      transition: { 
        y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        rotate: { duration: 0.2 }
      }
    },
    happy: { 
      rotate: [0, -5, 5, -5, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 }
    },
    sleeping: {
      rotate: 10,
      scale: 0.9,
      transition: { duration: 0.5 }
    },
    excited: {
      y: [0, -10, 0],
      scale: [1, 1.2, 1],
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.8 }
    },
    greeting: {
      rotate: [0, -5, 5, -5, 0],
      scale: [1, 1.1, 1],
      y: [0, -5, 0],
      transition: { duration: 1 }
    }
  };
  
  // Particles for special states
  const renderParticles = () => {
    if (avatarState === "excited" || avatarState === "happy") {
      return Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute w-1 h-1 rounded-full ${
            mood === "energetic" ? "bg-orange-400" :
            mood === "calm" ? "bg-blue-400" :
            mood === "happy" ? "bg-yellow-400" :
            mood === "sad" ? "bg-purple-400" : "bg-white"
          }`}
          initial={{ 
            x: 0, 
            y: 0,
            opacity: 1 
          }}
          animate={{ 
            x: (Math.random() - 0.5) * 30,
            y: (Math.random() - 0.5) * 30, 
            opacity: 0,
            scale: Math.random() * 2
          }}
          transition={{ 
            duration: 1 + Math.random(),
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        />
      ));
    }
    return null;
  };

  return (
    <motion.div 
      className={`relative flex flex-col items-center ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={levelUp}
    >
      <motion.div
        className="relative cursor-pointer"
        variants={avatarVariants}
        animate={avatarState}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Level indicator */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-background z-10">
          {level}
        </div>
        
        {/* Avatar with glow based on mood */}
        <Avatar 
          className={`${sizeClasses[size]} border-2 border-white/20 shadow-lg ${getMoodGlow()}`}
        >
          {user && (
            <AvatarImage 
              src={user.avatar} 
              alt={user.name || user.username} 
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-primary/20 text-lg">
            {user?.name?.charAt(0) || user?.username?.charAt(0) || "?"}
          </AvatarFallback>
          
          {/* Sleep indicator */}
          {avatarState === "sleeping" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xl"
              >
                💤
              </motion.div>
            </div>
          )}
          
          {/* Particles */}
          {renderParticles()}
        </Avatar>
      </motion.div>
      
      {/* Status or speech bubble */}
      <AnimatePresence>
        {avatarState !== "idle" && avatarState !== "sleeping" && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0 }}
            className="absolute -top-8 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md text-xs whitespace-nowrap"
          >
            {avatarState === "greeting" && "Hi there! 👋"}
            {avatarState === "happy" && "I like this! 😄"}
            {avatarState === "excited" && "Level Up! 🚀"}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mood indicator */}
      {showMood && (
        <div className="mt-1 text-xs text-center opacity-75">
          {mood === "energetic" && "Energetic ⚡"}
          {mood === "calm" && "Calm 🌊"}
          {mood === "happy" && "Happy 😄"}
          {mood === "sad" && "Melancholy 💜"}
          {mood === "neutral" && "Neutral ✨"}
        </div>
      )}
    </motion.div>
  );
};
