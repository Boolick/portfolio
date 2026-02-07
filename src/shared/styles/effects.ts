/**
 * Animation & Effect Design Tokens
 * 
 * Transitions, animations, and visual effects.
 */

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  // Duration
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  // Timing functions
  ease: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitionPresets = {
  // Common transitions
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
  all: 'all',
  
  // Preset combinations
  default: `all ${transitions.duration.normal} ${transitions.ease.inOut}`,
  fast: `all ${transitions.duration.fast} ${transitions.ease.inOut}`,
  slow: `all ${transitions.duration.slow} ${transitions.ease.inOut}`,
  colorsFast: `color, background-color, border-color ${transitions.duration.fast} ${transitions.ease.inOut}`,
  colorsNormal: `color, background-color, border-color ${transitions.duration.normal} ${transitions.ease.inOut}`,
  transformFast: `transform ${transitions.duration.fast} ${transitions.ease.out}`,
} as const;

// ============================================
// CSS ANIMATION KEYFRAMES (as strings)
// ============================================

export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  slideInFromLeft: `
    @keyframes slideInFromLeft {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  slideInFromRight: `
    @keyframes slideInFromRight {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  slideInFromTop: `
    @keyframes slideInFromTop {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  slideInFromBottom: `
    @keyframes slideInFromBottom {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  ping: `
    @keyframes ping {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
      50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
    }
  `,
} as const;

// ============================================
// ANIMATION UTILITY CLASSES (CSS class names)
// ============================================

export const animationClasses = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
} as const;

// ============================================
// HOVER/FOCUS EFFECTS
// ============================================

export const effects = {
  // Hover lift effect
  hoverLift: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  
  // Focus ring
  focusRing: {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(252, 163, 17, 0.4)',
  },
  
  // Press effect
  pressDown: {
    transform: 'translateY(1px)',
  },
  
  // Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  // Glassmorphism for light mode
  glassLight: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  },
} as const;

// Type exports
export type TransitionDuration = keyof typeof transitions.duration;
export type TransitionEase = keyof typeof transitions.ease;
