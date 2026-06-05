<template>
  <div 
  class="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" 
  :style="{ backgroundImage: `url('img/Tower.png')` }"
>
    <div class="w-full max-w-sm">
      <!-- Logo / título -->
      <div class="text-center mb-8">
        <h1 class="text-6xl font-bold text-slate-100 mb-1 drop-shadow-[0_0_3px_rgba(0,0,0,1)]"">PokeTower</h1>
        <p class="text-md font-bold drop-shadow-[0_0_3px_rgba(0,0,0,1)] text-slate-100">Inicia sesión para continuar</p>
      </div>

      <!-- Card -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4">

        <!-- Tabs login / registro -->
        <div class="flex bg-slate-900 rounded-xl p-1 gap-1">
          <button
            class="flex-1 py-1.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
            :class="mode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'"
            @click="mode = 'login'; error = ''"
          >Entrar</button>
          <button
            class="flex-1 py-1.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
            :class="mode === 'register' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'"
            @click="mode = 'register'; error = ''"
          >Registrarse</button>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="tu@email.com"
            class="bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            @keyup.enter="submit"
          />
        </div>

        <!-- Contraseña -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Contraseña</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors pr-10"
              @keyup.enter="submit"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-xs"
              @click="showPassword = !showPassword"
            >{{ showPassword ? '🙈' : '👁️' }}</button>
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-xs text-red-400 bg-red-950 border border-red-800 rounded-lg px-3 py-2">
          {{ error }}
        </p>

        <!-- Éxito registro -->
        <p v-if="successMsg" class="text-xs text-green-400 bg-green-950 border border-green-800 rounded-lg px-3 py-2">
          {{ successMsg }}
        </p>

        <!-- Botón principal -->
        <button
          class="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          :disabled="loading"
          @click="submit"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else>{{ mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta' }}</span>
        </button>

        <!-- Separador -->
        <div class="flex items-center gap-3">
          <div class="flex-1 h-px bg-slate-700" />
          <span class="text-xs text-slate-500">o continúa con</span>
          <div class="flex-1 h-px bg-slate-700" />
        </div>

        <!-- Google -->
        <button
          class="flex items-center justify-center cursor-pointer gap-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          :disabled="loading"
          @click="loginWithGoogle"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24v9.01h13.192c-.584 3.036-2.32 5.61-4.926 7.342v6.08h7.962c4.66-4.292 7.304-10.62 7.304-17.734z" fill="#4285F4"/>
            <path d="M24 48c6.48 0 11.918-2.148 15.89-5.82l-7.962-6.08c-2.148 1.44-4.896 2.29-7.928 2.29-6.098 0-11.266-4.118-13.108-9.65H2.62v6.27C6.574 42.692 14.738 48 24 48z" fill="#34A853"/>
            <path d="M10.892 28.74A14.44 14.44 0 0 1 9.6 24c0-1.654.284-3.26.792-4.74V12.99H2.62A23.946 23.946 0 0 0 0 24c0 3.87.93 7.528 2.62 10.01l8.272-5.27z" fill="#FBBC05"/>
            <path d="M24 9.61c3.438 0 6.524 1.182 8.952 3.506l6.704-6.704C35.91 2.386 30.472 0 24 0 14.738 0 6.574 5.308 2.62 12.99l8.272 6.27C12.734 13.728 17.902 9.61 24 9.61z" fill="#EA4335"/>
          </svg>
          Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

const mode = ref('login')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

async function submit() {
  error.value = ''
  successMsg.value = ''

  if (!email.value || !password.value) {
    error.value = 'Por favor rellena todos los campos.'
    return
  }

  loading.value = true
  try {
    if (mode.value === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (err) throw err
      router.push({ name: 'home' })
    } else {
      const { error: err } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (err) throw err
      successMsg.value = 'Cuenta creada. Revisa tu email para confirmarla.'
    }
  } catch (err) {
    error.value = friendlyError(err.message)
  } finally {
    loading.value = false
  }
}

async function loginWithGoogle() {
  error.value = ''
  loading.value = true
  try {
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (err) throw err
  } catch (err) {
    error.value = friendlyError(err.message)
    loading.value = false
  }
}

function friendlyError(msg) {
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.'
  if (msg.includes('Email not confirmed')) return 'Confirma tu email antes de entrar.'
  if (msg.includes('User already registered')) return 'Ya existe una cuenta con ese email.'
  if (msg.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.'
  return msg
}
</script>