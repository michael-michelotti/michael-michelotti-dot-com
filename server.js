const mongoose = require('mongoose');
const dotenv = require('dotenv');

console.log('does this show up in the heroku logs?');

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

console.log('got to connecting to database');

mongoose
  .connect(db)
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log(err));

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

console.log('connected to server');

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
