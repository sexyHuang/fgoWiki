module.exports = {
  presets: [
    '@vue/app'
  ],
  "plugins": [
    ["import", {
      "libraryName": "vant",
      "libraryDirectory": "es",
      "style": true
    }]
  ],
  "sourceMaps": true,
  "retainLines": true
}
