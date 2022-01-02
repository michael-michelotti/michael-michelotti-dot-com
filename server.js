const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const http = require('http');
const https = require('https');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db)
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === 'production') {
  const key = fs.readFileSync('sslcert/privkey.pem', 'utf-8');
  const cert = fs.readFileSync('sslcert/fullchain.pem', 'utf-8');
  const credentials = { key, cert };

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);

  httpServer.listen(8080);
  httpsServer.listen(8443);
} else {
  const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shuttting down.');
  server.close(() => {
    console.log('Process terminated.');
  });
});
