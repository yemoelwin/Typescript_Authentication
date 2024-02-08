import express from 'express';

import compression from 'compression';

import cors from 'cors';

import http from 'http';

import bodyParser from 'body-parser';

import cookieParser from 'cookie-parser';

import mongoose from 'mongoose';

import router from './routes/route';

const app = express();

app.use(
  cors({
    credentials: true,
  }),
);

app.use(compression());

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/', router());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080/');
});

const MONGO_URL = `mongodb+srv://jeffrey:wH0T1KNwORj8o0lv@authentication.0twgx4h.mongodb.net/?retryWrites=true&w=majority`;

mongoose.Promise = Promise;

mongoose.connect(MONGO_URL);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (error: Error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// mongoose.connection.on('error', (error: Error) => console.log(error));

// T#p+75Z/;U,n.wY POST
