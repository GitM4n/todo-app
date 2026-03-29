export default defineNuxtConfig({
  srcDir: './src',
  devtools: { enabled: true },
  css: ['bootstrap/dist/css/bootstrap.min.css', '~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },
  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        paths: {
          '@': ['./src'],
          '@/*': ['./src/*'],
        },
      },
    },
  },
});
