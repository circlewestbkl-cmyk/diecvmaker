<template>
  <div class="card overflow-hidden">
    <button
      @click="$emit('toggle')"
      class="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
    >
      <div class="flex items-center gap-3">
        <component :is="iconMap[icon]" class="w-5 h-5 text-indigo-600" />
        <span class="font-semibold text-slate-800">{{ title }}</span>
      </div>
      <ChevronDown
        class="w-5 h-5 text-slate-400 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      />
    </button>
    <div v-show="open" class="px-5 pb-5">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ChevronDown, User, AlignLeft, Briefcase, GraduationCap, Zap, FolderGit, Award, Languages, Trophy } from 'lucide-vue-next'

defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'User' },
  open: { type: Boolean, default: false }
})

defineEmits(['toggle'])

const iconMap = {
  User, AlignLeft, Briefcase, GraduationCap, Zap,
  FolderGit, Award, Languages, Trophy
}
</script>
