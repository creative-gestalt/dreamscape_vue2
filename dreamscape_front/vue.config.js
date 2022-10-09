module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: process.env.NODE_ENV === "production",
  devServer: {
    port: 8080,
  },
  pwa: {
    name: "Dreamscape",
    // themeColor: "",
    // msTileColor: "",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "src/registerServiceWorker.ts",
      // ...other Workbox options...
    },
  },
};
