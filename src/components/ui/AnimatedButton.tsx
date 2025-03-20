
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  showArrow = false,
  className,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]";
  
  const variantStyles = {
    primary: "bg-primary text-white shadow-lg hover:shadow-primary/20 focus:ring-4 focus:ring-primary/30",
    secondary: "bg-secondary text-foreground shadow-md hover:shadow-lg focus:ring-4 focus:ring-secondary/50",
    outline: "bg-transparent text-foreground border border-border hover:bg-secondary/50 focus:ring-4 focus:ring-primary/20",
    ghost: "bg-transparent text-foreground hover:bg-secondary focus:ring-4 focus:ring-primary/20"
  };
  
  const sizeStyles = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4"
  };

  // Create the ripple effect
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'absolute rounded-full pointer-events-none bg-white/30 animate-ripple';
    
    const existingRipple = button.getElementsByClassName('animate-ripple')[0];
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        showArrow ? "pr-12" : "",
        className
      )}
      onClick={createRipple}
      {...props}
    >
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
      `}</style>
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform group-hover:translate-x-1">
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      )}
    </button>
  );
};

export default AnimatedButton;
