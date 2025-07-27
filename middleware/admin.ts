import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  if (!authStore.isLoggedIn) {
    return; 
  }

  if (!authStore.isAdmin) {
    console.warn('Non-admin user attempt to access /admin. Redirecting.');
    return navigateTo('/question');
  }

  console.log('Admin user granted access to /admin.');
});
