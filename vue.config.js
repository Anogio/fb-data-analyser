module.exports = {
  configureWebpack: (config) => {
    {
      return {
        module: {
          rules: [
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
