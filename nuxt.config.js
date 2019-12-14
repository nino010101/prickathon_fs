export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'プリパラ&キラッとプリ☆チャン Winter Live 2019 応援アプリ！',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'プリパラ&キラッとプリ☆チャン Winter Live 2019にPrickathonが出したフラワースタンドに付属する応援アプリ'
      },
      {
        property: 'og:url',
        content: 'https://prickathon-flower.web.app/'
      },
      {
        property: 'og:title',
        content: 'プリパラ&キラッとプリ☆チャン Winter Live 2019 応援アプリ！'
      },
      {
        property: 'og:description',
        content:
          'プリパラ&キラッとプリ☆チャン Winter Live 2019をみんなで応援できるアプリなんだもん！'
      },
      {
        property: 'og:image',
        content: '/kira.png'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /* env */
  env: {
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '@/plugins/firebase' }, { src: '@/plugins/device' }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
