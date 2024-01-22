const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
  // removed production-specific logic that was setting up SSL - that is being handled by nginx now.
  // will retain this production block in case I want production-specific logic in the future.
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
} else {
  app.listen(port, () => {
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
