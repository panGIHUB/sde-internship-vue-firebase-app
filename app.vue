<!-- app.vue -->
<template>
  <div>
    <!-- The header will now only show if a user is logged in -->
    <header v-if="authStore.isLoggedIn">
      <span>Welcome, {{ authStore.user?.email }}</span>
      
      <!-- NEW: Navigation block for links -->
      <nav>
        <!-- Standard link to the question page for all logged-in users -->
        <NuxtLink to="/question">Question</NuxtLink>
        
        <!-- This link to the Admin page will ONLY be rendered in the DOM
             if the `isAdmin` reactive variable in our store is true. -->
        <NuxtLink v-if="authStore.isAdmin" to="/admin">Admin</NuxtLink>
        
        <!-- The logout button -->
        <button @click="authStore.logout()">Logout</button>
      </nav>
    </header>

    <main>
      <!-- NuxtPage is a special component that renders the current page's component -->
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/authStore';
const authStore = useAuthStore();

// This wrapper correctly ensures that the Firebase listener is only
// initialized on the client-side (in the browser).
if (process.client) {
  authStore.init();
}
</script>

<style>
/* Global styles for our app */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}
main {
  padding: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}
header span {
  font-weight: bold;
}

/* NEW: Styles for the navigation elements */
nav {
  display: flex;
  gap: 1rem; /* Creates space between the links and button */
  align-items: center;
}
nav a {
  text-decoration: none;
  color: #007bff; /* A standard blue link color */
  padding: 5px;
}
nav a:hover {
  text-decoration: underline;
}
/* This class is automatically added by Nuxt to the active link */
nav a.router-link-active {
  color: #0056b3;
  font-weight: bold;
  text-decoration: none;
}
nav button {
  cursor: pointer;
}
</style>