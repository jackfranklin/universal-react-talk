import React from 'react';
import { resolve } from 'react-resolver';

class IndexComponent extends React.Component {
  render() {
    const { github } = this.props;

    return (
      <div>
        <p>This is the index page</p>
        <p>My github repo count: { github.public_repos }</p>
      </div>
    );
  }
}

export default resolve('github', (props) => {
  return fetch('https://api.github.com/users/jackfranklin').then((data) => {
    return data.json();
  });
})(IndexComponent);
