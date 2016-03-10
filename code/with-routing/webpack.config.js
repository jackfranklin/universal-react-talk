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
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
}
