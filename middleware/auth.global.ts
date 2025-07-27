// middleware/auth.global.ts
import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  // This middleware protects all routes except the login page.

  // Get the authentication store
  const authStore = useAuthStore();
  
  // On the server-side during the very first load, the store might not be initialized yet.
  // This check is a safeguard. The real initialization happens in app.vue.
  if (!authStore.isLoggedIn && process.server) {
    // Don't do redirects on the server side on initial load.
    // Let the client-side handle it after auth state is confirmed.
    return;
  }
  
  // Allow navigation to the login page.
  if (to.path === '/login') {
    return;
  }

  // If the user is NOT logged in and is trying to access ANY page
  // that is NOT the login page, we redirect them.
  if (!authStore.isLoggedIn) {
    console.log('Redirecting to /login because user is not authenticated.');
    return navigateTo('/login');
  }
});