<template>
  <div class="space-y-6">
    <!-- ATS Badge -->
    <div v-if="atsScore > 0" class="flex items-center gap-3 p-3 rounded-xl border" :class="atsScoreBg">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="atsScoreBadgeBg">
        <ShieldCheck class="w-4 h-4" :class="atsScoreBadgeText" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-semibold" :class="atsScoreText">ATS Score: {{ atsScore }}/100</p>
        <p class="text-xs" :class="atsScoreLabelColor">{{ atsScoreLabel }}</p>
      </div>
      <button @click="showAtsTips = !showAtsTips" class="text-xs font-medium px-3 py-1.5 rounded-lg" :class="atsScoreBadgeBg + ' ' + atsScoreBadgeText">
        {{ showAtsTips ? 'Hide Tips' : 'Show Tips' }}
      </button>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <router-link to="/dashboard/cv" class="text-sm text-slate-500 hover:text-indigo-600 mb-1 inline-flex items-center gap-1">
          <ArrowLeft class="w-4 h-4" /> Back to My CVs
        </router-link>
        <h2 class="text-2xl font-bold text-slate-900">{{ isNew ? 'Create New CV' : 'Edit CV' }}</h2>
      </div>
      <div class="flex items-center gap-3">
        <input
          v-model="cv.title"
          class="input-field w-64"
          placeholder="CV Title"
          @change="autoSave"
        />
        <select v-model="cv.templateId" class="input-field w-40 text-sm" @change="autoSave">
          <option value="tpl_classic">ATS Classic</option>
          <option value="tpl_modern">ATS Modern</option>
          <option value="tpl_professional">Professional</option>
          <option value="tpl_minimalist">Minimalist</option>
          <option value="tpl_developer">Developer</option>
          <option value="tpl_executive">Executive</option>
        </select>
        <button @click="handleDownloadPdf" class="btn-secondary text-sm" :disabled="generatingPdf">
          <Loader2 v-if="generatingPdf" class="w-4 h-4 animate-spin mr-2" />
          <Download v-else class="w-4 h-4 mr-2" />
          PDF
        </button>
        <button @click="handleSave" class="btn-primary" :disabled="saving">
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin mr-2" />
          <Save v-else class="w-4 h-4 mr-2" />
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <!-- Mobile Tabs -->
    <div class="flex lg:hidden bg-white rounded-xl p-1 border border-slate-200">
      <button
        @click="activeTab = 'editor'"
        class="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
        :class="activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-600'"
      >
        Editor
      </button>
      <button
        @click="activeTab = 'preview'"
        class="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
        :class="activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-600'"
      >
        Preview
      </button>
    </div>

    <!-- Main Layout: Editor + Preview -->
    <div class="flex gap-6" :class="activeTab === 'preview' ? 'flex-col lg:flex-row' : 'flex-col lg:flex-row'">
      <!-- Editor Panel -->
      <div
        class="w-full lg:w-[45%] space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]"
        :class="{ 'hidden lg:block': activeTab === 'preview' }"
      >
        <!-- ATS Tips Panel -->
        <AtsTipsPanel
          v-if="showAtsTips"
          :score="atsScore"
          :tips="atsTips"
          :breakdown="atsBreakdown"
        />

        <!-- Personal Info -->
        <Section title="Personal Information" icon="User" :open="openSections.personal" @toggle="openSections.personal = !openSections.personal">
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="field-label">Full Name</label><input v-model="cv.personal.fullName" class="input-field" @change="autoSave" /></div>
            <div><label class="field-label">Professional Title</label><input v-model="cv.personal.professionalTitle" class="input-field" @change="autoSave" /></div>
            <div><label class="field-label">Email</label><input v-model="cv.personal.email" type="email" class="input-field" @change="autoSave" /></div>
            <div><label class="field-label">Phone</label><input v-model="cv.personal.phone" class="input-field" @change="autoSave" /></div>
            <div><label class="field-label">Location</label><input v-model="cv.personal.location" class="input-field" @change="autoSave" /></div>
            <div><label class="field-label">Website</label><input v-model="cv.personal.website" class="input-field" placeholder="https://" @change="autoSave" /></div>
            <div><label class="field-label">LinkedIn</label><input v-model="cv.personal.linkedin" class="input-field" @change="autoSave" /></div>
            <div><label class="field-label">GitHub</label><input v-model="cv.personal.github" class="input-field" @change="autoSave" /></div>
          </div>
        </Section>

        <!-- Summary -->
        <Section title="Professional Summary" icon="AlignLeft" :open="openSections.summary" @toggle="openSections.summary = !openSections.summary">
          <textarea v-model="cv.summary" class="input-field" rows="4" placeholder="Write a brief professional summary..." @change="autoSave" />
        </Section>

        <!-- Experience -->
        <Section title="Experience" icon="Briefcase" :open="openSections.experience" @toggle="openSections.experience = !openSections.experience">
          <div v-for="(exp, idx) in cv.experiences" :key="exp.id" class="p-4 bg-slate-50 rounded-xl mb-3 last:mb-0 relative">
            <button @click="removeItem('experiences', idx)" class="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid sm:grid-cols-2 gap-3">
              <div><label class="field-label">Company</label><input v-model="exp.company" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Position</label><input v-model="exp.position" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Location</label><input v-model="exp.location" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Start Date</label><input v-model="exp.startDate" type="month" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">End Date</label><input v-model="exp.endDate" type="month" class="input-field text-sm" :disabled="exp.current" @change="autoSave" /></div>
              <div class="flex items-center gap-2 mt-5">
                <input v-model="exp.current" type="checkbox" class="rounded border-slate-300 text-indigo-600" @change="autoSave" />
                <label class="text-sm text-slate-600">Currently working here</label>
              </div>
            </div>
            <div class="mt-3"><label class="field-label">Description</label><textarea v-model="exp.description" class="input-field text-sm" rows="2" @change="autoSave" /></div>
            <div class="mt-3">
              <label class="field-label">Achievements</label>
              <div v-for="(ach, ai) in exp.achievements" :key="ai" class="flex gap-2 mb-1">
                <input :value="ach" @input="exp.achievements[ai] = $event.target.value" class="input-field text-sm flex-1" @change="autoSave" />
                <button @click="exp.achievements.splice(ai, 1); autoSave()" class="p-1 text-red-400 hover:text-red-600"><X class="w-4 h-4" /></button>
              </div>
              <button @click="exp.achievements = exp.achievements || []; exp.achievements.push(''); autoSave()" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                + Add Achievement
              </button>
            </div>
          </div>
          <button @click="addExperience" class="btn-secondary text-sm w-full">
            <Plus class="w-4 h-4 mr-2" /> Add Experience
          </button>
        </Section>

        <!-- Education -->
        <Section title="Education" icon="GraduationCap" :open="openSections.education" @toggle="openSections.education = !openSections.education">
          <div v-for="(edu, idx) in cv.education" :key="edu.id" class="p-4 bg-slate-50 rounded-xl mb-3 last:mb-0 relative">
            <button @click="removeItem('education', idx)" class="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid sm:grid-cols-2 gap-3">
              <div><label class="field-label">Institution</label><input v-model="edu.institution" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Degree</label><input v-model="edu.degree" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Field of Study</label><input v-model="edu.fieldOfStudy" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">GPA</label><input v-model="edu.gpa" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Start Date</label><input v-model="edu.startDate" type="month" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">End Date</label><input v-model="edu.endDate" type="month" class="input-field text-sm" @change="autoSave" /></div>
            </div>
            <div class="mt-3"><label class="field-label">Description</label><textarea v-model="edu.description" class="input-field text-sm" rows="2" @change="autoSave" /></div>
          </div>
          <button @click="addEducation" class="btn-secondary text-sm w-full">
            <Plus class="w-4 h-4 mr-2" /> Add Education
          </button>
        </Section>

        <!-- Skills -->
        <Section title="Skills" icon="Zap" :open="openSections.skills" @toggle="openSections.skills = !openSections.skills">
          <div v-for="(skill, idx) in cv.skills" :key="idx" class="flex gap-2 mb-2 items-center">
            <input v-model="skill.name" class="input-field text-sm flex-1" placeholder="Skill name" @change="autoSave" />
            <select v-model="skill.level" class="input-field text-sm w-32" @change="autoSave">
              <option value="">Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
            <select v-model="skill.category" class="input-field text-sm w-32" @change="autoSave">
              <option value="">Category</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Database</option>
              <option>DevOps</option>
              <option>Design</option>
              <option>Other</option>
            </select>
            <button @click="cv.skills.splice(idx, 1); autoSave()" class="p-1 text-red-400 hover:text-red-600"><Trash2 class="w-4 h-4" /></button>
          </div>
          <button @click="cv.skills = cv.skills || []; cv.skills.push({ name: '', level: '', category: '' }); autoSave()" class="btn-secondary text-sm w-full">
            <Plus class="w-4 h-4 mr-2" /> Add Skill
          </button>
        </Section>

        <!-- Projects -->
        <Section title="Projects" icon="FolderGit" :open="openSections.projects" @toggle="openSections.projects = !openSections.projects">
          <div v-for="(project, idx) in cv.projects" :key="idx" class="p-4 bg-slate-50 rounded-xl mb-3 last:mb-0 relative">
            <button @click="cv.projects.splice(idx, 1); autoSave()" class="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid sm:grid-cols-2 gap-3">
              <div><label class="field-label">Project Name</label><input v-model="project.name" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Role</label><input v-model="project.role" class="input-field text-sm" @change="autoSave" /></div>
              <div class="sm:col-span-2"><label class="field-label">Description</label><textarea v-model="project.description" class="input-field text-sm" rows="2" @change="autoSave" /></div>
              <div><label class="field-label">Technologies</label><input v-model="project.techInput" class="input-field text-sm" placeholder="Vue.js, Node.js, etc" @change="updateProjectTechs(project)" /></div>
              <div><label class="field-label">URL</label><input v-model="project.url" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">GitHub</label><input v-model="project.github" class="input-field text-sm" @change="autoSave" /></div>
            </div>
          </div>
          <button @click="addProject" class="btn-secondary text-sm w-full">
            <Plus class="w-4 h-4 mr-2" /> Add Project
          </button>
        </Section>

        <!-- Certifications -->
        <Section title="Certifications" icon="Award" :open="openSections.certifications" @toggle="openSections.certifications = !openSections.certifications">
          <div v-for="(cert, idx) in cv.certifications" :key="idx" class="p-4 bg-slate-50 rounded-xl mb-3 last:mb-0 relative">
            <button @click="cv.certifications.splice(idx, 1); autoSave()" class="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid sm:grid-cols-2 gap-3">
              <div><label class="field-label">Name</label><input v-model="cert.name" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Issuer</label><input v-model="cert.issuer" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Date</label><input v-model="cert.date" type="month" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Credential ID</label><input v-model="cert.credentialId" class="input-field text-sm" @change="autoSave" /></div>
              <div class="sm:col-span-2"><label class="field-label">Credential URL</label><input v-model="cert.credentialUrl" class="input-field text-sm" @change="autoSave" /></div>
            </div>
          </div>
          <button @click="addCertification" class="btn-secondary text-sm w-full">
            <Plus class="w-4 h-4 mr-2" /> Add Certification
          </button>
        </Section>

        <!-- Languages -->
        <Section title="Languages" icon="Languages" :open="openSections.languages" @toggle="openSections.languages = !openSections.languages">
          <div v-for="(lang, idx) in cv.languages" :key="idx" class="flex gap-2 mb-2 items-center">
            <input v-model="lang.language" class="input-field text-sm flex-1" placeholder="Language" @change="autoSave" />
            <select v-model="lang.proficiency" class="input-field text-sm w-40" @change="autoSave">
              <option value="">Proficiency</option>
              <option>Native</option>
              <option>Fluent</option>
              <option>Advanced</option>
              <option>Intermediate</option>
              <option>Basic</option>
            </select>
            <button @click="cv.languages.splice(idx, 1); autoSave()" class="p-1 text-red-400 hover:text-red-600"><Trash2 class="w-4 h-4" /></button>
          </div>
          <button @click="cv.languages = cv.languages || []; cv.languages.push({ language: '', proficiency: '' }); autoSave()" class="btn-secondary text-sm w-full">
            <Plus class="w-4 h-4 mr-2" /> Add Language
          </button>
        </Section>

        <!-- Achievements -->
        <Section title="Achievements" icon="Trophy" :open="openSections.achievements" @toggle="openSections.achievements = !openSections.achievements">
          <div v-for="(ach, idx) in cv.achievements" :key="idx" class="p-4 bg-slate-50 rounded-xl mb-3 last:mb-0 relative">
            <button @click="cv.achievements.splice(idx, 1); autoSave()" class="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid sm:grid-cols-2 gap-3">
              <div><label class="field-label">Title</label><input v-model="ach.title" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Organization</label><input v-model="ach.organization" class="input-field text-sm" @change="autoSave" /></div>
              <div><label class="field-label">Date</label><input v-model="ach.date" type="month" class="input-field text-sm" @change="autoSave" /></div>
              <div class="sm:col-span-2"><label class="field-label">Description</label><textarea v-model="ach.description" class="input-field text-sm" rows="2" @change="autoSave" /></div>
            </div>
          </div>
          <button @click="addAchievement" class="btn-secondary text-sm w-full">
            <Plus class="w-4 h-4 mr-2" /> Add Achievement
          </button>
        </Section>
      </div>

      <!-- Preview Panel -->
      <div
        class="w-full lg:w-[55%] lg:sticky lg:top-20 lg:self-start overflow-auto max-h-[calc(100vh-200px)]"
        :class="{ 'hidden lg:block': activeTab === 'editor' }"
      >
        <CvPreview :cv="cv" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCvStore } from '@/stores/cvStore'
