import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Initialize auth state BEFORE installing the router.
// This ensures the navigation guard sees the correct
// isAuthenticated value on the very first navigation,
// preventing redirect loops and blank pages.
const authStore = useAuthStore()
authStore.fetchUser().then(() => {
  app.use(router)
  app.mount('#app')
})
