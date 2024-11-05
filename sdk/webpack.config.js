const path = require('path');

module.exports = {
  entry: './src/index.ts', // Main entry point for the SDK
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'DimoLoginButtonSDK',
    libraryTarget: 'umd', // Universal Module Definition to support multiple environments
    globalObject: 'this', // Required for UMD in Node and browser environments
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Enables support for importing CSS in components
      },
    ],
  },
};
