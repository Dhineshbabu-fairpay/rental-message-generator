// Netlify serverless function for API routes
import express from 'express';
import serverless from 'serverless-http';

const app = express();

// Enable JSON parsing
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Rental Message Generator API is running' });
});

// Since this is a frontend-only app now, most functionality will be client-side
app.get('/api/*', (req, res) => {
  res.json({ message: 'API endpoint not implemented - this is a client-side application' });
});

export const handler = serverless(app);