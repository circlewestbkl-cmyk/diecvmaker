<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Cover Letters</h2>
        <p class="text-slate-500 mt-1">Create and manage your cover letters.</p>
      </div>
      <button @click="showForm = !showForm" class="btn-primary">
        <Plus v-if="!showForm" class="w-4 h-4 mr-2" />
        <X v-else class="w-4 h-4 mr-2" />
        {{ showForm ? 'Cancel' : 'New Cover Letter' }}
      </button>
    </div>

    <!-- Create/Edit Form -->
    <div v-if="showForm" class="card p-6 space-y-4">
      <h3 class="font-semibold text-slate-800">{{ editingId ? 'Edit' : 'New' }} Cover Letter</h3>
      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="field-label">Title</label>
          <input v-model="form.title" class="input-field" placeholder="My Cover Letter" />
        </div>
        <div>
          <label class="field-label">Company Name</label>
          <input v-model="form.companyName" class="input-field" placeholder="Google" />
        </div>
        <div>
          <label class="field-label">Position</label>
          <input v-model="form.position" class="input-field" placeholder="Frontend Developer" />
        </div>
        <div>
          <label class="field-label">Link to CV (optional)</label>
          <select v-model="form.cvId" class="input-field">
            <option value="">None</option>
            <option v-for="cv in cvStore.cvs" :key="cv.id" :value="cv.id">{{ cv.title }}</option>
          </select>
        </div>
      </div>
      <div>
        <label class="field-label">Job Description (for AI generation)</label>
        <textarea v-model="form.jobDescription" class="input-field" rows="3" placeholder="Paste job description to auto-generate..." />
      </div>
      <div>
        <label class="field-label">Cover Letter Content</label>
        <textarea v-model="form.content" class="input-field" rows="10" placeholder="Write your cover letter here..." />
      </div>
      <div class="flex items-center gap-3">
        <button @click="handleGenerate" class="btn-secondary" :disabled="generating || !form.jobDescription">
          <Loader2 v-if="generating" class="w-4 h-4 animate-spin mr-2" />
          <Sparkles v-else class="w-4 h-4 mr-2" />
          {{ generating ? 'Generating...' : 'AI Generate' }}
        </button>
        <button @click="handleSave" class="btn-primary" :disabled="saving">
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin mr-2" />
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="coverLetterStore.loading && !coverLetterStore.letters.length" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!coverLetterStore.letters.length && !showForm" class="card p-12 text-center">
      <BookOpen class="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-slate-700">No cover letters yet</h3>
      <p class="text-slate-500 mt-1 mb-4">Create your first cover letter.</p>
      <button @click="showForm = true" class="btn-primary text-sm">
        <Plus class="w-4 h-4 mr-2" /> Create Cover Letter
      </button>
    </div>

    <!-- Letters List -->
    <div v-else class="space-y-4">
      <div v-for="letter in coverLetterStore.letters" :key="letter.id" class="card p-5">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-semibold text-slate-800">{{ letter.title || 'Untitled' }}</h3>
            <p class="text-sm text-slate-500">
              {{ letter.companyName ? `${letter.companyName}` : '' }}{{ letter.position ? ` • ${letter.position}` : '' }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="editLetter(letter)" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
              <Edit class="w-4 h-4" />
            </button>
            <button @click="handleDelete(letter.id)" class="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
        <p class="text-sm text-slate-600 line-clamp-3 whitespace-pre-wrap">{{ letter.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCvStore } from '@/stores/cvStore'
import { useCoverLetterStore } from '@/stores/coverLetterStore'
import aiService from '@/services/aiService'
import { Plus, X, BookOpen, Edit, Trash2, Loader2, Sparkles } from 'lucide-vue-next'

const cvStore = useCvStore()
const coverLetterStore = useCoverLetterStore()

const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const generating = ref(false)

const form = reactive({
  title: '',
  companyName: '',
  position: '',
  jobDescription: '',
  content: '',
  cvId: ''
})

onMounted(() => {
  cvStore.fetchCvs()
  coverLetterStore.fetchLetters()
})

function editLetter(letter) {
  editingId.value = letter.id
  Object.assign(form, {
    title: letter.title || '',
    companyName: letter.companyName || '',
    position: letter.position || '',
    jobDescription: letter.jobDescription || '',
    content: letter.content || '',
    cvId: letter.cvId || ''
  })
  showForm.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editingId.value) {
      await coverLetterStore.updateLetter(editingId.value, { ...form })
    } else {
      await coverLetterStore.createLetter({ ...form })
    }
    showForm.value = false
    editingId.value = null
    Object.assign(form, { title: '', companyName: '', position: '', jobDescription: '', content: '', cvId: '' })
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

async function handleGenerate() {
  generating.value = true
  try {
    let cvSummary = ''
    if (form.cvId) {
      const cv = cvStore.cvs.find(c => c.id === form.cvId)
      if (cv) {
        cvSummary = [cv.personal?.fullName, cv.summary, ...(cv.experiences || []).map(e => e.position)].filter(Boolean).join(' ')
      }
    }
    const response = await aiService.generateCoverLetter({
      cvSummary,
      jobDescription: form.jobDescription,
      companyName: form.companyName,
      position: form.position
    })
    form.content = response.data.data.coverLetter
  } catch (err) {
    console.error(err)
  } finally {
    generating.value = false
  }
}

async function handleDelete(id) {
  if (confirm('Delete this cover letter?')) {
    await coverLetterStore.deleteLetter(id)
  }
}
</script>

<style scoped>
.field-label { @apply block text-xs font-medium text-slate-600 mb-1; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
