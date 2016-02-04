# Universal React

---

# @Jack_Franklin, Pusher

--- 

![fit](gc.png)

---

![fit](24ways.png)

---

# Why?

---

![inline](https://gds.blog.gov.uk/wp-content/uploads/sites/60/2013/10/pete_01-525.png)

![inline](https://gds.blog.gov.uk/wp-content/uploads/sites/60/2013/10/pete_02-525.png)

[Source: GDS Blog, 2013](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/)

---

"Surprisingly, the proportion of people that have explicitly disabled JavaScript or use a browser that doesn't support JavaScript, __only makes up a small slice of people that don't run JavaScript__."

---

"Progressive enhancement has never been about users who've turned JavaScript off, or least it wasn't for me."

[Jake Archibald, "Progressive Enhancement Still Important"](https://jakearchibald.com/2013/progressive-enhancement-still-important/)

---

## Everyone has JS, right?

- On a train / in a tunnel / etc
- HTTP request hangs
- Firewalls
- ISP is interfering
- A browser addon is messing with you
- Your CDN is down

[Stuart Langridge's Flowchart](http://kryogenix.org/code/browser/everyonehasjs.html)

---

# Time and a place

---

# Cutting Edge!

We're really still at the early stages of figuring out how this stuff works.

Some of the code shown here isn't the easiest, or the APIs aren't that straight forward.

This will change as we learn more. Don't expect this to be 100% smooth!

---

A standard React app:

```javascript
class MyApp extends React.Component {
  render() { ...  }
}

ReactDOM.render(
  <MyApp />,
  document.getElementById('app')
)
```

---

Server side:

```javascript
class MyApp extends React.Component {
  render() { ...  }
}

ReactDOM.renderToString(
  <MyApp />,
  document.getElementById('app')
)
```

---

# React is a great fit

---

![fit](ember.png)

---

# Demo One!

Rendering HTML on the server from a React component

---

```js
// some imports left out to save space
import React from 'react';
import MyApp from './component';
import { renderToString } from 'react-dom/server';

const app = express();

app.get('*', (req, res) => {
  const markup = renderToString(<MyApp />);
  res.render('index', { markup });
});

```

---

# renderToString
When your HTML is going to be picked up by React on the client

# renderToStaticMarkup
When your HTML is never going to be edited by client-side React

---

# Going Client side

- Shared set of components that are environment agnostic
- A server rendering step (like we just saw)
- A client rendering step
- A bundler to generate our client side JavaScript

---

# There's no requirement to actually go client side

A server side generated React app with no client side JS is perfectly fine ;)

---

# Agnostic Components

---

# Webpack

A JavaScript application bundler that will generate our client side build.

---

# Rendering on the Client

---

Updating our server template.

```html
<body>
  <!-- rendering React into body is bad -->
  <!-- lack of whitespace here is really important! -->
  <div id="app"><%- markup %></div>
  <script src="build.js"></script>
</body>
```

---

Creating __client.js__:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import MyApp from './component';

ReactDOM.render(
  <MyApp />,
  document.getElementById('app')
);
```

---

# Same Components on client and server

---

```
npm install --save-dev webpack babel-loader
```

---

Create __webpack.config.js__

```javascript
var path = require('path');
module.exports = {
  entry: path.join(process.cwd(), 'client.js'),
  output: {
    path: './public/',
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel'
      }
    ]
  }
}
```

---

Run `webpack`:

```
> webpack
Hash: 78c865d5593fe910f823
Version: webpack 1.12.12
Time: 4948ms
   Asset    Size  Chunks             Chunk Names
   build.js  690 kB       0  [emitted]  main
       + 160 hidden modules
```

(Tip: `webpack -w` for continuous rebuilds)

---

# An interactive component

```javascript
export default class MyApp extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }

  onClick() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <button onClick={this.onClick.bind(this)}>Click Me</button>
        <p>Count: { this.state.count }</p>
      </div>
    );
  }
}
```

---

# Demo Two!

(Contrived example incoming!)

---

Most web apps still do a lot of rendering of data (from APIs, etc) and why would you prevent your non-JS users from that?

---

# A read-only experience is way better than no experience.

---

# Routing

---

# Don't be that person who breaks the web.

---

# react-router

The defacto, practically standard routing solution for React.

https://github.com/rackt/react-router

---

# react-router 2.0.0-rc5

We're living on the bleeding edge here!

[React Router 2.0 upgrade guide](https://github.com/rackt/react-router/blob/master/upgrade-guides/v2.0.0.md)

---

First we need some more components, starting with __components/app.js__:

```js
import React from 'react';

export default class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <h2>My web 2.0 app</h2>
        { this.props.children }
      </div>
    );
  }
}
```

`this.props.children` are the nested routes.

---

And then __components/index.js__:

```js
import React from 'react';

export default class IndexComponent extends React.Component {
  render() {
    return (
      <div>
        <p>This is the index page</p>
      </div>
    );
  }
}
```

---

Define our routes:

```javascript
import { Route } from 'react-router';
import React from 'react';

import AppComponent from './components/app';
import IndexComponent from './components/index';

export const routes = (
  <Route path="" component={AppComponent}>
    <Route path="/" component={IndexComponent} />
  </Route>
);
```

---

Match against the URL on the server.

Gets a bit hairy, stick with me!

[React Router server side guide](https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md)

---

```javascript
// our newly defined routes
import { routes } from './routes';

