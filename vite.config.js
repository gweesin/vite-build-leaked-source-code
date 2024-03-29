import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import vueJsx from "@vitejs/plugin-vue2-jsx";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import viteCompression from "vite-plugin-compression";

const DIST_URL = new URL("./src/release_ext", import.meta.url);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "./",
    root: mode === "development" ? "./src" : "./src/release",

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        vue: "vue/dist/vue.esm.js",
      },
    },

    build: {
      sourcemap: mode !== "production",
      outDir: fileURLToPath(DIST_URL),
      assetsDir: "",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: fileURLToPath(
            new URL("./src/release/index.html", import.meta.url)
          ),
        },
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
    },

    plugins: [
      vueJsx(),
      vue(),
      AutoImport({
        include: [
          /\.jsx?$/, // .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: [
          {
            lodash: [["_"]],
          },
        ],
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
    ],

    css: {
      devSourcemap: mode !== "production",
    },
  };
});
