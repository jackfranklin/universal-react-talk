import 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { Resolver } from 'react-resolver';
import { routes } from './routes';

Resolver.render(() => {
  return <Router history={browserHistory} routes={routes} />
}, document.getElementById('app'));
