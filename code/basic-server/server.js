import express from 'express';
import http from 'http';

import MyApp from './component';

import { renderToString } from 'react-dom/server';
import React from 'react';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('*', (req, res) => {
  const markup = renderToString(<MyApp />);
  res.render('index', {
    markup
  });
});

const server = http.createServer(app);

server.listen(process.env.PORT);
server.on('listening', () => {
  console.log(`Listening on ${process.env.PORT}`);
});
