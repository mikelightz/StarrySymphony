// Environment-based configuration
const config = {
  // Use local API in development, remote API in production
  apiBaseUrl: import.meta.env.PROD 
    ? 'https://your-backend-service-url.com' // Replace with your actual backend URL when deployed
    : ''  // Empty string means use relative URLs in development
};

export default config;