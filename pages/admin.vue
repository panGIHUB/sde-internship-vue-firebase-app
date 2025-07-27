<!-- pages/admin.vue -->
<template>
  <div>
    <h1>Admin Dashboard</h1>
    <hr>

    <!-- Section for User Management -->
    <h2>User & Admin Management</h2>
    <p v-if="usersLoading">Loading users...</p>
    <table v-if="users.length > 0">
      <thead>
        <tr>
          <th>Email</th>
          <th>Admin Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.uid">
          <td>{{ user.email }}</td>
          <td>{{ user.isAdmin ? '✅ Admin' : '❌ User' }}</td>
          <td>
            <button @click="toggleAdmin(user)" :disabled="isProcessing[user.uid] || isCurrentUser(user.uid)">
              {{ getButtonText(user) }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <hr>
    <!-- Section for Submissions -->
    <h2>All Submissions</h2>
    <p v-if="submissionsLoading">Loading submissions...</p>
    <!-- NOTE: You need to paste your submissions table template here -->
    <table v-if="submissions.length > 0">
      <thead>
        <tr>
          <th>Submitted At</th>
          <th>User Email</th>
          <th>Code</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="submission in submissions" :key="submission.id">
          <td>{{ new Date(submission.submittedAt.seconds * 1000).toLocaleString() }}</td>
          <td>{{ submission.userEmail }}</td>
          <td><pre>{{ submission.code }}</pre></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

definePageMeta({ middleware: 'admin' });

const { $firestore } = useNuxtApp();
const authStore = useAuthStore();

// --- State for User Management ---
const users = ref([]);
const usersLoading = ref(true);
const isProcessing = ref({});

async function fetchUsersAndAdmins() {
  usersLoading.value = true;
  try {
    const usersSnapshot = await getDocs(collection($firestore, "users"));
    const adminsSnapshot = await getDocs(collection($firestore, "admins"));
    const adminIds = new Set(adminsSnapshot.docs.map(d => d.id));

    users.value = usersSnapshot.docs.map(d => ({
      ...d.data(),
      isAdmin: adminIds.has(d.id),
    }));
  } catch(err) {
    console.error("Error fetching users:", err);
  } finally {
    usersLoading.value = false;
  }
}

async function toggleAdmin(user) {
  isProcessing.value[user.uid] = true;
  const adminDocRef = doc($firestore, 'admins', user.uid);

  try {
    if (user.isAdmin) {
      await deleteDoc(adminDocRef);
      user.isAdmin = false;
    } else {
      await setDoc(adminDocRef, { email: user.email });
      user.isAdmin = true;
    }
  } catch (err) {
    alert(`Error updating admin status: ${err.message}`);
  } finally {
    isProcessing.value[user.uid] = false;
  }
}

function isCurrentUser(uid) {
  return authStore.user?.uid === uid;
}

function getButtonText(user) {
  if (isCurrentUser(user.uid)) return 'Current User';
  if (isProcessing.value[user.uid]) return 'Processing...';
  return user.isAdmin ? 'Remove Admin' : 'Make Admin';
}

// --- State for Submissions Management ---
const submissions = ref([]);
const submissionsLoading = ref(true);

async function fetchSubmissions() {
  submissionsLoading.value = true;
  try {
    const q = query(collection($firestore, "submissions"), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    submissions.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching submissions:", err);
  } finally {
    submissionsLoading.value = false;
  }
}

// Fetch all data when the component mounts
onMounted(() => {
  fetchUsersAndAdmins();
  fetchSubmissions();
});
</script>

<style scoped>
  hr { margin: 2rem 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
  th { background-color: #f2f2f2; }
  pre { white-space: pre-wrap; word-wrap: break-word; background-color: #eee; padding: 10px; border-radius: 4px; font-family: monospace; }
  button:disabled { cursor: not-allowed; opacity: 0.6; }
</style>