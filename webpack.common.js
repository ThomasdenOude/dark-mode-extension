const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: "./src/app/background/background.ts",
    content: "./src/app/content/content.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /\.spec.ts$/],
        use: "ts-loader",
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].css",
    }),
    new CopyPlugin({
      patterns: [{ from: "static" }],
    }),
  ],
};
