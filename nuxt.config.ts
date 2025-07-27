// nuxt.config.ts

// The defineNuxtConfig function is where you configure your Nuxt application.
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // devtools enables the handy debugging panel in your browser.
  devtools: { enabled: true },

  // The modules array is where you register Nuxt modules like Pinia for state management.
  modules: [
    '@pinia/nuxt',
  ],
  
  // --- THIS IS THE NEW, CORRECTED BLOCK ---
  // The runtimeConfig block makes your .env variables securely available to your app.
  // This is the fix for the `useRuntimeConfig` issue we were debugging.
  runtimeConfig: {
    // Variables in the `public` block are exposed to both the server and the client (browser).
    public: {
      // Each line maps a variable from your .env file to a key that the app can use.
      // For example, `config.public.firebaseApiKey` in your plugin will get its value
      // from `process.env.NUXT_PUBLIC_FIREBASE_API_KEY`.
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    }
  }
})