import Section from '@/components/CvSection.vue'
import CvPreview from '@/components/CvPreview.vue'
import AtsTipsPanel from '@/components/AtsTipsPanel.vue'
import atsService from '@/services/atsService'
import { ArrowLeft, Save, Plus, Trash2, X, Loader2, Download, ShieldCheck } from 'lucide-vue-next'
import cvService from '@/services/cvService'

const route = useRoute()
const router = useRouter()
const cvStore = useCvStore()

const isNew = ref(!route.params.id)
const saving = ref(false)
const generatingPdf = ref(false)
const activeTab = ref('editor')
const autoSaveTimer = ref(null)
const atsTimer = ref(null)

// ATS Analysis state
const showAtsTips = ref(true)
const atsScore = ref(0)
const atsTips = ref([])
const atsBreakdown = ref({})

const atsScoreBg = computed(() => {
  if (atsScore.value >= 80) return 'bg-emerald-50 border-emerald-200'
  if (atsScore.value >= 60) return 'bg-amber-50 border-amber-200'
  if (atsScore.value >= 40) return 'bg-orange-50 border-orange-200'
  return 'bg-red-50 border-red-200'
})
const atsScoreBadgeBg = computed(() => {
  if (atsScore.value >= 80) return 'bg-emerald-100'
  if (atsScore.value >= 60) return 'bg-amber-100'
  if (atsScore.value >= 40) return 'bg-orange-100'
  return 'bg-red-100'
})
const atsScoreBadgeText = computed(() => {
  if (atsScore.value >= 80) return 'text-emerald-600'
  if (atsScore.value >= 60) return 'text-amber-600'
  if (atsScore.value >= 40) return 'text-orange-600'
  return 'text-red-600'
})
const atsScoreText = computed(() => {
  if (atsScore.value >= 80) return 'text-emerald-700'
  if (atsScore.value >= 60) return 'text-amber-700'
  if (atsScore.value >= 40) return 'text-orange-700'
  return 'text-red-700'
})
const atsScoreLabelColor = computed(() => {
  if (atsScore.value >= 80) return 'text-emerald-600'
  if (atsScore.value >= 60) return 'text-amber-600'
  if (atsScore.value >= 40) return 'text-orange-600'
  return 'text-red-600'
})
const atsScoreLabel = computed(() => {
  if (atsScore.value >= 80) return 'Your CV is highly ATS-friendly! 🎯'
  if (atsScore.value >= 60) return 'Good score! A few tips to improve further.'
  if (atsScore.value >= 40) return 'Several improvements needed for ATS compatibility.'
  return 'Follow the tips below to improve your ATS score.'
})

