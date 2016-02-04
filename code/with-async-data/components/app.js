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
