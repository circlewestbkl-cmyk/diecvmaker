<template>
  <div class="min-h-screen bg-slate-950 text-white overflow-hidden">
    <!-- Animated background -->
    <div class="fixed inset-0 z-0">
      <div class="absolute top-[-50%] left-[-20%] w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div class="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slow animation-delay-2000" />
      <div class="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[128px] animate-pulse-slow animation-delay-4000" />
    </div>

    <!-- Nav -->
    <nav class="fixed top-0 left-0 right-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FileText class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">CVForge</span>
          </div>
          <div class="flex items-center gap-3">
            <router-link to="/login" class="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</router-link>
            <router-link to="/register" class="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105">
              Get Started ✨
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative z-10 pt-40 pb-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-indigo-300 mb-8 animate-fade-in-up">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          AI-Powered & Free Forever
        </div>

        <!-- Heading -->
        <h1 class="text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-8 animate-fade-in-up animation-delay-200">
          <span class="block bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">
            Build CVs
          </span>
          <span class="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
            That Get Hired
          </span>
          <span class="block text-4xl sm:text-5xl lg:text-6xl mt-4 animate-bounce-in animation-delay-600">
            <span class="inline-block">🚀</span>
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-400">
          Stop sending boring CVs. Create
          <span class="text-indigo-400 font-semibold">stunning</span>,
          <span class="text-purple-400 font-semibold">ATS-friendly</span> resumes with AI —
          then track every application in one place.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <router-link
            to="/register"
            class="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105"
          >
            <span class="relative z-10 flex items-center gap-2">
              Start Building Free
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </router-link>
          <a
            href="#features"
            class="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300"
          >
            See What's Inside 👀
          </a>
        </div>

        <!-- Stats -->
        <div class="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up animation-delay-800">
          <div>
            <p class="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">10K+</p>
            <p class="text-sm text-slate-500 mt-1">CVs Created</p>
          </div>
          <div>
            <p class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">50+</p>
            <p class="text-sm text-slate-500 mt-1">Templates</p>
          </div>
          <div>
            <p class="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">95%</p>
            <p class="text-sm text-slate-500 mt-1">ATS Pass Rate</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-purple-300 mb-6">
            ✨ Everything You Need
          </div>
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span class="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">One App.</span>
            <br />
            <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Zero Excuses.</span>
          </h2>
        </div>

        <!-- Feature Cards -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(feature, i) in features"
            :key="feature.title"
            class="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <!-- Glow effect -->
            <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              :class="feature.glow" />

            <div class="relative z-10">
              <!-- Icon -->
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl"
                :class="feature.iconBg">
                {{ feature.emoji }}
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-white mb-3 flex items-center gap-2">
                {{ feature.title }}
                <span v-if="feature.badge" class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="feature.badgeClass">
                  {{ feature.badge }}
                </span>
              </h3>

              <!-- Description -->
              <p class="text-slate-400 leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-cyan-300 mb-6">
            ⚡ Super Simple
          </div>
          <h2 class="text-4xl sm:text-5xl font-extrabold">
            <span class="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">3 Steps.</span>
            <span class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Done.</span>
          </h2>
        </div>

        <div class="grid sm:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="i" class="text-center group">
            <div class="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center text-4xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500"
              :class="step.shadow">
              {{ step.emoji }}
            </div>
            <div class="text-sm font-bold text-indigo-400 mb-2">STEP {{ i + 1 }}</div>
            <h3 class="text-xl font-bold text-white mb-2">{{ step.title }}</h3>
            <p class="text-slate-400 text-sm">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial / Social Proof -->
    <section class="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-amber-300 mb-6">
            💬 What People Say
          </div>
          <h2 class="text-4xl sm:text-5xl font-extrabold">
            <span class="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Loved by</span>
            <span class="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Job Seekers</span>
          </h2>
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
          <div v-for="testimonial in testimonials" :key="testimonial.name"
            class="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div class="flex items-center gap-1 mb-4">
              <span v-for="s in 5" :key="s" class="text-amber-400">★</span>
            </div>
            <p class="text-slate-300 mb-4 leading-relaxed">"{{ testimonial.text }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                :class="testimonial.avatarBg">
                {{ testimonial.initials }}
              </div>
              <div>
                <p class="text-sm font-semibold text-white">{{ testimonial.name }}</p>
                <p class="text-xs text-slate-500">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="relative p-12 sm:p-16 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-center overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
          <div class="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl translate-x-1/3 translate-y-1/3" />

          <div class="relative z-10">
            <p class="text-5xl mb-6">🎯</p>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Your Dream Job<br />Is One CV Away
            </h2>
            <p class="text-lg text-white/70 mb-10 max-w-xl mx-auto">
              Join 10,000+ job seekers who upgraded their CVs with AI. It's free. No credit card needed. Seriously.
            </p>
            <router-link
              to="/register"
              class="inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-600 font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-black/30 transition-all duration-500 hover:scale-105"
            >
              Let's Go! 🚀
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-white">CVForge</span>
        </div>
        <p class="text-sm text-slate-500">© 2026 CVForge. Made with 💜 for job seekers.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { FileText, ArrowRight } from 'lucide-vue-next'

