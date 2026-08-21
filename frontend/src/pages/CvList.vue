<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">My CVs</h2>
        <p class="text-slate-500 mt-1">Manage your CV collection.</p>
      </div>
      <router-link to="/dashboard/cv/create" class="btn-primary">
        <Plus class="w-4 h-4 mr-2" />
        Create CV
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="cvStore.loading && !cvStore.cvs.length" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!cvStore.cvs.length" class="card p-12 text-center">
      <FileText class="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-slate-700">No CVs yet</h3>
      <p class="text-slate-500 mt-1 mb-4">Create your first CV to get started.</p>
      <router-link to="/dashboard/cv/create" class="btn-primary text-sm">
        <Plus class="w-4 h-4 mr-2" />
        Create Your First CV
      </router-link>
    </div>

    <!-- CV Grid -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="cv in cvStore.cvs"
        :key="cv.id"
        class="card p-5 hover:shadow-soft transition-all duration-300 group"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileText class="w-5 h-5 text-indigo-600" />
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-slate-800 truncate">{{ cv.title || 'Untitled CV' }}</h3>
              <p class="text-xs text-slate-400">{{ formatDate(cv.createdAt) }}</p>
            </div>
          </div>
          <div class="relative" @click.stop>
            <button @click="toggleMenu(cv.id)" class="p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <MoreVertical class="w-4 h-4 text-slate-400" />
            </button>
            <div
              v-if="menuOpen === cv.id"
              class="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 min-w-[180px]"
            >
              <router-link
                :to="`/dashboard/cv/${cv.id}/edit`"
                class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                @click="menuOpen = null"
              >
                <Edit class="w-4 h-4" /> Edit
              </router-link>
              <button
                @click="handleDuplicate(cv.id)"
                class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
              >
                <Copy class="w-4 h-4" /> Duplicate
              </button>
              <button
                @click="handleTogglePublic(cv)"
                class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full text-left"
              >
                <Globe class="w-4 h-4" /> {{ cv.isPublic ? 'Make Private' : 'Make Public' }}
              </button>
              <button
                v-if="cv.isPublic"
                @click="handleCopyLink(cv.id)"
                class="flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 w-full text-left"
              >
                <Link class="w-4 h-4" /> Copy Share Link
              </button>
              <hr class="my-1 border-slate-100" />
              <button
                @click="handleDelete(cv.id)"
                class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <Trash2 class="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Public badge -->
        <div class="mb-2">
          <span
            v-if="cv.isPublic"
            class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium"
          >
            <Globe class="w-3 h-3" /> Public
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500"
          >
            <Lock class="w-3 h-3" /> Private
          </span>
        </div>

        <div class="space-y-2 text-sm text-slate-500">
          <div v-if="cv.personal?.fullName" class="flex items-center gap-2">
            <User class="w-3.5 h-3.5" /> {{ cv.personal.fullName }}
          </div>
          <div v-if="cv.experiences?.length" class="flex items-center gap-2">
            <Briefcase class="w-3.5 h-3.5" /> {{ cv.experiences.length }} experience{{ cv.experiences.length > 1 ? 's' : '' }}
          </div>
          <div v-if="cv.skills?.length" class="flex items-center gap-2">
            <Zap class="w-3.5 h-3.5" /> {{ cv.skills.length }} skill{{ cv.skills.length > 1 ? 's' : '' }}
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-4 flex gap-2">
          <router-link
            :to="`/dashboard/cv/${cv.id}/edit`"
            class="btn-primary text-sm flex-1 text-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit class="w-4 h-4 mr-1 inline" /> Edit
          </router-link>
          <button
            v-if="cv.isPublic"
            @click="handleCopyLink(cv.id)"
            class="btn-secondary text-sm px-3 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy share link"
          >
            <Link class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Copy Success Toast -->
    <transition name="fade">
      <div
        v-if="showCopied"
        class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
      >
        <CheckCircle class="w-5 h-5" />
        <span class="text-sm font-medium">Link copied to clipboard!</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCvStore } from '@/stores/cvStore'
import cvService from '@/services/cvService'
import {
  FileText, Plus, Edit, Trash2, Copy, MoreVertical, User, Briefcase, Zap,
  Loader2, Globe, Lock, Link, CheckCircle
} from 'lucide-vue-next'

const cvStore = useCvStore()
const menuOpen = ref(null)
const showCopied = ref(false)

onMounted(() => {
  cvStore.fetchCvs()
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function toggleMenu(id) {
  menuOpen.value = menuOpen.value === id ? null : id
}

async function handleTogglePublic(cv) {
  menuOpen.value = null
  try {
    const newStatus = !cv.isPublic
    await cvService.togglePublic(cv.id, newStatus)
    // Update local state
    const index = cvStore.cvs.findIndex(c => c.id === cv.id)
    if (index !== -1) {
      cvStore.cvs[index] = { ...cvStore.cvs[index], isPublic: newStatus }
    }
  } catch (err) {
    console.error('Toggle public failed:', err)
  }
}

function handleCopyLink(id) {
  menuOpen.value = null
  const url = `${window.location.origin}/cv/${id}`
  navigator.clipboard.writeText(url).then(() => {
    showCopied.value = true
    setTimeout(() => showCopied.value = false, 2000)
  })
}

async function handleDuplicate(id) {
  menuOpen.value = null
  try {
    await cvStore.duplicateCv(id)
  } catch (err) {
    console.error('Duplicate failed:', err)
  }
}

async function handleDelete(id) {
  menuOpen.value = null
  if (confirm('Are you sure you want to delete this CV?')) {
    try {
      await cvStore.deleteCv(id)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
