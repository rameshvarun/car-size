const path = require("path");
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif|json)$/,
        use: ["file-loader"],
        type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ]
};

const development = {
  mode: 'development',
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    https: true
  },
}

const production = {
  mode: 'production',
}

module.exports = (env) => {
  if (env === 'development') return merge(common, development);
  else if (env === 'production') return merge(common, production);
  else {
    throw new Error(`Unknown environment ${env}.`);
  }
}
