<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { gsap, ScrollTrigger, reveal, maskReveal, drawLine, countUp, marquee } from '../../lib/motion'
import { firm } from '../../data/firm'

const root = ref(null)
const activeValue = ref(0)
const counters = reactive(Object.fromEntries(firm.stats.map((s) => [s.id, 0])))
let ctx = null

const marqueeItems = firm.practiceAreas.map((a) => a.title)

onMounted(() => {
  if (!root.value) return

  ctx = gsap.context(() => {
    maskReveal('.about__title-line > span', { trigger: '.about__chapter' })
    reveal('.about__chapter .label, .about__chapter .index', { y: 16, trigger: '.about__chapter' })
    reveal('.about__prose > *', { y: 28, trigger: '.about__body' })
    reveal('.about__note-card', { y: 36, trigger: '.about__body' })
    drawLine('.about__divider')

    firm.stats.forEach((stat) => {
      countUp('.about__stats', stat.value, (v) => {
        counters[stat.id] = v
      })
    })
    reveal('.stat', { y: 24, stagger: 0.1, trigger: '.about__stats' })

    marquee('.about__marquee-track')

    maskReveal('.values__title > span', { trigger: '.values' })
    reveal('.value__inner', { y: 32, stagger: 0.12, trigger: '.values__list' })

    /* A coluna da esquerda fica fixa com `position: sticky` no CSS, não com o
       pin do ScrollTrigger. Sticky não precisa medir nada, não cria elemento
       espaçador e não quebra quando a altura da página muda. Aqui o
       ScrollTrigger só marca qual valor está em foco. */
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      gsap.utils.toArray('.value').forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (self.isActive) activeValue.value = i
          },
        })
      })
    })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="sobre" ref="root" class="about">
    <div class="section section--flush about__top">
      <span class="rules" aria-hidden="true" />

      <div class="container">
        <header class="chapter about__chapter">
          <div class="chapter__meta">
            <span class="index">01</span>
            <span class="label">Sobre o escritório</span>
          </div>
          <h2 class="chapter__title display about__title">
            <span class="about__title-line mask"><span>Tradição, rigor</span></span>
            <span class="about__title-line mask"><span>e <em>proximidade</em></span></span>
          </h2>
        </header>

        <div class="about__body">
          <div class="about__prose prose">
            <p class="drop-cap">{{ firm.about.history }}</p>
          </div>

          <aside class="about__note-card">
            <span class="stamp">Missão</span>
            <p>{{ firm.about.mission }}</p>
            <p class="about__signature">{{ firm.name }}</p>
          </aside>
        </div>

        <span class="about__divider hairline" />

        <div class="about__stats" aria-label="Números do escritório">
          <div v-for="(stat, i) in firm.stats" :key="stat.id" class="stat">
            <span class="index stat__index">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="stat__value display">
              {{ counters[stat.id] }}<em>{{ stat.suffix }}</em>
            </span>
            <span class="stat__label">{{ stat.label }}</span>
          </div>
        </div>

        <p class="about__disclaimer">
          * Referência interna ilustrativa para demonstração.
        </p>
      </div>
    </div>

    <div class="about__marquee" aria-hidden="true">
      <div class="about__marquee-track">
        <span v-for="n in 2" :key="n" class="about__marquee-set">
          <span v-for="item in marqueeItems" :key="item + n" class="about__marquee-item">
            {{ item }}
            <i>◆</i>
          </span>
        </span>
      </div>
    </div>

    <div class="section section--ink section--flush values">
      <span class="rules" aria-hidden="true" />

      <div class="container values__layout">
        <div class="values__sticky">
          <div class="values__head">
            <span class="label">Nossos valores</span>
            <h2 class="values__title display">
              <span class="mask"><span>O que sustenta</span></span>
              <span class="mask"><span>nossa <em>prática</em></span></span>
            </h2>
            <p class="values__lead">
              Princípios que orientam cada parecer, audiência e atendimento.
            </p>
          </div>

          <div class="values__progress">
            <span class="index">
              {{ String(activeValue + 1).padStart(2, '0') }} / {{ String(firm.values.length).padStart(2, '0') }}
            </span>
            <span class="values__track">
              <span
                class="values__bar"
                :style="{ transform: `scaleX(${(activeValue + 1) / firm.values.length})` }"
              />
            </span>
          </div>
        </div>

        <ul class="values__list">
          <li
            v-for="(value, i) in firm.values"
            :key="value.id"
            class="value"
            :class="{ 'is-active': activeValue === i }"
          >
            <div class="value__inner">
              <span class="value__index display">{{ String(i + 1).padStart(2, '0') }}</span>
              <div class="value__text">
                <h3>{{ value.title }}</h3>
                <p>{{ value.text }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__top {
  background: var(--paper);
}

.about__title {
  font-size: var(--fs-2xl);
}

.about__title em {
  color: var(--accent);
}

.about__body {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.about__prose p {
  font-size: var(--fs-base);
  line-height: var(--lh-normal);
}

.about__note-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--paper-2);
  border-left: 2px solid var(--accent);
}

