<!-- pages/login.vue -->
<template>
  <div class="container">
    <h1>SDE Internship Assignment</h1>
    <p>Please log in with your Google account to continue.</p>
    <button @click="handleLogin">Login with Google</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/authStore';
const authStore = useAuthStore();

function handleLogin() {
  authStore.login();
}

// --- THIS IS THE FIX ---
// watchEffect will run once immediately and then again any time one of
// its dependencies (like authStore.isLoggedIn) changes.
watchEffect(() => {
  // If the user is logged in, they should not be on the login page.
  // Redirect them to the main question page.
  if (authStore.isLoggedIn) {
    console.log('User is already logged in, redirecting from /login to /question');
    navigateTo('/question');
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>