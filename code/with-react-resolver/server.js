import 'isomorphic-fetch';
import express from 'express';
import http from 'http';

import { renderToString } from 'react-dom/server';
import { routes } from './routes';
import { match, RouterContext } from 'react-router';
import React from 'react';
import { Resolver } from 'react-resolver';

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
      Resolver
        .resolve(() => <RouterContext {...renderProps} />)
        .then(({ Resolved, data }) => {
          res.render('index', {
            markup: renderToString(<Resolved />),
            data: JSON.stringify(data)
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
