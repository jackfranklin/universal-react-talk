import React from 'react';

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
    const { github } = this.props;

    return (
      <div>
        <p>This is the index page</p>
        <p>My github repo count: { github.public_repos }</p>
      </div>
    );
  }
}
