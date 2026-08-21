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
        <h1 class="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p class="text-slate-500 mt-1">Sign in to your account</p>
      </div>

      <!-- Form -->
      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div v-if="authStore.error" class="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
            {{ authStore.error }}
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
              placeholder="••••••••"
              required
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2">
              <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span class="text-slate-600">Remember me</span>
            </label>
            <router-link to="/forgot-password" class="text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot password?
            </router-link>
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="authStore.loading">
            <Loader2 v-if="authStore.loading" class="w-5 h-5 animate-spin mr-2" />
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-slate-500">
          Don't have an account?
          <router-link to="/register" class="text-indigo-600 hover:text-indigo-700 font-semibold">
            Sign up free
          </router-link>
        </div>
      </div>

      <!-- Demo accounts -->
      <div class="mt-6 card p-6">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Demo Accounts</p>
        <div class="space-y-2">
          <button
            v-for="demo in demoAccounts"
            :key="demo.email"
            @click="fillDemo(demo)"
            class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <div>
              <span class="font-medium text-slate-700">{{ demo.name }}</span>
              <span class="text-slate-400 ml-2">{{ demo.email }}</span>
            </div>
            <span class="text-xs text-slate-400">password123</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { FileText, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })

const demoAccounts = [
  { name: 'Admin', email: 'admin@cvforge.com' },
  { name: 'Digo', email: 'digo@demo.com' },
  { name: 'Sarah', email: 'sarah@demo.com' },
]

function fillDemo(demo) {
  form.email = demo.email
  form.password = 'password123'
}

async function handleLogin() {
  try {
    await authStore.login(form)
    router.push('/dashboard')
  } catch (err) {
    // Error handled in store
  }
}
</script>