// match is responsible for matching routes against a URL
// RouterContext renders the components in the matched routes
import { match, RouterContext } from 'react-router';
```
---

```javascript

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
```

---

# Let's break that down...

---

```javascript
// take our app's routes, and the URL of the request
match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
  // match figures out which routes match, and calls this callback with the arguments above

  // error : given if something went wrong matching a route

  // redirectLocation : returned if the URL matches a redirect

  // renderProps : given if a route was matched and we can render
  ...
});
```

---

```javascript
if (error) {
  // if there was an error, 500 with the error message

  // you might show a custom error HTML page here

  res.status(500).send(error.message)

} else if (redirectLocation) {
  ...
}
```

---
```javascript
  ...
} else if (redirectLocation) {
  // if we need to redirect, redirect to the new URL

  res.redirect(302, redirectLocation.pathname + redirectLocation.search)

} else if (renderProps) {
  ...
}
```

---

```javascript
  ...
} else if (renderProps) {
  // if we have renderProps that means we have a match and can render
  res.render('index', {
    // RouterContext is React Router's wrapper around our own components

    // and renderProps contains all the info React Router needs to render our app
    markup: renderToString(<RouterContext {...renderProps} />)
  });
} else {
  ...
}
```

---

```javascript
} else {
  // if we get here, it's not an error, redirect or match
  // hence, 404!
  res.status(404).send('Not found')
}
```

---

![fit](routing.png)

---

Let's add an about page!

---

__components/about.js__:

```javascript
import React from 'react';

export default class AboutComponent extends React.Component {
  render() {
    return <p>Rockstar developer</p>;
  }
}
```
---

__routes.js__:

```javascript
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
```

---

And some links...

```javascript
import React from 'react';
import { Link } from 'react-router';

export default class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <h2>My web 2.0 app</h2>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        { this.props.children }
      </div>
    );
  }
}
```

---

With no client side bundle, this works perfectly:

![inline](routing-demo.mov)

---

Updating the client side:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { routes } from './routes';

ReactDOM.render(
  <Router routes={routes} history={browserHistory} />,
  document.getElementById('app')
)
```

And then rerun `webpack`.

---

# Demo Three!

---

# Dealing with Data

(If I have time...)

---

# (Caveat: this area is still WIP)

No one has quite figured out the best way to deal with loading data on the server and client with React components.

This is very, very new terrirory and things are not settled yet. This will get a little messy!

---

I'm a fan of [Async Props](https://github.com/rackt/async-props) (also by the creator's of React Router).

Warning: Async Props is not production ready yet, but I like the approach enough to consider it safe to demo.

```
npm install --save async-props
```

---

# Caveat 2: Async-Props and React Router 2 don't play 100% nicely

So for this demo I've downgraded to React Router 1.

---


Going to use the `fetch` API, so need a polyfill:

```
npm install --save isomorphic-fetch
```

---

AsyncProps expects a `loadProps` static method in your Read component that loads the data. All we need to do is define it, and `AsyncProps` will take care of the rest.

We can then refer to that data on `this.props` without worrying about if it's loaded or not, because AsyncProps ensures that it is.

---

First, let's give __components/index.js__ some data:

```javascript
export default class IndexComponent extends React.Component {
  // a stage 1 proposal for ES.next
  static loadProps(params, cb) {
    fetch('https://api.github.com/users/jackfranklin').then((data) => {
      return data.json();
    }).then((github) => {
      cb(null, { github });
    }).catch((e) => {
      cb(e);
    });
  }

  render() {
    return (
      <div>
        <p>My github repo count: { this.props.github.public_repos }</p>
      </div>
    );
  }
}
```

---

Then we update our server rendering:

```js
// within the `match` callback:
} else if (renderProps) {
  // loadPropsonServer is provided by async-props
  loadPropsOnServer(renderProps, (err, asyncProps, scriptTag) => {
    res.render('index', {
      // we now render AsyncProps
      markup: renderToString(<AsyncProps {...renderProps} {...asyncProps} />),
      scriptTag
    });
  });
}
```

---

- `loadPropsOnServer` gives us two items in the callback: `asyncProps` and `scriptTag`.
- The `scriptTag` is needed to transfer the data from server to client.

We change our `index.ejs` template:

```html
<div id="app"><%- markup %></div>
<%- scriptTag %>
<script src="build.js"></script>
```

---

And finally we can update our client side rendering too:

```javascript
import AsyncProps from 'async-props';

ReactDOM.render(
  <Router
    routes={routes}
    history={createBrowserHistory()}
    RoutingContext={AsyncProps}
  />,
  document.getElementById('app')
)
```

(Note: this looks much nicer in React Router v2)

---

# Demo 4!

---

# Deep Breath

[These slides and all the demos are on GitHub](https://github.com/jackfranklin/universal-react-talk).

Please send me questions: @Jack_Franklin or jack@pusher.com.

---

# Universal JavaScript is here to stay.

The techniques, libraries and approaches will change over time.

There's plenty to figure out in this space!

---

# Server side by default?

---

# Further Reading

- [Universal React on 24ways](https://24ways.org/2015/universal-react/)
- [How we built the new gocardless.com](https://gocardless.com/blog/how-we-built-the-new-gocardless.com/)
- [GoCardless.com repo](https://github.com/gocardless/splash-pages)
- [Universal React Example app](https://github.com/jackfranklin/universal-react-example)

---

# If you dig React

I can make you dig it more! Day long React workshops in London:

- [16 March](http://www.whiteoctoberevents.co.uk/event/reactjs-workshop-march-16/)
- [10 June](http://www.whiteoctoberevents.co.uk/event/reactjs-workshop-june-16/)

---

# Thanks! @Jack_Franklin
