<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, ScrollTrigger, reveal, maskReveal } from '../../lib/motion'
import { firm } from '../../data/firm'
import IconSymbol from '../shared/IconSymbol.vue'

const root = ref(null)
const expanded = ref(null)
let ctx = null

function toggle(id) {
  expanded.value = expanded.value === id ? null : id

  /* Abrir uma linha muda a altura da página. Sem recalcular, todos os
     gatilhos abaixo desta seção ficam apontando para a posição antiga. */
  window.setTimeout(() => ScrollTrigger.refresh(), 500)
}

onMounted(() => {
  if (!root.value) return

  ctx = gsap.context(() => {
    maskReveal('.areas__title-line > span', { trigger: '.areas__chapter' })
    reveal('.areas__chapter .label, .areas__chapter .index, .areas__chapter .chapter__lead', {
      y: 16,
      trigger: '.areas__chapter',
    })
    reveal('.area__row', { y: 40, stagger: 0.09, trigger: '.areas__list' })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="areas" ref="root" class="section areas">
    <span class="rules" aria-hidden="true" />

    <div class="container">
      <header class="chapter areas__chapter">
        <div class="chapter__meta">
          <span class="index">02</span>
          <span class="label">Áreas de atuação</span>
        </div>
        <h2 class="chapter__title display areas__title">
          <span class="areas__title-line mask"><span>Expertise</span></span>
          <span class="areas__title-line mask"><span><em>multidisciplinar</em></span></span>
        </h2>
        <p class="chapter__lead">
          Atuação integrada para pessoas físicas e jurídicas, com foco em
          estratégia e resultado.
        </p>
      </header>

      <ul class="areas__list">
        <li
          v-for="(area, i) in firm.practiceAreas"
          :key="area.id"
          class="area"
          :class="{ 'is-open': expanded === area.id }"
        >
          <button
            type="button"
            class="area__row"
            :aria-expanded="expanded === area.id"
            :aria-controls="`area-panel-${area.id}`"
            @click="toggle(area.id)"
          >
            <span class="index area__index">{{ String(i + 1).padStart(2, '0') }}</span>

            <span class="area__title display">{{ area.title }}</span>

            <span class="area__short">{{ area.short }}</span>

            <span class="area__mark" aria-hidden="true">
              <IconSymbol :name="area.icon" :size="22" />
            </span>

            <span class="area__toggle" aria-hidden="true">
              {{ expanded === area.id ? '−' : '+' }}
            </span>
          </button>

          <div :id="`area-panel-${area.id}`" class="area__panel">
            <div class="area__panel-inner">
              <p>{{ area.full }}</p>
              <a class="btn-link" href="#contato">
                Falar sobre {{ area.title.toLowerCase() }}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.areas {
  background: var(--paper);
}

.areas__title {
  font-size: var(--fs-2xl);
}

.areas__title em {
  color: var(--accent);
}

.areas__list {
  position: relative;
  z-index: 1;
  border-top: var(--hairline) solid var(--rule-strong);
}

.area {
  border-bottom: var(--hairline) solid var(--rule);
}

.area__row {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: var(--space-3) var(--space-4);
  padding-block: var(--space-5);
  text-align: left;
  transition: background-color var(--t-mid) var(--ease-out);
}

.area__row::before {
  content: '';
  position: absolute;
  inset: 0 calc(var(--pad) * -0.5);
  z-index: -1;
  background: var(--paper-2);
  opacity: 0;
  transition: opacity var(--t-mid) var(--ease-out);
}

.area__row:hover::before {
  opacity: 1;
}

.area__index {
  color: var(--accent);
  padding-top: 0.55em;
}

.area__title {
  font-size: var(--fs-lg);
  color: var(--ink);
  transition: transform var(--t-mid) var(--ease-out);
}

.area__row:hover .area__title {
  transform: translateX(0.4rem);
}

.area__short {
  grid-column: 2;
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--text-mute);
  max-width: 44ch;
}

.area__mark {
  display: none;
  color: var(--accent);
  opacity: 0;
  transform: translateX(-0.75rem);
  transition: opacity var(--t-mid) var(--ease-out),
    transform var(--t-mid) var(--ease-out);
}

.area__row:hover .area__mark {
  opacity: 1;
  transform: translateX(0);
}

.area__toggle {
  grid-column: 3;
  grid-row: 1;
  font-family: var(--font-mono);
  font-size: var(--fs-md);
  line-height: 1;
  color: var(--ink);
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border: var(--hairline) solid var(--rule-strong);
  transition: background-color var(--t-fast), color var(--t-fast),
    border-color var(--t-fast);
}

.area__row:hover .area__toggle {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}

/* Painel que abre: 0fr -> 1fr anima a altura sem precisar medir nada em JS. */
.area__panel {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows var(--t-mid) var(--ease-in-out);
}

.area.is-open .area__panel {
  grid-template-rows: 1fr;
}

.area__panel-inner {
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  padding-bottom: var(--space-6);
  opacity: 0;
  transition: opacity var(--t-mid) var(--ease-out);
}

.area.is-open .area__panel-inner {
  opacity: 1;
}

.area__panel-inner p {
  font-size: var(--fs-base);
  line-height: var(--lh-normal);
  color: var(--text-mute);
  max-width: 68ch;
}

@media (min-width: 1024px) {
  .area__row {
    grid-template-columns: 3rem minmax(14rem, 1fr) 1.1fr auto auto;
    align-items: center;
    gap: var(--space-5);
    padding-block: var(--space-6);
  }

  .area__short {
    grid-column: 3;
  }

  .area__mark {
    display: block;
    grid-column: 4;
  }

  .area__toggle {
    grid-column: 5;
  }

  .area__index {
    padding-top: 0;
  }

  .area__title {
    font-size: var(--fs-xl);
  }

  .area__panel-inner {
    padding-left: calc(3rem + var(--space-5));
    padding-bottom: var(--space-7);
  }
}
</style>
