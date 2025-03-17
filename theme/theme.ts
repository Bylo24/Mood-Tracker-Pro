export const theme = {
  colors: {
    // Dark theme colors
    primary: '#9370DB', // Medium purple
    secondary: '#6A5ACD', // Slate blue
    accent: '#FFD700', // Gold - for positive elements
    background: '#121212', // Very dark gray (almost black)
    card: '#1E1E1E', // Dark gray for cards
    text: '#FFFFFF', // White text
    subtext: '#B0B0B0', // Light gray for subtitles
    border: '#333333', // Dark border
    success: '#4CAF50', // Green for positive moods
    warning: '#FFC107', // Yellow/amber for neutral moods
    error: '#F44336', // Red for negative moods
    info: '#2196F3', // Blue for informational elements
    // Mood colors (slightly adjusted for dark theme)
    mood1: '#F44336', // Red - terrible
    mood2: '#FF9800', // Orange - not good
    mood3: '#FFC107', // Yellow - okay
    mood4: '#8BC34A', // Light green - good
    mood5: '#4CAF50', // Green - great
    // Additional dark theme colors
    cardAlt: '#252525', // Slightly lighter card alternative
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay for modals
    highlight: '#9370DB33', // Primary with 20% opacity
    premium: '#FFD700', // Gold color for premium features
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 8,
    },
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export type Theme = typeof theme;