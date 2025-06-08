const config = {
  // Frontend URLs
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  HOST: import.meta.env.VITE_HOST || 'http://localhost:3000',

  // Chat Features
  CHAT: {
    TYPING_TIMEOUT: parseInt(import.meta.env.VITE_TYPING_TIMEOUT) || 3000,
    MAX_MESSAGES_PER_MINUTE: parseInt(import.meta.env.VITE_MAX_MESSAGES_PER_MINUTE) || 30,
  },

  // Development mode check
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};

export default config;

