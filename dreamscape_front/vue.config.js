module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: process.env.NODE_ENV === "production",
  devServer: {
    port: 8080,
  },

  pwa: {
    name: "Dreamscape",
    themeColor: "#00000000",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      background_color: "#000000",
    },

    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/registerServiceWorker.ts",
      // ...other Workbox options...
    },
  },
};
