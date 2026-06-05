import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import CombatView from '@/views/CombatView.vue'
import TeamSelectionView from '@/views/TeamSelectionView.vue'
import EventView from '@/views/EventView.vue'
import ChoosePokemonView from '@/views/ChoosePokemonView.vue'
import TrainView from '@/views/TrainView.vue'
import TeamManagerView from '@/views/TeamManagerView.vue'
import { supabase } from '@/lib/supabase'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/combat',
      name: 'combat',
      component: CombatView,
    },
    {
      path: '/teamSelection',
      name: 'teamSelection',
      component: TeamSelectionView,
    },
    {
      path: '/event',
      name: 'event',
      component: EventView,
    },
    {
      path: '/choose-pokemon',
      name: 'choose-pokemon',
      component: ChoosePokemonView
    },
    {
      path: '/train',
      name: 'train',
      component: TrainView
    },
    {
      path: '/teamView',
      name: 'teamView',
      component: TeamManagerView
    }
  ],
})
router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session && to.name !== 'login') {
    return { name: 'login' }
  }
  if (session && to.name === 'login') {
    return { name: 'home' }
  }
})

export default router
