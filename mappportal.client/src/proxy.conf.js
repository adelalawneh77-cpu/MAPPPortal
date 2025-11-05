const { env } = require('process');

// Get the backend URL from environment variables or use default
// Try HTTPS first, then HTTP
const httpsPort = env.ASPNETCORE_HTTPS_PORT || '7265';
const httpPort = env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';').find(url => url.startsWith('http://'))?.split(':')[2] || '5204' : '5204';

// Try HTTP first as it's more reliable in development
const target = `http://localhost:${httpPort}`;

console.log('Proxy target:', target);
console.log('Environment variables:', {
  ASPNETCORE_HTTPS_PORT: env.ASPNETCORE_HTTPS_PORT,
  ASPNETCORE_URLS: env.ASPNETCORE_URLS
});

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api/projects",
      "/api/levels",
      "/api/milestones"
    ],
    target: target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    ws: true,
    headers: {
      'Connection': 'keep-alive'
    }
  }
]

module.exports = PROXY_CONFIG;
