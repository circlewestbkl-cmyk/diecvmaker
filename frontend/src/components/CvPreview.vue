<template>
  <div class="cv-preview-wrapper bg-slate-200 p-4 rounded-2xl overflow-auto">
    <div class="cv-page bg-white shadow-lg mx-auto" :style="{ width: '210mm', minHeight: '297mm' }">
      <!-- Header / Personal Info -->
      <div class="cv-header p-8 pb-4 border-b-2" :class="colors.border">
        <h1 class="text-3xl font-bold text-slate-900">
          {{ cv.personal?.fullName || 'Your Name' }}
        </h1>
        <p v-if="cv.personal?.professionalTitle" class="text-lg font-medium mt-1" :class="colors.accent">
          {{ cv.personal.professionalTitle }}
        </p>
        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-600">
          <span v-if="cv.personal?.email" class="flex items-center gap-1">
            {{ cv.personal.email }}
          </span>
          <span v-if="cv.personal?.phone" class="flex items-center gap-1">
            {{ cv.personal.phone }}
          </span>
          <span v-if="cv.personal?.location" class="flex items-center gap-1">
            {{ cv.personal.location }}
          </span>
          <a v-if="cv.personal?.website" :href="cv.personal.website" target="_blank" class="text-indigo-600 hover:underline">
            {{ cv.personal.website }}
          </a>
          <a v-if="cv.personal?.linkedin" :href="cv.personal.linkedin" target="_blank" class="text-indigo-600 hover:underline">
            LinkedIn
          </a>
          <a v-if="cv.personal?.github" :href="cv.personal.github" target="_blank" class="text-indigo-600 hover:underline">
            GitHub
          </a>
        </div>
      </div>

      <div class="cv-body p-8 space-y-6">
        <!-- Summary -->
        <section v-if="cv.summary">
          <h2 class="cv-section-title">Professional Summary</h2>
          <p class="text-sm text-slate-700 leading-relaxed">{{ cv.summary }}</p>
        </section>

        <!-- Experience -->
        <section v-if="cv.experiences?.length">
          <h2 class="cv-section-title">Work Experience</h2>
          <div v-for="exp in cv.experiences" :key="exp.id" class="mb-4 last:mb-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-slate-900">{{ exp.position || 'Position' }}</h3>
                <p class="text-sm text-indigo-600">{{ exp.company || 'Company' }}{{ exp.location ? ` • ${exp.location}` : '' }}</p>
              </div>
              <span class="text-xs text-slate-500 whitespace-nowrap ml-4">
                {{ formatDate(exp.startDate) }} – {{ exp.current ? 'Present' : formatDate(exp.endDate) }}
              </span>
            </div>
            <p v-if="exp.description" class="text-sm text-slate-700 mt-1 leading-relaxed">{{ exp.description }}</p>
            <ul v-if="exp.achievements?.length" class="list-disc list-inside mt-1 space-y-0.5">
              <li v-for="(achievement, i) in exp.achievements" :key="i" class="text-sm text-slate-700">
                {{ achievement }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Education -->
        <section v-if="cv.education?.length">
          <h2 class="cv-section-title">Education</h2>
          <div v-for="edu in cv.education" :key="edu.id" class="mb-3 last:mb-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-slate-900">{{ edu.degree || 'Degree' }}{{ edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : '' }}</h3>
                <p class="text-sm text-indigo-600">{{ edu.institution || 'Institution' }}</p>
              </div>
              <span class="text-xs text-slate-500 whitespace-nowrap ml-4">
                {{ formatDate(edu.startDate) }} – {{ formatDate(edu.endDate) }}
              </span>
            </div>
            <p v-if="edu.gpa" class="text-sm text-slate-600 mt-0.5">GPA: {{ edu.gpa }}</p>
            <p v-if="edu.description" class="text-sm text-slate-700 mt-1">{{ edu.description }}</p>
          </div>
        </section>

        <!-- Skills -->
        <section v-if="cv.skills?.length">
          <h2 class="cv-section-title">Skills</h2>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in cv.skills" :key="skill.name" class="px-3 py-1 text-sm rounded-full" :class="colors.tag">
              {{ skill.name }}<span v-if="skill.level" class="text-indigo-400 ml-1">• {{ skill.level }}</span>
            </span>
          </div>
        </section>

        <!-- Projects -->
        <section v-if="cv.projects?.length">
          <h2 class="cv-section-title">Projects</h2>
          <div v-for="project in cv.projects" :key="project.name" class="mb-3 last:mb-0">
            <div class="flex items-start justify-between">
              <h3 class="font-semibold text-slate-900">
                {{ project.name }}
                <a v-if="project.url" :href="project.url" target="_blank" class="text-indigo-600 text-sm font-normal ml-2 hover:underline">↗</a>
                <a v-if="project.github" :href="project.github" target="_blank" class="text-slate-500 text-sm font-normal ml-1 hover:underline">GitHub</a>
              </h3>
            </div>
            <p v-if="project.description" class="text-sm text-slate-700 mt-0.5">{{ project.description }}</p>
            <p v-if="project.technologies?.length" class="text-xs text-slate-500 mt-1">
              {{ project.technologies.join(' • ') }}
            </p>
          </div>
        </section>

        <!-- Certifications -->
        <section v-if="cv.certifications?.length">
          <h2 class="cv-section-title">Certifications</h2>
          <div v-for="cert in cv.certifications" :key="cert.name" class="mb-2 last:mb-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-slate-900 text-sm">{{ cert.name }}</h3>
                <p class="text-xs text-slate-600">{{ cert.issuer }}{{ cert.date ? ` • ${cert.date}` : '' }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section v-if="cv.languages?.length">
          <h2 class="cv-section-title">Languages</h2>
          <div class="flex flex-wrap gap-4">
            <span v-for="lang in cv.languages" :key="lang.language" class="text-sm text-slate-700">
              <strong>{{ lang.language }}</strong><span v-if="lang.proficiency" class="text-slate-500"> – {{ lang.proficiency }}</span>
            </span>
          </div>
        </section>

        <!-- Achievements -->
        <section v-if="cv.achievements?.length">
          <h2 class="cv-section-title">Achievements</h2>
          <div v-for="ach in cv.achievements" :key="ach.title" class="mb-2 last:mb-0">
            <h3 class="font-semibold text-slate-900 text-sm">{{ ach.title }}</h3>
            <p class="text-xs text-slate-600">{{ ach.organization }}{{ ach.date ? ` • ${ach.date}` : '' }}</p>
            <p v-if="ach.description" class="text-sm text-slate-700 mt-0.5">{{ ach.description }}</p>
          </div>
        </section>

        <!-- Empty State -->
        <div v-if="isEmpty" class="text-center py-12 text-slate-400">
          <FileText class="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p class="text-sm">Start filling in your CV details to see the preview.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FileText } from 'lucide-vue-next'

const props = defineProps({
  cv: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const templateColors = {
  tpl_classic: { border: 'border-indigo-600', accent: 'text-indigo-600', tag: 'bg-indigo-50 text-indigo-700', tagBorder: 'border-indigo-100' },
  tpl_modern: { border: 'border-blue-600', accent: 'text-blue-600', tag: 'bg-blue-50 text-blue-700', tagBorder: 'border-blue-100' },
  tpl_professional: { border: 'border-slate-800', accent: 'text-slate-800', tag: 'bg-slate-100 text-slate-700', tagBorder: 'border-slate-200' },
  tpl_minimalist: { border: 'border-gray-800', accent: 'text-gray-700', tag: 'bg-gray-100 text-gray-600', tagBorder: 'border-gray-200' },
  tpl_developer: { border: 'border-emerald-600', accent: 'text-emerald-600', tag: 'bg-emerald-50 text-emerald-700', tagBorder: 'border-emerald-100' },
  tpl_executive: { border: 'border-amber-700', accent: 'text-amber-700', tag: 'bg-amber-50 text-amber-700', tagBorder: 'border-amber-100' },
}

const colors = computed(() => templateColors[props.cv.templateId] || templateColors.tpl_classic)

const isEmpty = computed(() => {
  const cv = props.cv
  return !cv.personal?.fullName &&
    !cv.summary &&
    !cv.experiences?.length &&
    !cv.education?.length &&
    !cv.skills?.length
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month) - 1]} ${year}`
}
</script>

<style scoped>
.cv-page {
  transform-origin: top center;
}

.cv-section-title {
  font-size: 12pt;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 4px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 700;
}

@media print {
  .cv-preview-wrapper {
    background: none !important;
    padding: 0 !important;
  }
  .cv-page {
    box-shadow: none !important;
    width: 210mm !important;
    min-height: 297mm !important;
  }
}
</style>
