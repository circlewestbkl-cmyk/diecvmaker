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
        <h1 class="text-2xl font-bold text-slate-900">Create Your Account</h1>
        <p class="text-slate-500 mt-1">Start building your professional CV</p>
      </div>

      <!-- Form -->
      <div class="card p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div v-if="authStore.error" class="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
            {{ authStore.error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              class="input-field"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="input-field"
              placeholder="Min. 6 characters"
              required
              minlength="6"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              class="input-field"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div v-if="passwordMismatch" class="text-sm text-red-500">
            Passwords do not match
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="authStore.loading || passwordMismatch">
            <Loader2 v-if="authStore.loading" class="w-5 h-5 animate-spin mr-2" />
            {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-slate-500">
          Already have an account?
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-700 font-semibold">
            Sign in
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { FileText, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordMismatch = computed(() => {
  return form.confirmPassword && form.password !== form.confirmPassword
})

async function handleRegister() {
  try {
    await authStore.register(form)
    router.push('/dashboard')
  } catch (err) {
    // Error handled in store
  }
}
</script>
