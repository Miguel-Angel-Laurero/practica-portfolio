import { defineStore } from 'pinia'

export const useActionMenuStore = defineStore('actionMenu', {
  state: () => ({
    currentMenu: 'main',
  }),
  actions: {
    openMenu(menuName) {
      this.currentMenu = menuName
    },
    backToMain() {
      this.currentMenu = 'main'
    },
  },
})
