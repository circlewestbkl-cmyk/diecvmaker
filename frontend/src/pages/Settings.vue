<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Settings</h2>
      <p class="text-slate-500 mt-1">Manage your account settings.</p>
    </div>

    <div class="card p-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Account</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input :value="authStore.user?.email" class="input-field bg-slate-50" disabled />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
          <input :value="authStore.user?.role" class="input-field bg-slate-50 capitalize" disabled />
        </div>
      </div>
    </div>

    <div class="card p-6 border-red-200">
      <h3 class="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
      <p class="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back.</p>
      <button class="btn-danger text-sm" disabled>
        Delete Account (Coming Soon)
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>
