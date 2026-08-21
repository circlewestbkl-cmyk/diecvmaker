<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Templates</h2>
      <p class="text-slate-500 mt-1">Choose from professionally designed, ATS-friendly templates. All templates are optimized for Applicant Tracking Systems.</p>
    </div>

    <!-- ATS Info Banner -->
    <div class="card p-4 bg-indigo-50 border-indigo-200">
      <div class="flex items-start gap-3">
        <ShieldCheck class="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 class="text-sm font-semibold text-indigo-800">All Templates are ATS-Friendly</h3>
          <p class="text-xs text-indigo-600 mt-1">Every template uses clean text structure without tables, columns, or images. ATS systems can easily parse your CV data including contact info, experience, education, and skills.</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="templateStore.loading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-indigo-600" />
    </div>

    <!-- Template Grid -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="tpl in templateStore.templates"
        :key="tpl.id"
        class="card overflow-hidden hover:shadow-soft transition-all duration-300 group"
      >
        <!-- Preview Area -->
        <div class="h-56 bg-gradient-to-br flex items-center justify-center relative overflow-hidden" :class="templateStyles[tpl.id]?.bg || 'from-slate-100 to-slate-50'">
          <!-- Mini CV Preview -->
          <div class="w-[70%] h-[85%] bg-white rounded shadow-sm p-3 text-left overflow-hidden">
            <div class="h-2 w-16 rounded mb-1" :class="templateStyles[tpl.id]?.accent || 'bg-indigo-600'" />
            <div class="h-1 w-24 bg-slate-200 rounded mb-2" />
            <div class="space-y-1">
              <div class="h-1 w-full bg-slate-100 rounded" />
              <div class="h-1 w-4/5 bg-slate-100 rounded" />
              <div class="h-1 w-3/5 bg-slate-100 rounded" />
            </div>
            <div class="mt-2 space-y-1">
              <div class="h-1 w-12 rounded mb-0.5" :class="templateStyles[tpl.id]?.accent || 'bg-indigo-400'" />
              <div class="h-1 w-full bg-slate-100 rounded" />
              <div class="h-1 w-4/5 bg-slate-100 rounded" />
            </div>
            <div class="mt-2 space-y-1">
              <div class="h-1 w-16 rounded mb-0.5" :class="templateStyles[tpl.id]?.accent || 'bg-indigo-400'" />
              <div class="flex gap-1">
                <div class="h-1.5 w-8 rounded-full bg-indigo-50" />
                <div class="h-1.5 w-10 rounded-full bg-indigo-50" />
                <div class="h-1.5 w-6 rounded-full bg-indigo-50" />
              </div>
            </div>
          </div>

          <!-- Badges -->
          <div class="absolute top-3 right-3 flex gap-1.5">
            <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">
              ATS Friendly
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-slate-800">{{ tpl.name }}</h3>
            <span class="text-xs text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">{{ tpl.category }}</span>
          </div>
          <p class="text-sm text-slate-500 mb-3">{{ tpl.description || templateDescriptions[tpl.id] || 'Professional template for your CV.' }}</p>

          <!-- Features -->
          <div v-if="tpl.features?.length" class="flex flex-wrap gap-1.5 mb-3">
            <span v-for="feature in tpl.features" :key="feature" class="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-medium rounded-full">
              {{ feature }}
            </span>
          </div>

          <button
            @click="handleSelect(tpl)"
            class="btn-primary text-sm w-full"
          >
            <Check v-if="selectedTemplate === tpl.id" class="w-4 h-4 mr-2" />
            <span v-else>Use Template</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplateStore } from '@/stores/templateStore'
import { Loader2, Check, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const templateStore = useTemplateStore()
const selectedTemplate = ref(null)

onMounted(() => {
  templateStore.fetchTemplates()
})

const templateStyles = {
  tpl_classic: { bg: 'from-indigo-50 to-white', accent: 'bg-indigo-600' },
  tpl_modern: { bg: 'from-blue-50 to-white', accent: 'bg-blue-600' },
  tpl_professional: { bg: 'from-slate-100 to-white', accent: 'bg-slate-800' },
  tpl_minimalist: { bg: 'from-gray-50 to-white', accent: 'bg-gray-800' },
  tpl_developer: { bg: 'from-emerald-50 to-white', accent: 'bg-emerald-600' },
  tpl_executive: { bg: 'from-amber-50 to-white', accent: 'bg-amber-700' },
}

const templateDescriptions = {
  tpl_classic: 'Clean and ATS-optimized design. Perfect for any industry.',
  tpl_modern: 'Modern layout with a professional touch. Great for tech roles.',
  tpl_professional: 'Formal design for corporate and traditional industries.',
  tpl_minimalist: 'Minimal design that lets your content speak for itself.',
  tpl_developer: 'Designed for software engineers and tech professionals.',
  tpl_executive: 'Elegant template for senior and executive positions.',
}

function handleSelect(tpl) {
  selectedTemplate.value = tpl.id
  router.push({ path: '/dashboard/cv/create', query: { template: tpl.id } })
}
</script>
