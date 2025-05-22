// Environment-based configuration
const config = {
  // Use local API in development, remote API in production
  apiBaseUrl: import.meta.env.PROD
    ? "https://omflorwellness-258260bf2ecd.herokuapp.com" // REMOVE TRAILING SLASH
    : "", // Empty string means use relative URLs in development
};

export default config;
