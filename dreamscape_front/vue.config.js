const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const expEnv = dotenv.config({ path: "../.env" });
dotenvExpand(expEnv);

module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: process.env.NODE_ENV === "production",
  devServer: {
    port: 8080,
  },
};