const openSections = reactive({
  personal: true,
  summary: true,
  experience: true,
  education: false,
  skills: false,
  projects: false,
  certifications: false,
  languages: false,
  achievements: false,
})

const cv = reactive({
  title: '',
  templateId: 'tpl_classic',
  personal: { fullName: '', professionalTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '' },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
})

onMounted(async () => {
  // Set template from query param
  if (route.query.template) {
    cv.templateId = route.query.template
  }
  if (route.params.id) {
    try {
      const data = await cvStore.fetchCv(route.params.id)
      Object.assign(cv, {
        title: data.title || '',
        templateId: data.templateId || 'tpl_classic',
        personal: data.personal || cv.personal,
        summary: data.summary || '',
        experiences: data.experiences || [],
        education: data.education || [],
        skills: data.skills || [],
        projects: (data.projects || []).map(p => ({ ...p, techInput: (p.technologies || []).join(', ') })),
        certifications: data.certifications || [],
        languages: data.languages || [],
        achievements: data.achievements || [],
      })
    } catch (err) {
      router.push('/dashboard/cv')
    }
  }
})

function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

function addExperience() {
  cv.experiences.push({
    id: generateId(), company: '', position: '', location: '',
    startDate: '', endDate: '', current: false, description: '', achievements: []
  })
}

