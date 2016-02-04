import 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router';
import { routes } from './routes';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import AsyncProps from 'async-props';

ReactDOM.render(
  <Router
    routes={routes}
    history={createBrowserHistory()}
    RoutingContext={AsyncProps}
  />,
  document.getElementById('app')
)
