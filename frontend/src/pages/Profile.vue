<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Profile</h2>
      <p class="text-slate-500 mt-1">Manage your personal information.</p>
    </div>

    <!-- Avatar Section -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Photo</h3>
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
          <img v-if="profileStore.profile.avatar" :src="profileStore.profile.avatar" class="w-full h-full object-cover" />
          <User v-else class="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <label class="btn-secondary cursor-pointer text-sm">
            <Camera class="w-4 h-4 mr-2" />
            Change Photo
            <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
          </label>
          <p class="text-xs text-slate-400 mt-1">JPG, PNG or WebP. Max 5MB.</p>
        </div>
      </div>
    </div>

    <!-- Profile Form -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Personal Information</h3>

      <div v-if="success" class="p-3 bg-green-50 text-green-600 text-sm rounded-xl mb-4">
        Profile updated successfully!
      </div>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input v-model="form.fullName" class="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Professional Title</label>
            <input v-model="form.professionalTitle" class="input-field" placeholder="Full Stack Developer" />
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
            <input v-model="form.phone" class="input-field" placeholder="+62812345678" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <input v-model="form.location" class="input-field" placeholder="Jakarta, Indonesia" />
          </div>
        </div>

        <div class="grid sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
            <input v-model="form.website" class="input-field" placeholder="https://example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn</label>
            <input v-model="form.linkedin" class="input-field" placeholder="LinkedIn URL" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">GitHub</label>
            <input v-model="form.github" class="input-field" placeholder="GitHub URL" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
          <textarea v-model="form.bio" class="input-field" rows="3" placeholder="Tell us about yourself..." />
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn-primary" :disabled="profileStore.loading">
            <Loader2 v-if="profileStore.loading" class="w-4 h-4 animate-spin mr-2" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profileStore'
import { User, Camera, Loader2 } from 'lucide-vue-next'

const profileStore = useProfileStore()
const success = ref(false)

const form = reactive({
  fullName: '',
  professionalTitle: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  bio: ''
})

onMounted(async () => {
  await profileStore.fetchProfile()
  Object.assign(form, {
    fullName: profileStore.profile.fullName || '',
    professionalTitle: profileStore.profile.professionalTitle || '',
    phone: profileStore.profile.phone || '',
    location: profileStore.profile.location || '',
    website: profileStore.profile.website || '',
    linkedin: profileStore.profile.linkedin || '',
    github: profileStore.profile.github || '',
    bio: profileStore.profile.bio || ''
  })
})

async function handleSave() {
  try {
    await profileStore.updateProfile(form)
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } catch (err) {
    // Error handled in store
  }
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (file) {
    try {
      await profileStore.uploadAvatar(file)
    } catch (err) {
      // Error handled in store
    }
  }
}
</script>
