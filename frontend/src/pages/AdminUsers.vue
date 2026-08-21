<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">User Management</h2>
        <p class="text-slate-500 mt-1">Manage all registered users and their roles.</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <UserPlus class="w-4 h-4 mr-2" />
        Add User
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Users class="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ adminStore.stats.total }}</p>
            <p class="text-xs text-slate-500">Total Users</p>
          </div>
        </div>
      </div>
      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <ShieldCheck class="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ adminStore.stats.admins }}</p>
            <p class="text-xs text-slate-500">Admins</p>
          </div>
        </div>
      </div>
      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <User class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ adminStore.stats.regular }}</p>
            <p class="text-xs text-slate-500">Regular Users</p>
          </div>
        </div>
      </div>
      <div class="card p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <UserPlus class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-slate-900">{{ adminStore.stats.thisMonth }}</p>
            <p class="text-xs text-slate-500">New This Month</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            class="input-field pl-10"
            placeholder="Search by name or email..."
            @input="debouncedSearch"
          />
        </div>
        <select v-model="filterRole" class="input-field w-40" @change="handleSearch">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select v-model="sortBy" class="input-field w-40" @change="handleSearch">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="adminStore.loading && !adminStore.users.length" class="flex items-center justify-center py-16">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!adminStore.users.length" class="card p-12 text-center">
      <Users class="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-slate-700">No users found</h3>
      <p class="text-slate-500 mt-1 mb-4">Try adjusting your search or filters.</p>
      <button @click="clearAllFilters" class="btn-secondary text-sm">Clear Filters</button>
    </div>

    <!-- Users Table -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50">
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in adminStore.users" :key="user.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" :class="user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'">
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800">{{ user.name }}</p>
                    <p class="text-sm text-slate-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="px-2.5 py-1 text-xs font-semibold rounded-full" :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-5 py-4 text-sm text-slate-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center justify-end gap-2">
                  <!-- Edit -->
                  <button @click="editUser(user)" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Edit">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <!-- Toggle Role -->
                  <button
                    @click="handleToggleRole(user)"
                    class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition-colors"
                    :title="user.role === 'admin' ? 'Remove Admin' : 'Make Admin'"
                    :disabled="user.id === authStore.user?.id"
                  >
                    <ShieldCheck class="w-4 h-4" />
                  </button>
                  <!-- Reset Password -->
                  <button @click="handleResetPassword(user)" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition-colors" title="Reset Password">
                    <KeyRound class="w-4 h-4" />
                  </button>
                  <!-- Delete -->
                  <button
                    @click="handleDelete(user)"
                    class="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete"
                    :disabled="user.id === authStore.user?.id"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Results count -->
    <div v-if="adminStore.users.length" class="text-sm text-slate-500 text-center">
      Showing {{ adminStore.users.length }} user(s)
    </div>
  </div>

  <!-- Create User Modal -->
  <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showCreateModal = false">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800">Create New User</h3>
        <button @click="showCreateModal = false" class="p-1 rounded-lg hover:bg-slate-100">
          <X class="w-5 h-5 text-slate-400" />
        </button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input v-model="createForm.name" class="input-field" placeholder="John Doe" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input v-model="createForm.email" type="email" class="input-field" placeholder="user@example.com" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input v-model="createForm.password" type="password" class="input-field" placeholder="Min. 6 characters" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <select v-model="createForm.role" class="input-field">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div class="flex items-center gap-3 pt-2">
        <button @click="showCreateModal = false" class="btn-secondary flex-1">Cancel</button>
        <button @click="handleCreate" class="btn-primary flex-1" :disabled="adminStore.loading || !createForm.name || !createForm.email || !createForm.password">
          <Loader2 v-if="adminStore.loading" class="w-4 h-4 animate-spin mr-2" />
          Create User
        </button>
      </div>
    </div>
  </div>

  <!-- Edit User Modal -->
  <div v-if="showEditModal && editingUser" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showEditModal = false">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800">Edit User</h3>
        <button @click="showEditModal = false" class="p-1 rounded-lg hover:bg-slate-100">
          <X class="w-5 h-5 text-slate-400" />
        </button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input v-model="editForm.name" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input v-model="editForm.email" type="email" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <select v-model="editForm.role" class="input-field" :disabled="editingUser.id === authStore.user?.id">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">New Password (leave blank to keep)</label>
          <input v-model="editForm.password" type="password" class="input-field" placeholder="Leave blank to keep current" />
        </div>
      </div>
      <div class="flex items-center gap-3 pt-2">
        <button @click="showEditModal = false" class="btn-secondary flex-1">Cancel</button>
        <button @click="handleUpdate" class="btn-primary flex-1" :disabled="adminStore.loading || !editForm.name || !editForm.email">
          <Loader2 v-if="adminStore.loading" class="w-4 h-4 animate-spin mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { useAuthStore } from '@/stores/authStore'
import {
  Users, User, UserPlus, ShieldCheck, Search, Pencil, Trash2,
  KeyRound, Loader2, X
} from 'lucide-vue-next'

const adminStore = useAdminStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const filterRole = ref('')
const sortBy = ref('newest')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingUser = ref(null)

const createForm = reactive({ name: '', email: '', password: '', role: 'user' })
const editForm = reactive({ name: '', email: '', role: 'user', password: '' })

let searchTimer = null

onMounted(async () => {
  await adminStore.fetchUsers()
  await adminStore.fetchStats()
})

function debouncedSearch() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => handleSearch(), 300)
}

async function handleSearch() {
  adminStore.setFilters({
    search: searchQuery.value,
    role: filterRole.value,
    sort: sortBy.value
  })
  await adminStore.fetchUsers()
}

function clearAllFilters() {
  searchQuery.value = ''
  filterRole.value = ''
  sortBy.value = 'newest'
  adminStore.clearFilters()
  handleSearch()
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function editUser(user) {
  editingUser.value = user
  editForm.name = user.name
  editForm.email = user.email
  editForm.role = user.role
  editForm.password = ''
  showEditModal.value = true
}

async function handleCreate() {
  try {
    await adminStore.createUser(createForm)
    showCreateModal.value = false
    createForm.name = ''
    createForm.email = ''
    createForm.password = ''
    createForm.role = 'user'
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to create user')
  }
}

async function handleUpdate() {
  try {
    const data = { name: editForm.name, email: editForm.email, role: editForm.role }
    if (editForm.password) data.password = editForm.password
    await adminStore.updateUser(editingUser.value.id, data)
    showEditModal.value = false
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update user')
  }
}

async function handleToggleRole(user) {
  if (user.id === authStore.user?.id) return
  const newRole = user.role === 'admin' ? 'user' : 'admin'
  if (confirm(`Change ${user.name}'s role to ${newRole}?`)) {
    try {
      await adminStore.toggleRole(user.id)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle role')
    }
  }
}

async function handleResetPassword(user) {
  if (confirm(`Reset ${user.name}'s password to "password123"?`)) {
    try {
      const result = await adminStore.resetPassword(user.id)
      alert(`Password reset!\nEmail: ${result.email}\nNew Password: ${result.newPassword}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password')
    }
  }
}

async function handleDelete(user) {
  if (user.id === authStore.user?.id) return
  if (confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) {
    try {
      await adminStore.deleteUser(user.id)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }
}
</script>
