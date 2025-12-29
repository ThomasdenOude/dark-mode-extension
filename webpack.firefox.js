const { merge } = require("webpack-merge");
const productionConfig = require("./webpack.prod.js");
const developmentConfig = require("./webpack.dev.js");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env = { production: false }) =>
  merge(env.production ? productionConfig : developmentConfig, {
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist/firefox"),
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
              const firefoxManifest = require("./static/manifest/manifest.firefox.json");
              return JSON.stringify(
                { ...baseManifest, ...firefoxManifest },
                null,
                2,
              );
            },
          },
        ],
      }),
    ],
  });
