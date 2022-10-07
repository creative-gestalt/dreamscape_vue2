import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: process.env.NODE_ENV === "production",
  devServer: {
    port: 8080,
  },
};
