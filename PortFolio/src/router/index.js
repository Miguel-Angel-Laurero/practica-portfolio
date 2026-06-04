import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CombatView from '@/views/CombatView.vue'
import TeamSelectionView from '@/views/TeamSelectionView.vue'
import EventView from '@/views/EventView.vue'
import ChoosePokemonView from '@/views/ChoosePokemonView.vue'
import TrainView from '@/views/TrainView.vue'
import TeamManagerView from '@/views/TeamManagerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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

export default router
