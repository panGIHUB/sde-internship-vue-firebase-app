<!-- pages/question.vue -->
<template>
  <div>
    <h1>Programming Question</h1>
    <p><strong>Question:</strong> Write a function to print the first 100 prime numbers.</p>
    
    <!-- The 'v-model' links this textarea to the 'code' variable in our script -->
    <textarea 
      v-model="code" 
      rows="15" 
      cols="80" 
      placeholder="Write your code here..."
    ></textarea>
    <br>

    <!-- The ':disabled' attribute prevents clicking the button while submitting -->
    <button @click="submitAnswer" :disabled="submitting">
      {{ submitting ? 'Submitting...' : 'Submit Answer' }}
    </button>

    <!-- A message to give the user feedback -->
    <p v-if="submissionMessage" class="message">{{ submissionMessage }}</p>
  </div>
</template>

<script setup>
// Import everything we need from Firebase and our store
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '~/stores/authStore';

// Get access to our auth store and the firestore instance from our plugin
const authStore = useAuthStore();
const { $firestore } = useNuxtApp();

// Create reactive variables to hold the state of this page
const code = ref(''); // Holds the code from the textarea
const submitting = ref(false); // Tracks if a submission is in progress
const submissionMessage = ref(''); // Holds feedback messages for the user

async function submitAnswer() {
  // --- Input Validation ---
  if (!code.value.trim()) {
    submissionMessage.value = "Please write some code before submitting.";
    return;
  }
  if (!authStore.user) {
    submissionMessage.value = "Error: You must be logged in to submit.";
    return;
  }

  // --- Submission Logic ---
  submitting.value = true;
  submissionMessage.value = ''; // Clear any old messages

  try {
    // Get a reference to the 'submissions' collection in Firestore
    const submissionsCollection = collection($firestore, 'submissions');
    
    // Add a new document to the collection with the user's data
    await addDoc(submissionsCollection, {
      userEmail: authStore.user.email,
      userId: authStore.user.uid,
      code: code.value,
      submittedAt: serverTimestamp(), // Bonus: Adds a server-side timestamp
    });

    submissionMessage.value = "✅ Your answer has been submitted successfully!";
    code.value = ''; // Clear the textarea for a new submission
  } catch (error) {
    console.error("Error submitting document: ", error);
    submissionMessage.value = "❌ Failed to submit your answer. Please check the console and try again.";
  } finally {
    // This 'finally' block runs whether the submission succeeded or failed
    submitting.value = false; // Re-enable the button
  }
}
</script>

<style scoped>
textarea {
  width: 100%;
  max-width: 600px;
  font-family: monospace;
  font-size: 14px;
  margin-top: 10px;
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.message {
  margin-top: 15px;
  font-weight: bold;
}
</style>