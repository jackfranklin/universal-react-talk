import express from 'express';
import http from 'http';

import { renderToString } from 'react-dom/server';
import { routes } from './routes';
import { match, RouterContext } from 'react-router';
import React from 'react';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('*', (req, res) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      res.render('index', {
        markup: renderToString(<RouterContext {...renderProps} />)
      });
    } else {
      res.status(404).send('Not found')
    }
  })
});

const server = http.createServer(app);

server.listen(process.env.PORT);
server.on('listening', () => {
  console.log(`Listening on ${process.env.PORT}`);
});
