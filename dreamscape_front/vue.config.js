module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: process.env.NODE_ENV === "production",
  devServer: {
    port: 8080,
  },
  pwa: {
    name: "Dreamscape",
    start_url: "index.html",
    // themeColor: "#4DBA87",
    // msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "dev/sw.js",
      // ...other Workbox options...
    },
  },
};
