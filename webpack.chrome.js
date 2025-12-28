const { merge } = require("webpack-merge");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const productionConfig = require("./webpack.prod");
const developmentConfig = require("./webpack.dev");

module.exports = (env = { production: false }) =>
  merge(env.production ? productionConfig : developmentConfig, {
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist/chrome"),
      clean: true,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "static/manifest/manifest.base.json",
            to: "manifest.json",
            transform(content) {
              const baseManifest = JSON.parse(content.toString("utf-8"));
              const chromeManifest = require("./static/manifest/manifest.chrome.json");
              return JSON.stringify(
                { ...baseManifest, ...chromeManifest },
                null,
                2,
              );
            },
          },
        ],
      }),
    ],
  });
