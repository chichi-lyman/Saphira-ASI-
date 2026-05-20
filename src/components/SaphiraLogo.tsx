import React, { useState } from 'react';
import { Moon, TreePalm } from 'lucide-react';
import { cn } from '../lib/utils';

interface SaphiraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SaphiraLogo({ className, size = 'md' }: SaphiraLogoProps) {
  const [imageError, setImageError] = useState(false);

  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: { moon: 8, tree: 16 },
    md: { moon: 16, tree: 32 },
    lg: { moon: 24, tree: 48 }
  };

  if (!imageError) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl shadow-xl shadow-pink-500/20", dimensions[size], className)}>
        <img 
          src="/logo.png" 
          alt="Saphira Logo" 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback to SVG if /logo.png is not found
  return (
    <div className={cn("bg-gradient-to-tr from-pink-600 via-pink-500 to-fuchsia-500 rounded-2xl shadow-xl shadow-pink-500/20 relative overflow-hidden flex items-center justify-center", dimensions[size], className)}>
      <Moon size={iconSizes[size].moon} className="absolute top-[10%] left-[10%] text-white fill-white" />
      <TreePalm size={iconSizes[size].tree} className="text-white relative z-10" />
    </div>
  );
}
