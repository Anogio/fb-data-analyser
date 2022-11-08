module.exports = {
  configureWebpack: (config) => {
    {
      return {
        module: {
          rules: [
            {
              test: /\.wasm$/,
              type: "javascript/auto",
            },
            {
              test: /\.js$/,
              loader: require.resolve("@open-wc/webpack-import-meta-loader"),
            },
          ],
        },
      };
    }
  },
};
