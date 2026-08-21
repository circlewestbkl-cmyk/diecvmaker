<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
          <FileText class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-bold text-slate-800">CVForge</span>
      </div>

      <nav class="p-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(item.to) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
        <router-link
          to="/dashboard/profile"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all"
          @click="sidebarOpen = false"
        >
          <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span class="text-sm font-semibold text-indigo-600">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">{{ authStore.user?.name || 'User' }}</p>
            <p class="text-xs text-slate-400 truncate">{{ authStore.user?.email }}</p>
          </div>
        </router-link>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:ml-64">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div class="flex items-center justify-between h-16 px-4 lg:px-8">
          <div class="flex items-center gap-4">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu class="w-5 h-5 text-slate-600" />
            </button>
            <h1 class="text-lg font-semibold text-slate-800">{{ pageTitle }}</h1>
          </div>

          <div class="flex items-center gap-3">
            <button class="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell class="w-5 h-5 text-slate-500" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              @click="handleLogout"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              <LogOut class="w-4 h-4" />
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard, FileText, Layers, ScanSearch, Briefcase,
  BookOpen, MessageSquare, FolderOpen, User, Settings, Bell, LogOut, Menu, Target, ShieldCheck
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const navItems = computed(() => {
  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/cv', label: 'My CV', icon: FileText },
    { to: '/dashboard/templates', label: 'Templates', icon: Layers },
    { to: '/dashboard/ats', label: 'ATS Checker', icon: ScanSearch },
    { to: '/dashboard/job-matcher', label: 'Job Matcher', icon: Target },
    { to: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/dashboard/applications', label: 'Applications', icon: FolderOpen },
    { to: '/dashboard/cover-letter', label: 'Cover Letter', icon: BookOpen },
    { to: '/dashboard/interview', label: 'Interview', icon: MessageSquare },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]
  // Admin only items
  if (authStore.user?.role === 'admin') {
    items.push({ to: '/dashboard/admin/users', label: 'User Management', icon: ShieldCheck })
  }
  return items
})

const pageTitle = computed(() => {
  const item = navItems.value.find(n => {
    if (n.to === '/dashboard') return route.path === '/dashboard'
    return route.path.startsWith(n.to)
  })
  return item?.label || 'Dashboard'
})

function isActive(path) {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
