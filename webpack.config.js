module.exports = {
  // ... existing config ...
  module: {
    rules: [
      // ... other rules ...
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/react-datepicker/,
      },
    ],
  },
  // ... rest of config ...
}; 