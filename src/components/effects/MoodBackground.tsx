
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ReelMood } from '@/types';

interface MoodBackgroundProps {
  mood: ReelMood | string;
  intensity?: number; // 0 to 1
  enableParticles?: boolean;
  enableGlow?: boolean;
}

export const MoodBackground: React.FC<MoodBackgroundProps> = ({ 
  mood = 'neutral',
  intensity = 0.5,
  enableParticles = true,
  enableGlow = true
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: string;
    y: string;
    scale: number;
    rotation: number;
    duration: number;
    emoji: string;
  }>>([]);

  // Generate mood-based emojis
  const getMoodEmojis = (mood: ReelMood | string): string[] => {
    switch(mood) {
      case 'energetic': return ['⚡', '🔥', '💪', '🚀', '✨'];
      case 'calm': return ['🧘', '🌊', '🍃', '🌸', '☁️'];
      case 'happy': return ['😊', '😄', '🎉', '🥳', '💯'];
      case 'sad': return ['😢', '💔', '🌧️', '🥀', '🫂'];
      case 'cosmic': return ['🌌', '🌠', '🪐', '🌟', '👽'];
      case 'nebula': return ['🌌', '💫', '✨', '🌟', '🪐'];
      case 'aurora': return ['✨', '🌈', '🌠', '🌟', '🔮'];
      default: return ['😎', '✌️', '🔍', '🎬', '📱'];
    }
  };

  // Initialize particles
  useEffect(() => {
    if (!enableParticles) return;
    
    const count = Math.floor(5 + intensity * 15); // 5-20 particles based on intensity
    const emojis = getMoodEmojis(mood);
    
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      scale: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      duration: 15 + Math.random() * 20,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));
    
    setParticles(newParticles);
  }, [mood, intensity, enableParticles]);

  // Get mood-based glow color
  const getGlowColor = () => {
    if (!enableGlow) return 'none';
    
    switch(mood) {
      case 'energetic': return '0 0 30px 5px rgba(255, 69, 0, 0.4)';
      case 'calm': return '0 0 30px 5px rgba(0, 191, 255, 0.4)';
      case 'happy': return '0 0 30px 5px rgba(255, 215, 0, 0.4)';
      case 'sad': return '0 0 30px 5px rgba(106, 90, 205, 0.4)';
      case 'cosmic': return '0 0 30px 5px rgba(138, 43, 226, 0.4)';
      case 'nebula': return '0 0 30px 5px rgba(255, 105, 180, 0.4)';
      case 'aurora': return '0 0 30px 5px rgba(57, 255, 20, 0.4)';
      default: return '0 0 30px 5px rgba(169, 169, 169, 0.3)';
    }
  };

  // Get mood-based background effect
  const getMoodBackground = () => {
    switch(mood) {
      case 'energetic': return 'bg-gradient-to-br from-orange-500/10 to-red-500/10';
      case 'calm': return 'bg-gradient-to-br from-blue-400/10 to-teal-500/10';
      case 'happy': return 'bg-gradient-to-br from-yellow-400/10 to-amber-500/10';
      case 'sad': return 'bg-gradient-to-br from-indigo-500/10 to-purple-600/10';
      case 'cosmic': return 'bg-gradient-to-br from-violet-600/10 via-purple-500/10 to-indigo-700/10';
      case 'nebula': return 'bg-gradient-to-br from-pink-400/10 via-purple-500/10 to-indigo-600/10';
      case 'aurora': return 'bg-gradient-to-br from-green-400/10 via-cyan-500/10 to-blue-600/10';
      default: return 'bg-gradient-to-br from-gray-500/10 to-gray-700/10';
    }
  };

  return (
    <>
      {/* Background ambient effect */}
      <div className={`absolute inset-0 ${getMoodBackground()} pointer-events-none`}></div>
      
      {/* 3D particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ filter: 'blur(0.5px)' }}>
        {particles.map((particle) => (
          <motion.div
            key={`mood-particle-${particle.id}`}
            className="absolute text-4xl sm:text-5xl md:text-6xl"
            style={{ 
              opacity: 0.15 + (intensity * 0.2),
              x: particle.x,
              y: particle.y,
              boxShadow: getGlowColor(),
            }}
            initial={{ rotate: 0, scale: particle.scale * 0.8 }}
            animate={{ 
              rotate: [particle.rotation, particle.rotation + 180, particle.rotation + 360],
              scale: [particle.scale * 0.8, particle.scale, particle.scale * 0.8],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default MoodBackground;
