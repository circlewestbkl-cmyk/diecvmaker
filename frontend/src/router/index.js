import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Public pages
import LandingPage from '@/pages/LandingPage.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import ForgotPassword from '@/pages/ForgotPassword.vue'

// Protected pages
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Profile from '@/pages/Profile.vue'
import Settings from '@/pages/Settings.vue'

// Placeholder pages for Phase 2+
import CvList from '@/pages/CvList.vue'
import CvBuilder from '@/pages/CvBuilder.vue'
import Templates from '@/pages/Templates.vue'
import AtsChecker from '@/pages/AtsChecker.vue'
import JobMatcher from '@/pages/JobMatcher.vue'
import Jobs from '@/pages/Jobs.vue'
import JobDetail from '@/pages/JobDetail.vue'
import Applications from '@/pages/Applications.vue'
import CoverLetter from '@/pages/CoverLetter.vue'
import Interview from '@/pages/Interview.vue'
import AdminUsers from '@/pages/AdminUsers.vue'
import PublicCv from '@/pages/PublicCv.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: LandingPage,
    meta: { guest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { guest: true }
  },

  // Protected routes with dashboard layout
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'profile', name: 'Profile', component: Profile },
      { path: 'settings', name: 'Settings', component: Settings },
      { path: 'cv', name: 'CvList', component: CvList },
      { path: 'cv/create', name: 'CvCreate', component: CvBuilder },
      { path: 'cv/:id/edit', name: 'CvEdit', component: CvBuilder },
      { path: 'templates', name: 'Templates', component: Templates },
      { path: 'ats', name: 'AtsChecker', component: AtsChecker },
      { path: 'job-matcher', name: 'JobMatcher', component: JobMatcher },
      { path: 'jobs', name: 'Jobs', component: Jobs },
      { path: 'jobs/:id', name: 'JobDetail', component: JobDetail },
      { path: 'applications', name: 'Applications', component: Applications },
      { path: 'cover-letter', name: 'CoverLetter', component: CoverLetter },
      { path: 'interview', name: 'Interview', component: Interview },
      { path: 'admin/users', name: 'AdminUsers', component: AdminUsers, meta: { requiresAdmin: true } },
    ]
  },

  // Public CV view (no auth required)
  {
    path: '/cv/:id',
    name: 'PublicCv',
    component: PublicCv,
    meta: { guest: true }
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guards
// Auth state is already resolved in main.js before the router is installed,
// so isAuthenticated is accurate on every navigation.
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
