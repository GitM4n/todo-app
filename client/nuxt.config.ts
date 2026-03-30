export default defineNuxtConfig({
  srcDir: './src',
  ssr: false,
  devtools: { enabled: true },
  css: [
    'bootstrap-icons/font/bootstrap-icons.css',
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/main.css',
  ],
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
