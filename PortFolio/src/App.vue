
<template>
  <header>
    <div class="wrapper">
      <nav>
      </nav>
    </div>
  </header>
  <main>
      <RouterView></RouterView>
  </main>
</template>
<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      router.push({ name: 'home' })
    }
  })
})
</script>

