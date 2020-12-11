module.exports = {
  "env": {
    "test": {
      "presets": [
        "@babel/preset-typescript",
        [
          "@babel/env",
          {
            "targets": {
              "node": "8",
              "browsers": [
                "last 30 versions",
                "chrome >= 30",
                "firefox >= 25",
                "safari >= 7",
                "ie >= 10",
                "edge >= 12"
              ]
            }
          }
        ]
      ],
      "plugins": [
        "babel-plugin-istanbul",
        "@babel/plugin-transform-runtime"
      ]
    },
    "production": {
      "presets": [
        "@babel/preset-typescript",
        [
          "@babel/env",
          {
            "targets": {
              "node": "8",
              "browsers": [
                "last 30 versions",
                "chrome >= 30",
                "firefox >= 25",
                "safari >= 7",
                "ie >= 10",
                "edge >= 12"
              ]
            },
            "modules": false
          }
        ]
      ],
      "plugins": [
        "@babel/plugin-transform-runtime"
      ]
    }
  }
};
