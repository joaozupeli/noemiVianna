import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { refreshOnAssetsLoad } from './lib/gsap'
import './assets/styles/main.css'

const app = createApp(App).use(router)

/* A primeira navegação do router é assíncrona. Montar antes dela terminar faz
   o <RouterView> nascer vazio, e componentes que procuram as seções no DOM
   (como o header, para marcar o item ativo do menu) não encontram nada. */
router.isReady().then(() => {
  app.mount('#app')
  refreshOnAssetsLoad()
})