.about__note-card p {
  font-family: var(--font-display);
  font-size: var(--fs-md);
  line-height: var(--lh-snug);
  color: var(--ink);
}

.about__signature {
  font-family: var(--font-mono) !important;
  font-size: var(--fs-mono) !important;
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
  color: var(--text-mute) !important;
  margin-top: auto;
}

/* --- Números --- */
.about__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-5) var(--space-4) var(--space-5) 0;
  border-bottom: var(--hairline) solid var(--rule);
}

.stat + .stat {
  padding-left: var(--space-4);
  border-left: var(--hairline) solid var(--rule);
}

.stat__index {
  color: var(--accent);
}

.stat__value {
  font-size: clamp(2.5rem, 1rem + 5vw, 4.5rem);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

/* O sufixo sai da Bodoni: o "%" dela é muito estilizado e fica ilegível. */
.stat__value em {
  font-family: var(--font-body);
  font-style: normal;
  font-weight: 500;
  font-size: 0.3em;
  color: var(--accent);
  vertical-align: 0.9em;
  margin-left: 0.08em;
}

.stat__label {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-mute);
}

.about__disclaimer {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  color: var(--text-mute);
  margin-top: var(--space-4);
}

/* --- Faixa corrida --- */
.about__marquee {
  overflow: hidden;
  background: var(--accent);
  color: var(--paper);
  padding-block: var(--space-3);
  border-block: var(--hairline) solid var(--accent);
}

.about__marquee-track {
  display: flex;
  width: max-content;
}

.about__marquee-set {
  display: flex;
}

.about__marquee-item {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding-right: var(--space-5);
  font-family: var(--font-display);
  font-size: var(--fs-md);
  font-style: italic;
  white-space: nowrap;
}

.about__marquee-item i {
  font-style: normal;
  font-size: 0.5rem;
  opacity: 0.6;
}

/* --- Valores --- */
.values__layout {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-7);
}

.values__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.values__title {
  font-size: var(--fs-xl);
}

.values__title em {
  color: var(--accent-2);
}

.values__lead {
  font-size: var(--fs-sm);
  color: var(--on-ink-mute);
  max-width: 32ch;
}

.values__progress {
  display: none;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.values__track {
  flex: 1;
  height: var(--hairline);
  background: var(--rule-on-ink);
}

.values__bar {
  display: block;
  height: 100%;
  background: var(--accent-2);
  transform-origin: left center;
  transition: transform var(--t-slow) var(--ease-out);
}

.values__list {
  display: flex;
  flex-direction: column;
}

.value {
  border-top: var(--hairline) solid var(--rule-on-ink);
}

.value:last-child {
  border-bottom: var(--hairline) solid var(--rule-on-ink);
}

.value__inner {
  display: flex;
  gap: var(--space-4);
  padding-block: var(--space-5);
}

.value__index {
  font-size: var(--fs-md);
  color: var(--accent-2);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  padding-top: 0.2em;
}

.value__text h3 {
  font-size: var(--fs-lg);
  margin-bottom: var(--space-2);
}

.value__text p {
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--on-ink-mute);
  max-width: 46ch;
}

@media (min-width: 768px) {
  .about__body {
    grid-template-columns: 1.35fr 1fr;
    gap: var(--space-7);
    align-items: start;
  }

  .about__stats {
    grid-template-columns: repeat(4, 1fr);
    border-top: var(--hairline) solid var(--rule);
  }

  .stat {
    border-bottom: 0;
  }
}

@media (min-width: 1024px) {
  .values {
    padding-block: var(--space-9);
  }

  .values__layout {
    grid-template-columns: minmax(18rem, 1fr) 1.25fr;
    gap: var(--space-8);
    align-items: start;
  }

  .values__sticky {
    position: sticky;
    top: calc(var(--header-h) + var(--space-6));
    padding-top: var(--space-2);
  }

  .values__progress {
    display: flex;
  }

  /* Cada valor ocupa boa parte da tela: dá percurso de rolagem para a coluna
     fixa acompanhar e faz um item receber atenção por vez. */
  .value {
    display: flex;
    align-items: center;
    min-height: 34vh;
    /* A opacidade fica no <li>, e o GSAP anima o filho .value__inner.
       Assim CSS e GSAP nunca disputam a mesma propriedade no mesmo elemento. */
    opacity: 0.4;
    transition: opacity var(--t-slow) var(--ease-out);
  }

  .value.is-active {
    opacity: 1;
  }

  .value__inner {
    padding-block: var(--space-6);
  }

  .value__index {
    font-size: var(--fs-lg);
  }
}
</style>
