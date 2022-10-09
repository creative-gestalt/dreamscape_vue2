module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: process.env.NODE_ENV === "production",
  devServer: {
    port: 8080,
  },
  pwa: {
    manifestOptions: {
      name: "Dreamscape",
      icons: [
        {
          src: "img/icons/ga-logo-1982x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
    name: "Dreamscape",
    themeColor: "",
    msTileColor: "",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "dev/sw.js",
      // ...other Workbox options...
    },
  },
};