function addEducation() {
  cv.education.push({
    id: generateId(), institution: '', degree: '', fieldOfStudy: '',
    startDate: '', endDate: '', gpa: '', description: ''
  })
}

function addProject() {
  cv.projects.push({
    name: '', description: '', role: '', technologies: [],
    url: '', github: '', techInput: ''
  })
}

function addCertification() {
  cv.certifications.push({
    name: '', issuer: '', date: '', credentialId: '', credentialUrl: ''
  })
}

function addAchievement() {
  cv.achievements.push({
    title: '', organization: '', date: '', description: ''
  })
}

function removeItem(field, index) {
  cv[field].splice(index, 1)
  autoSave()
}

function updateProjectTechs(project) {
  project.technologies = project.techInput.split(',').map(t => t.trim()).filter(Boolean)
  autoSave()
}

function autoSave() {
  if (autoSaveTimer.value) clearTimeout(autoSaveTimer.value)
  autoSaveTimer.value = setTimeout(() => {
    if (!isNew.value && route.params.id) {
      handleSave(true)
    }
  }, 2000)
  // Trigger ATS analysis
  runAtsAnalysis()
}

async function runAtsAnalysis() {
  if (atsTimer.value) clearTimeout(atsTimer.value)
  atsTimer.value = setTimeout(async () => {
    try {
      const response = await atsService.analyzeAtsReadiness(cv)
      const data = response.data.data
      atsScore.value = data.score
      atsTips.value = data.tips
      atsBreakdown.value = data.breakdown
    } catch (err) {
      // Silent fail for ATS analysis
    }
  }, 800)
}

