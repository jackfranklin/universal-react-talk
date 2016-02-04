import React from 'react';

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
