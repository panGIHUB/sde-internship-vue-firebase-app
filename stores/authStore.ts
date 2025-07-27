
import { defineStore } from 'pinia';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAdmin = ref(false);

  const isLoggedIn = computed(() => !!user.value);

  async function checkAdminStatus(userId: string | null) {
    if (!userId) {
      isAdmin.value = false;
      return;
    }
    const { $firestore } = useNuxtApp();
    const adminDocRef = doc($firestore, 'admins', userId);
    const adminDocSnap = await getDoc(adminDocRef);
    isAdmin.value = adminDocSnap.exists();
    console.log(`Admin status from Firestore check: ${isAdmin.value}`);
  }

  async function saveUserToFirestore(firebaseUser: User) {
    const { $firestore } = useNuxtApp();
    const userDocRef = doc($firestore, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
      });
      console.log(`Saved new user to /users/: ${firebaseUser.email}`);
    }
  }
  
  function init() {
    const { $auth } = useNuxtApp();
    onAuthStateChanged($auth, async (firebaseUser) => {
      
      user.value = firebaseUser;
      
      if (firebaseUser) {
       
        await saveUserToFirestore(firebaseUser);
        await checkAdminStatus(firebaseUser.uid);
      } else {
        
        isAdmin.value = false;
      }
    });
  }

  async function login() {
    const { $auth } = useNuxtApp();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup($auth, provider);
      await navigateTo('/question');
    } catch (error) {
      console.error("Login failed", error);
    }
  }

  async function logout() {
    const { $auth } = useNuxtApp();
    try {
      await signOut($auth);
      await navigateTo('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return { user, isLoggedIn, isAdmin, login, logout, init };
});