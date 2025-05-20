# Starry Symphony Wellness

A responsive wellness e-commerce platform designed to provide an immersive and intuitive digital experience for holistic personal growth and product exploration.

## Deployment Guide

### Frontend Deployment (Netlify)

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Use these build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Backend Deployment (Heroku)

1. Install the Heroku CLI:
   ```
   npm install -g heroku
   ```

2. Log in to Heroku:
   ```
   heroku login
   ```

3. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```

4. Add Heroku PostgreSQL add-on:
   ```
   heroku addons:create heroku-postgresql:mini
   ```

5. Configure environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your-session-secret
   ```

6. Update the CORS origin in `server/config.ts` with your Netlify domain:
   ```typescript
   origin: ['https://your-netlify-app-name.netlify.app']
   ```

7. Deploy to Heroku:
   ```
   git push heroku main
   ```

8. After deployment, update the frontend config in `client/src/config.ts` with your Heroku URL:
   ```typescript
   apiBaseUrl: import.meta.env.PROD
     ? 'https://your-app-name.herokuapp.com'
     : ''
   ```

9. Redeploy the frontend to Netlify after updating the config.

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
