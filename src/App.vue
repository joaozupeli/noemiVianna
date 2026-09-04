<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import { bindSmoothScroll, unbindSmoothScroll } from './lib/smoothScroll'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import WhatsAppFloat from './components/layout/WhatsAppFloat.vue'

let lenis = null
let tickerFn = null

onMounted(() => {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  tickerFn = (time) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  bindSmoothScroll(lenis)
})

onUnmounted(() => {
  unbindSmoothScroll()
  if (tickerFn) gsap.ticker.remove(tickerFn)
  lenis?.destroy()
  lenis = null
  tickerFn = null
})
</script>

<template>
  <a class="skip" href="#main">Ir para o conteúdo</a>
  <AppHeader />
  <main id="main">
    <RouterView />
  </main>
  <AppFooter />
  <WhatsAppFloat />
</template>

<style>
.skip {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  z-index: 500;
  padding: 0.75rem 1rem;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
}

.skip:focus-visible {
  top: var(--space-4);
}

/* Lenis — mesma base do seu exemplo */
html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}
</style>
