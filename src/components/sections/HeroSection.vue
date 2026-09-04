<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, parallax } from '../../lib/motion'
import { firm } from '../../data/firm'
import { useWhatsApp } from '../../composables/useWhatsApp'

const root = ref(null)
const { getUrl } = useWhatsApp()
let ctx = null

const meta = [
  { label: 'Escritório', value: firm.name },
  { label: 'Praça', value: `${firm.contact.address.city} — ${firm.contact.address.state}` },
  { label: 'Fundado em', value: '1999' },
  { label: 'Registro', value: firm.legal.oab },
]

onMounted(() => {
  if (!root.value) return

  ctx = gsap.context(() => {
    /* Animação de abertura: roda no load, sem depender de scroll. */
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', clearProps: 'transform,opacity' } })

    tl.fromTo(
      '.hero__rule',
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'expo.inOut',
      },
    )
      .fromTo(
        '.hero__meta-item',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.7 },
        0.15,
      )
      .fromTo(
        '.hero__line > span',
        { yPercent: 115 },
        { yPercent: 0, stagger: 0.1, duration: 1.3 },
        0.25,
      )
      .fromTo('.hero__lead', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.7)
      .fromTo(
        '.hero__actions > *',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 },
        0.8,
      )
      .fromTo(
        '.hero__frame',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' },
        0.35,
      )
      .fromTo('.hero__caption', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.1)
      .fromTo('.hero__cue', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.2)

    parallax('.hero__img', { amount: 14, trigger: root.value })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="topo" ref="root" class="hero">
    <span class="rules" aria-hidden="true" />

    <div class="container hero__grid">
      <div class="hero__masthead hero__anim">
        <span class="hero__rule" />
        <ul class="hero__meta">
          <li v-for="item in meta" :key="item.label" class="hero__meta-item">
            <span class="hero__meta-label">{{ item.label }}</span>
            <span class="hero__meta-value">{{ item.value }}</span>
          </li>
        </ul>
        <span class="hero__rule" />
      </div>

      <h1 class="hero__title hero__anim">
        <span class="hero__line mask"><span>Defendendo</span></span>
        <span class="hero__line mask"><span>seus direitos</span></span>
        <span class="hero__line mask"><span>com <em>excelência</em></span></span>
      </h1>

      <div class="hero__aside">
        <p class="hero__lead hero__anim">{{ firm.subtitle }}</p>

        <div class="hero__actions hero__anim">
          <a
            class="btn btn--ink hero__cta"
            :href="getUrl()"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="btn__text">Falar com um advogado</span>
          </a>
          <a class="btn-link" href="#areas">
            Ver áreas de atuação
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <figure class="hero__media hero__anim">
        <div class="hero__frame">
          <img
            class="hero__img"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"
            alt="Imagem representativa do escritório"
            width="1400"
            height="1750"
            fetchpriority="high"
            decoding="async"
          />
          <span class="hero__tint" aria-hidden="true" />
        </div>
        <figcaption class="hero__caption">
          <span class="index">Fig. 01</span>
          <span>{{ firm.contact.address.street }}</span>
        </figcaption>
      </figure>

      <a class="hero__cue" href="#sobre" aria-label="Rolar para a próxima seção">
        <span class="hero__cue-text">Rolar</span>
        <span class="hero__cue-line" aria-hidden="true" />
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-top: calc(var(--header-h) + var(--space-6));
  padding-bottom: var(--space-7);
  background: var(--ink);
  color: var(--on-ink);
  overflow: hidden;
}

.hero .rules {
  --rule-local: var(--rule-on-ink);
}

.hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-6);
}

/* --- Masthead de jornal --- */
.hero__masthead {
  display: grid;
  gap: var(--space-3);
}

.hero__rule {
  display: block;
  height: var(--hairline);
  background: var(--rule-on-ink-strong);
}

.hero__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3) var(--space-5);
}

.hero__meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.hero__meta-label {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
  color: var(--accent-2);
}

.hero__meta-value {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.06em;
  color: var(--on-ink);
}

/* --- Título gigante --- */
.hero__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(2.75rem, 1rem + 8vw, 6.75rem);
  line-height: 0.94;
  letter-spacing: var(--track-display);
}

.hero__line {
  display: block;
}

.hero__line em {
  font-style: italic;
  font-weight: 400;
  color: var(--accent-2);
}

/* --- Texto e ações --- */
.hero__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.hero__lead {
  font-size: var(--fs-base);
  line-height: var(--lh-snug);
  color: var(--on-ink-mute);
  max-width: 34ch;
  padding-top: var(--space-4);
  border-top: var(--hairline) solid var(--rule-on-ink);
}

.hero__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
}

.hero__cta {
  background: transparent;
  border-color: var(--paper);
  color: var(--paper);
  width: 100%;
}

.hero__cta::after {
  background: var(--paper);
}

.hero__cta:hover {
  color: var(--ink);
}

/* --- Imagem --- */
.hero__media {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.hero__frame {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--ink-2);
  border: var(--hairline) solid var(--rule-on-ink);
}

.hero__img {
  width: 100%;
  height: 118%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.08) brightness(0.78);
}

/* Véu oxblood: dá identidade à foto em vez de deixá-la genérica. */
.hero__tint {
  position: absolute;
  inset: 0;
  background: var(--accent);
  mix-blend-mode: color;
  opacity: 0.28;
}

.hero__caption {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.06em;
  color: var(--on-ink-mute);
}

/* --- Indicador de rolagem --- */
.hero__cue {
  display: none;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
  color: var(--on-ink-mute);
  transition: color var(--t-fast);
}

.hero__cue:hover {
  color: var(--on-ink);
}

.hero__cue-line {
  display: block;
  width: 4rem;
  height: var(--hairline);
  background: currentColor;
  animation: cue 2.4s var(--ease-in-out) infinite;
  transform-origin: left center;
}

@keyframes cue {
  0%,
  100% {
    transform: scaleX(0.35);
  }
  50% {
    transform: scaleX(1);
  }
}

@media (min-width: 768px) {
  .hero__meta {
    grid-template-columns: repeat(4, 1fr);
  }

  .hero__actions {
    flex-direction: row;
    align-items: center;
    gap: var(--space-7);
  }

  .hero__cta {
    width: auto;
  }
}

@media (min-width: 1024px) {
  .hero__grid {
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-7) var(--space-5);
    align-items: start;
  }

  .hero__masthead {
    grid-column: 1 / -1;
  }

  .hero__title {
    grid-column: 1 / 9;
    grid-row: 2;
  }

  .hero__aside {
    grid-column: 1 / 7;
    grid-row: 3;
  }

  .hero__media {
    grid-column: 9 / 13;
    grid-row: 2 / 4;
  }

  .hero__frame {
    aspect-ratio: 3 / 4;
  }

  .hero__cue {
    display: flex;
    grid-column: 9 / 13;
    grid-row: 4;
  }
}
</style>
