import 'isomorphic-fetch';
import express from 'express';
import http from 'http';

import { renderToString } from 'react-dom/server';
import { routes } from './routes';
import { match, RoutingContext } from 'react-router';
import React from 'react';
import AsyncProps, { loadPropsOnServer } from 'async-props';

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
      loadPropsOnServer(renderProps, (err, asyncProps, scriptTag) => {
        res.render('index', {
          markup: renderToString(<AsyncProps {...renderProps} {...asyncProps} />),
          scriptTag
        });
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
