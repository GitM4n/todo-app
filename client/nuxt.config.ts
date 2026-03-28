export default defineNuxtConfig({
    srcDir: './src',
    devtools: { enabled: true },
    css:['bootstrap/dist/css/bootstrap.min.css', '~/assets/css/main.css'],
    modules:['@nuxt/eslint', '@pinia/nuxt'],
})