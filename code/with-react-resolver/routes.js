import AppComponent from './components/app';
import IndexComponent from './components/index';
import AboutComponent from './components/about';
import React from 'react';
import { Route } from 'react-router';


export const routes = (
  <Route path="" component={AppComponent}>
    <Route path="/" component={IndexComponent} />
    <Route path="/about" component={AboutComponent} />
  </Route>
);
