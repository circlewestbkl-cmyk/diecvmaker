<template>
  <div class="card overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-slate-100 flex items-center justify-between cursor-pointer" @click="expanded = !expanded">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="scoreBg">
          <span class="text-lg font-bold" :class="scoreText">{{ score }}</span>
        </div>
        <div>
          <h3 class="font-semibold text-slate-800 text-sm">ATS Score</h3>
          <p class="text-xs" :class="scoreLabelColor">{{ scoreLabel }}</p>
        </div>
      </div>
      <ChevronDown class="w-4 h-4 text-slate-400 transition-transform" :class="{ 'rotate-180': expanded }" />
    </div>

    <!-- Progress Bar -->
    <div class="px-4 py-2">
      <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700" :class="scoreBarColor" :style="{ width: score + '%' }" />
      </div>
    </div>

    <!-- Tips List -->
    <div v-if="expanded" class="px-4 pb-4 space-y-2">
      <!-- Score Breakdown -->
      <div class="space-y-1.5 mb-3">
        <div v-for="(item, key) in breakdown" :key="key" class="flex items-center justify-between text-xs">
          <span class="text-slate-600 capitalize">{{ formatLabel(key) }}</span>
          <div class="flex items-center gap-2">
            <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full" :class="item.score >= 70 ? 'bg-emerald-500' : item.score >= 40 ? 'bg-amber-500' : 'bg-red-500'" :style="{ width: item.score + '%' }" />
            </div>
            <span class="text-slate-500 w-7 text-right">{{ item.score }}%</span>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div v-if="tips.length" class="space-y-1.5">
        <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">Tips to improve:</p>
        <div v-for="(tip, i) in tips" :key="i" class="flex items-start gap-2 text-xs text-slate-600">
          <AlertCircle class="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
          <span>{{ tip }}</span>
        </div>
      </div>

      <!-- ATS Best Practices -->
      <div v-if="score < 80" class="mt-3 p-3 bg-indigo-50 rounded-xl">
        <p class="text-xs font-semibold text-indigo-700 mb-1">💡 ATS Best Practices</p>
        <ul class="text-[11px] text-indigo-600 space-y-0.5">
          <li>• Use standard section headings (Experience, Education, Skills)</li>
          <li>• Avoid tables, columns, and text boxes</li>
          <li>• Use simple fonts (Arial, Calibri, Times New Roman)</li>
          <li>• Include keywords from the job description</li>
          <li>• Quantify achievements with numbers and percentages</li>
          <li>• Use bullet points for achievements</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  score: { type: Number, default: 0 },
  tips: { type: Array, default: () => [] },
  breakdown: { type: Object, default: () => ({}) }
})

const expanded = ref(true)

const scoreLabel = computed(() => {
  if (props.score >= 80) return 'Excellent - ATS Optimized'
  if (props.score >= 60) return 'Good - Minor improvements needed'
  if (props.score >= 40) return 'Fair - Several improvements needed'
  return 'Needs work - Follow the tips below'
})

const scoreBg = computed(() => {
  if (props.score >= 80) return 'bg-emerald-100'
  if (props.score >= 60) return 'bg-amber-100'
  if (props.score >= 40) return 'bg-orange-100'
  return 'bg-red-100'
})

const scoreText = computed(() => {
  if (props.score >= 80) return 'text-emerald-600'
  if (props.score >= 60) return 'text-amber-600'
  if (props.score >= 40) return 'text-orange-600'
  return 'text-red-600'
})

const scoreLabelColor = computed(() => {
  if (props.score >= 80) return 'text-emerald-600'
  if (props.score >= 60) return 'text-amber-600'
  if (props.score >= 40) return 'text-orange-600'
  return 'text-red-600'
})

const scoreBarColor = computed(() => {
  if (props.score >= 80) return 'bg-emerald-500'
  if (props.score >= 60) return 'bg-amber-500'
  if (props.score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
})

function formatLabel(key) {
  const labels = {
    contact: 'Contact Info',
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    formatting: 'Formatting'
  }
  return labels[key] || key
}
</script>
