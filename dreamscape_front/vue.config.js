module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: process.env.NODE_ENV === "production",
  devServer: {
    port: 8080,
  },
  pwa: {
    name: "Dreamscape",
    startUrl: "index.html",
    themeColor: "",
    msTileColor: "",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    iconPaths: {
      msTileImage: "img/icons/ga-logo-1982x192.png",
    },

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "dev/sw.js",
      // ...other Workbox options...
    },
  },
};