async function handleDownloadPdf() {
  if (!route.params.id) {
    alert('Please save the CV first before downloading PDF.')
    return
  }
  generatingPdf.value = true
  try {
    const response = await cvService.downloadPdf(route.params.id)
    const blob = response.data
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `CV-${cv.personal.fullName || 'CV'}.pdf`
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
  } catch (err) {
    console.error('PDF download failed:', err)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    generatingPdf.value = false
  }
}

async function handleSave(silent = false) {
  saving.value = true
  try {
    const data = {
      title: cv.title,
      templateId: cv.templateId,
      personal: cv.personal,
      summary: cv.summary,
      experiences: cv.experiences,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects.map(p => ({
        name: p.name, description: p.description, role: p.role,
        technologies: p.technifications || p.techInput?.split(',').map(t => t.trim()).filter(Boolean) || [],
        url: p.url, github: p.github
      })),
      certifications: cv.certifications,
      languages: cv.languages,
      achievements: cv.achievements,
    }

    if (isNew.value) {
      const created = await cvStore.createCv(data)
      isNew.value = false
      router.replace(`/dashboard/cv/${created.id}/edit`)
    } else {
      await cvStore.updateCv(route.params.id, data)
    }
    if (!silent) {
      // Show brief success (could add toast later)
    }
  } catch (err) {
    console.error('Save failed:', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.field-label {
  @apply block text-xs font-medium text-slate-600 mb-1;
}
</style>
