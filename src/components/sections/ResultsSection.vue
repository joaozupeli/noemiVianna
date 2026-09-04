<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { gsap, reveal, maskReveal } from '../../lib/motion'
import { firm } from '../../data/firm'

const root = ref(null)
const index = ref(0)
const paused = ref(false)
let timer = null
let ctx = null

const items = firm.testimonials
const total = computed(() => String(items.length).padStart(2, '0'))
const current = computed(() => String(index.value + 1).padStart(2, '0'))

function goTo(i) {
  index.value = (i + items.length) % items.length
}

function next() {
  goTo(index.value + 1)
}

function prev() {
  goTo(index.value - 1)
}

function startAutoplay() {
  stopAutoplay()
  timer = window.setInterval(() => {
    if (!paused.value) next()
  }, 6500)
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startAutoplay()
  if (!root.value) return

  ctx = gsap.context(() => {
    maskReveal('.results__title-line > span', { trigger: '.results__chapter' })
    reveal('.results__chapter .label, .results__chapter .index, .results__chapter .chapter__lead', {
      y: 16,
      trigger: '.results__chapter',
    })
    reveal('.results__stage', { y: 40, trigger: '.results__stage' })
    reveal('.results__nav', { y: 20, trigger: '.results__stage' })
  }, root.value)
})

onUnmounted(() => {
  stopAutoplay()
  ctx?.revert()
})
</script>

<template>
  <section id="resultados" ref="root" class="section section--ink results">
    <span class="rules" aria-hidden="true" />

    <div class="container">
      <header class="chapter results__chapter">
        <div class="chapter__meta">
          <span class="index">04</span>
          <span class="label">Resultados e confiança</span>
        </div>
        <h2 class="chapter__title display results__title">
          <span class="results__title-line mask"><span>O que nossos</span></span>
          <span class="results__title-line mask"><span>clientes <em>dizem</em></span></span>
        </h2>
        <p class="chapter__lead">
          Depoimentos anonimizados e destaques de casos — resultados não garantem
          o mesmo desfecho em situações semelhantes.
        </p>
      </header>

      <div
        class="results__spread"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
        @touchstart.passive="paused = true"
        @touchend.passive="paused = false"
      >
        <Transition name="numeral" mode="out-in">
          <span :key="current" class="results__numeral display" aria-hidden="true">
            {{ current }}
          </span>
        </Transition>

        <div class="results__stage">
          <article
            v-for="(item, i) in items"
            :key="item.id"
            class="quote"
            :class="{ 'is-active': i === index }"
            :aria-hidden="i !== index"
          >
            <blockquote class="quote__text display">{{ item.quote }}</blockquote>
            <footer class="quote__foot">
              <cite class="quote__author">{{ item.author }}</cite>
              <span class="stamp">{{ item.result }}</span>
            </footer>
          </article>
        </div>

        <div class="results__nav">
          <span class="results__counter index">{{ current }} / {{ total }}</span>

          <div class="results__segments" role="tablist" aria-label="Depoimentos">
            <button
              v-for="(item, i) in items"
              :key="item.id"
              type="button"
              class="results__segment"
              :class="{ 'is-active': i === index }"
              :aria-label="`Depoimento ${i + 1}`"
              :aria-selected="i === index"
              role="tab"
              @click="goTo(i)"
            />
          </div>

          <div class="results__arrows">
            <button type="button" class="results__arrow" aria-label="Anterior" @click="prev">
              ←
            </button>
            <button type="button" class="results__arrow" aria-label="Próximo" @click="next">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.results__title {
  font-size: var(--fs-2xl);
}

.results__title em {
  color: var(--accent-2);
}

.results__spread {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-4);
}

.results__numeral {
  font-size: clamp(4rem, 12vw, 9rem);
  line-height: 0.8;
  font-variant-numeric: tabular-nums;
  color: var(--accent-2);
  opacity: 0.75;
}

.numeral-enter-active,
.numeral-leave-active {
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}

.numeral-enter-from {
  opacity: 0;
  transform: translateY(0.3em);
}

.numeral-leave-to {
  opacity: 0;
  transform: translateY(-0.3em);
}

.results__stage {
  position: relative;
  min-height: 20rem;
}

.quote {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  opacity: 0;
  transform: translateY(1rem);
  pointer-events: none;
  /* Curto de propósito: texto grande em cross-fade longo fica ilegível,
     porque as duas citações aparecem sobrepostas ao mesmo tempo. */
  transition: opacity 380ms var(--ease-out), transform 380ms var(--ease-out);
}

.quote.is-active {
  position: relative;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.quote__text {
  font-size: clamp(1.5rem, 1rem + 2.4vw, 3rem);
  font-weight: 400;
  line-height: 1.12;
  color: var(--on-ink);
  max-width: 30ch;
}

.quote__foot {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  margin-top: auto;
}

.quote__author {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  font-style: normal;
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
  color: var(--on-ink-mute);
}

/* --- Navegação --- */
.results__nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-top: var(--space-5);
  border-top: var(--hairline) solid var(--rule-on-ink);
}

.results__counter {
  color: var(--on-ink);
  flex-shrink: 0;
}

.results__segments {
  display: flex;
  gap: var(--space-2);
  flex: 1;
}

.results__segment {
  flex: 1;
  height: 2px;
  background: var(--rule-on-ink-strong);
  transition: background-color var(--t-mid);
}

.results__segment:hover {
  background: var(--on-ink-mute);
}

.results__segment.is-active {
  background: var(--accent-2);
}

.results__arrows {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.results__arrow {
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  border: var(--hairline) solid var(--rule-on-ink-strong);
  color: var(--on-ink);
  font-size: var(--fs-sm);
  transition: background-color var(--t-fast), color var(--t-fast),
    border-color var(--t-fast);
}

.results__arrow:hover {
  background: var(--paper);
  border-color: var(--paper);
  color: var(--ink);
}

@media (min-width: 1024px) {
  .results__spread {
    grid-template-columns: auto 1fr;
    gap: var(--space-5) var(--space-6);
    align-items: start;
  }

  .results__numeral {
    grid-column: 1;
    grid-row: 1;
  }

  .results__stage {
    grid-column: 2;
    grid-row: 1;
    min-height: 24rem;
  }

  .results__nav {
    grid-column: 2;
    grid-row: 2;
  }
}
</style>
