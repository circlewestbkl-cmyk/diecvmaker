<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <FileText class="w-6 h-6 text-white" />
          </div>
          <span class="text-2xl font-bold text-slate-800">CVForge</span>
        </router-link>
        <h1 class="text-2xl font-bold text-slate-900">Forgot Password</h1>
        <p class="text-slate-500 mt-1">Enter your email to reset your password</p>
      </div>

      <!-- Form -->
      <div class="card p-8">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div v-if="submitted" class="p-3 bg-green-50 text-green-600 text-sm rounded-xl">
            If an account with that email exists, we've sent a password reset link.
          </div>

          <div v-if="error" class="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              class="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            <Loader2 v-if="loading" class="w-5 h-5 animate-spin mr-2" />
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-slate-500">
          Remember your password?
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-700 font-semibold">
            Back to login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import authService from '@/services/authService'
import { FileText, Loader2 } from 'lucide-vue-next'

const email = ref('')
const loading = ref(false)
const submitted = ref(false)
const error = ref(null)

async function handleSubmit() {
  loading.value = true
  error.value = null
  try {
    await authService.forgotPassword(email.value)
    submitted.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>
