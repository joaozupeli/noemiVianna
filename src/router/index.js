import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
  /* Sem `behavior: 'smooth'` aqui: a rolagem suave é do Lenis, e as duas
     tentando animar o mesmo scroll ao mesmo tempo se anulam. Cliques em
     âncoras passam por src/lib/smoothScroll.js. */
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, top: 100 }
    return { top: 0 }
  },
})

export default router
