
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

interface WowButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg";
}

type WowContent = {
  type: "quote" | "image" | "animation" | "fact" | "poem";
  content: string;
  title?: string;
};

export const WowButton = ({ className, size = "default" }: WowButtonProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [content, setContent] = useState<WowContent | null>(null);
  
  useEffect(() => {
    // Check if WOW was used today
    const lastUsed = localStorage.getItem("wow_last_used");
    if (lastUsed) {
      const lastUsedDate = new Date(lastUsed);
      const today = new Date();
      if (
        lastUsedDate.getDate() === today.getDate() &&
        lastUsedDate.getMonth() === today.getMonth() &&
        lastUsedDate.getFullYear() === today.getFullYear()
      ) {
        setIsAvailable(false);
      }
    }
  }, []);

  const generateWowContent = (): WowContent => {
    const types = ["quote", "image", "animation", "fact", "poem"];
    const randomType = types[Math.floor(Math.random() * types.length)] as WowContent["type"];
    
    const quotes = [
      "The cosmos is within us. We are made of star-stuff.",
      "Look deep into nature, and then you will understand everything better.",
      "In the midst of chaos, there is also opportunity.",
      "Your present circumstances don't determine where you can go; they merely determine where you start.",
      "Everything you can imagine is real.",
    ];
    
    const poems = [
      "Stars above, dreams below\nIn cosmic dance, we flow\nInfinite wonder, timeless grace\nStardust trails in endless space",
      "Whispers of light in darkness deep\nSecrets that only dreamers keep\nYour soul a vessel of the stars\nCarrying light from near and far",
      "Between the worlds of now and then\nWhere dreams unfold and start again\nYou're magic made of flesh and bone\nA universe that's all your own"
    ];
    
    const facts = [
      "If two pieces of the same type of metal touch in space, they will bond and be permanently stuck together.",
      "There is a planet made of diamonds twice the size of Earth.",
      "Time passes faster at your face than at your feet.",
      "An octopus has three hearts, nine brains, and blue blood.",
      "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat."
    ];
    
    const images = [
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986",
      "https://images.unsplash.com/photo-1539593395743-7da5ee10ff07",
      "https://images.unsplash.com/photo-1566砖bef9711520-55de6a3946e4",
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0"
    ];
    
    const animations = [
      "✨🌟⭐💫✨",
      "🌌🪐🚀🌠✨",
      "🎆🎇✨🎉🎊",
      "🔮✨🌈🦄🧚‍♀️"
    ];
    
    switch (randomType) {
      case "quote":
        return {
          type: "quote",
          content: quotes[Math.floor(Math.random() * quotes.length)],
          title: "Cosmic Wisdom"
        };
      case "poem":
        return {
          type: "poem",
          content: poems[Math.floor(Math.random() * poems.length)],
          title: "Stellar Poetry"
        };
      case "fact":
        return {
          type: "fact",
          content: facts[Math.floor(Math.random() * facts.length)],
          title: "Cosmic Fact"
        };
      case "image":
        return {
          type: "image",
          content: images[Math.floor(Math.random() * images.length)],
          title: "Visual Wonder"
        };
      case "animation":
        return {
          type: "animation",
          content: animations[Math.floor(Math.random() * animations.length)],
          title: "Cosmic Animation"
        };
      default:
        return {
          type: "quote",
          content: quotes[0],
          title: "Cosmic Default"
        };
    }
  };

  const handleWowClick = () => {
    if (!isAvailable) {
      toast.info("Your daily WOW is already used", {
        description: "Come back tomorrow for a new surprise!",
      });
      return;
    }
    
    // Start animation sequence
    setIsAnimating(true);
    
    // Generate content for showing
    const newContent = generateWowContent();
    setContent(newContent);
    
    // Mark as used
    localStorage.setItem("wow_last_used", new Date().toISOString());
    
    // Show toast based on content type
    setTimeout(() => {
      setShowContent(true);
      setIsAvailable(false);
      
      // Display different toast based on content type
      switch(newContent.type) {
        case "quote":
        case "poem":
        case "fact":
          toast(newContent.title, {
            description: newContent.content,
            duration: 8000,
            icon: "✨",
          });
          break;
        case "image":
          // Will be shown in modal
          break;
        case "animation":
          // Will be shown in modal
          toast(newContent.title, {
            description: newContent.content,
            duration: 5000,
            icon: "🌠",
          });
          break;
      }
      
      // End animation after delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
    }, 1000);
  };

  return (
    <>
      <motion.div 
        className="relative"
        whileHover={isAvailable ? { scale: 1.05 } : { scale: 1 }}
        whileTap={isAvailable ? { scale: 0.95 } : { scale: 1 }}
      >
        <Button
          variant="cosmic"
          size={size}
          onClick={handleWowClick}
          disabled={!isAvailable || isAnimating}
          className={`relative overflow-hidden font-bold ${className}`}
        >
          {/* Pulsing ring when available */}
          {isAvailable && (
            <motion.div 
              className="absolute inset-0 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 z-0"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Button content */}
          <span className="relative z-10 flex items-center gap-2">
            {isAnimating ? (
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Star className="size-4" />
              </motion.div>
            ) : (
              <Sparkles className={`size-4 ${isAvailable ? "text-yellow-300" : "text-gray-400"}`} />
            )}
            WOW
          </span>
          
          {/* Particles when animating */}
          <AnimatePresence>
            {isAnimating && (
              <>
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-yellow-300"
                    initial={{ 
                      x: 0, 
                      y: 0,
                      opacity: 1 
                    }}
                    animate={{ 
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50, 
                      opacity: 0,
                      scale: Math.random() * 3
                    }}
                    transition={{ 
                      duration: 1 + Math.random(),
                      ease: "easeOut"
                    }}
                    exit={{ opacity: 0 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
      
      {/* Content modal */}
      <AnimatePresence>
        {showContent && content && content.type === "image" && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContent(false)}
          >
            <motion.div
              className="relative max-w-lg w-full bg-background/90 backdrop-blur-xl rounded-xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <h3 className="text-xl font-bold text-center mb-2">
                  {content.title || "Daily Wonder"}
                </h3>
                {content.type === "image" && (
                  <img 
                    src={content.content} 
                    alt="Daily wonder" 
                    className="w-full h-auto rounded-lg"
                  />
                )}
                <div className="mt-4 flex justify-center">
                  <Button onClick={() => setShowContent(false)}>Close</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
