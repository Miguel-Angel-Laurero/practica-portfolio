import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)        // ← usa la instancia con el plugin, no createPinia() de nuevo
app.use(router)
app.use(PrimeVue)

app.mount('#app')

// VITE_API_BASE_URL = https://pokeapi.co/api/v2
// VITE_SUPABASE_URL = https://xncspsvecvtrayfwhfcu.supabase.co
// VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuY3Nwc3ZlY3Z0cmF5ZndoZmN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NzM3MzAsImV4cCI6MjA5NjE0OTczMH0.cukh-Mdz6dj-JPLGiVC22RthjJcc8ObAw-N2iMSgQhs