const features = [
  {
    title: 'CV Builder',
    emoji: '🎨',
    desc: 'Drag-and-drop editor with live preview. Make your CV look fire without any design skills.',
    iconBg: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
    glow: 'shadow-[0_0_60px_rgba(99,102,241,0.15)]',
    badge: null,
    badgeClass: ''
  },
  {
    title: 'ATS Checker',
    emoji: '🔍',
    desc: 'See if your CV passes Applicant Tracking Systems before you hit send. Get your score instantly.',
    iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.15)]',
    badge: 'AI',
    badgeClass: 'bg-emerald-500/20 text-emerald-400'
  },
  {
    title: 'Job Matcher',
    emoji: '🎯',
    desc: 'AI compares your CV to any job description and tells you exactly what to improve.',
    iconBg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.15)]',
    badge: 'AI',
    badgeClass: 'bg-amber-500/20 text-amber-400'
  },
  {
    title: 'Job Portal',
    emoji: '💼',
    desc: 'Browse real job listings and apply directly. No more jumping between 10 tabs.',
    iconBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    glow: 'shadow-[0_0_60px_rgba(59,130,246,0.15)]',
    badge: null,
    badgeClass: ''
  },
  {
    title: 'Application Tracker',
    emoji: '📊',
    desc: 'Track every application from applied → interview → offer. Never lose track again.',
    iconBg: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    glow: 'shadow-[0_0_60px_rgba(168,85,247,0.15)]',
    badge: null,
    badgeClass: ''
  },
  {
    title: 'Interview Prep',
    emoji: '🎤',
    desc: 'AI generates questions for your role, then scores your answers. Practice makes perfect.',
    iconBg: 'bg-gradient-to-br from-rose-500/20 to-red-500/20',
    glow: 'shadow-[0_0_60px_rgba(244,63,94,0.15)]',
    badge: 'AI',
    badgeClass: 'bg-rose-500/20 text-rose-400'
  },
]

const steps = [
  {
    emoji: '✍️',
    title: 'Build Your CV',
    desc: 'Use our AI-powered editor to create a stunning CV in minutes.',
    shadow: 'hover:shadow-indigo-500/20'
  },
  {
    emoji: '🔬',
    title: 'Analyze & Optimize',
    desc: 'Run it through ATS checker and job matcher to maximize your score.',
    shadow: 'hover:shadow-purple-500/20'
  },
  {
    emoji: '🎯',
    title: 'Apply & Track',
    desc: 'Apply to jobs and track your progress all the way to offer.',
    shadow: 'hover:shadow-pink-500/20'
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'Frontend Developer at Google',
    text: 'CVForge helped me tailor my CV for each application. Got 3 interviews in the first week!',
    avatarBg: 'bg-gradient-to-br from-indigo-500 to-purple-600'
  },
  {
    name: 'Ahmad Rizky',
    initials: 'AR',
    role: 'Full Stack Developer at Shopee',
    text: 'The ATS checker was a game changer. My CV was getting rejected by bots — now it passes every time.',
    avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600'
  },
  {
    name: 'Digo A.',
    initials: 'DA',
    role: 'Senior Developer at Google',
    text: 'I love the job matcher. It literally tells you what keywords to add. So smart!',
    avatarBg: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    name: 'Maria Santos',
    initials: 'MS',
    role: 'UI/UX Designer at Grab',
    text: 'The templates are gorgeous and the live preview is chef\'s kiss. Best CV tool ever.',
    avatarBg: 'bg-gradient-to-br from-pink-500 to-rose-600'
  },
]
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 200ms;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 400ms;
  opacity: 0;
}

.animation-delay-600 {
  animation-delay: 600ms;
  opacity: 0;
}

.animation-delay-800 {
  animation-delay: 800ms;
  opacity: 0;
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
