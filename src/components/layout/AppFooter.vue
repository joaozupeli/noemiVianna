<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, SCRUB } from '../../lib/motion'
import { firm } from '../../data/firm'

const root = ref(null)
const year = new Date().getFullYear()
let ctx = null

const quickNav = [
  { href: '#sobre', label: 'Sobre', index: '01' },
  { href: '#areas', label: 'Áreas de atuação', index: '02' },
  { href: '#equipe', label: 'Equipe', index: '03' },
  { href: '#resultados', label: 'Resultados', index: '04' },
  { href: '#contato', label: 'Contato', index: '05' },
]

onMounted(() => {
  if (!root.value) return

  ctx = gsap.context(() => {
    gsap.fromTo(
      '.foot__wordmark',
      { xPercent: -3 },
      {
        xPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: root.value,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      },
    )
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <footer ref="root" class="foot">
    <span class="rules" aria-hidden="true" />

    <div class="container foot__grid">
      <div class="foot__brand">
        <span class="brand-mark" aria-hidden="true">M<span>&amp;</span>A</span>
        <p class="foot__tagline display">{{ firm.tagline }}</p>
        <p class="foot__registry index">
          {{ firm.legal.oab }} · CNPJ {{ firm.legal.cnpj }}
        </p>
        <div class="foot__social">
          <a :href="firm.social.linkedin" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a :href="firm.social.instagram" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>

      <nav class="foot__col" aria-label="Navegação do rodapé">
        <h3 class="label label--mute">Navegação</h3>
        <ul class="foot__links">
          <li v-for="link in quickNav" :key="link.href">
            <a :href="link.href">
              <span class="index">{{ link.index }}</span>
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="foot__col">
        <h3 class="label label--mute">Contato</h3>
        <ul class="foot__contact">
          <li>{{ firm.contact.address.street }}</li>
          <li>
            {{ firm.contact.address.neighborhood }} —
            {{ firm.contact.address.city }}/{{ firm.contact.address.state }}
          </li>
          <li>
            <a :href="`tel:${firm.contact.phone.replace(/\D/g, '')}`">
              {{ firm.contact.phone }}
            </a>
          </li>
          <li>
            <a :href="`mailto:${firm.contact.email}`">{{ firm.contact.email }}</a>
          </li>
        </ul>

        <a href="#topo" class="foot__top">
          Voltar ao topo
          <span aria-hidden="true">↑</span>
        </a>
      </div>
    </div>

    <div class="foot__mark" aria-hidden="true">
      <span class="foot__wordmark display">{{ firm.name }}</span>
    </div>

    <div class="container foot__bottom">
      <p class="foot__disclaimer">{{ firm.legal.disclaimer }}</p>
      <div class="foot__credits">
        <span>© {{ year }} {{ firm.name }}</span>
        <span>Site demonstrativo · Protótipo</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  position: relative;
  background: var(--ink);
  color: var(--on-ink);
  padding-top: var(--space-8);
  overflow: hidden;
}

.foot .rules {
  --rule-local: var(--rule-on-ink);
}

.foot__grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-7);
  padding-bottom: var(--space-8);
}

/* --- Marca --- */
.brand-mark {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: var(--hairline) solid var(--rule-on-ink-strong);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
}

.brand-mark span {
  color: var(--accent-2);
}

.foot__tagline {
  font-size: var(--fs-lg);
  max-width: 20ch;
  margin-top: var(--space-4);
}

.foot__registry {
  margin-top: var(--space-3);
}

.foot__social {
  display: flex;
  gap: var(--space-5);
  margin-top: var(--space-5);
}

.foot__social a {
  position: relative;
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
  color: var(--on-ink);
  padding-bottom: 0.25rem;
  border-bottom: var(--hairline) solid var(--rule-on-ink-strong);
  transition: color var(--t-fast), border-color var(--t-fast);
}

.foot__social a:hover {
  color: var(--accent-2);
  border-bottom-color: var(--accent-2);
}

/* --- Colunas --- */
.foot__col h3 {
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-4);
  border-bottom: var(--hairline) solid var(--rule-on-ink);
}

.foot__links,
.foot__contact {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  font-size: var(--fs-sm);
  color: var(--on-ink-mute);
}

.foot__links a {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  transition: color var(--t-fast);
}

.foot__links a:hover,
.foot__contact a:hover {
  color: var(--accent-2);
}

.foot__top {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
  color: var(--on-ink);
  transition: color var(--t-fast);
}

.foot__top:hover {
  color: var(--accent-2);
}

/* --- Assinatura gigante: sangra nas laterais como capa de revista. --- */
.foot__mark {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-top: var(--hairline) solid var(--rule-on-ink);
  padding-top: var(--space-6);
}

.foot__wordmark {
  display: block;
  width: max-content;
  margin-inline: auto;
  font-size: var(--fs-giant);
  line-height: 0.78;
  white-space: nowrap;
  color: var(--on-ink);
  opacity: 0.14;
  user-select: none;
}

/* --- Base --- */
.foot__bottom {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-5);
  padding-bottom: var(--space-6);
  border-top: var(--hairline) solid var(--rule-on-ink);
}

.foot__disclaimer {
  font-size: var(--fs-xs);
  line-height: 1.6;
  max-width: 78ch;
  color: var(--on-ink-mute);
}

.foot__credits {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--on-ink-mute);
}

@media (min-width: 768px) {
  .foot__grid {
    grid-template-columns: 1.5fr 1fr 1.2fr;
    gap: var(--space-6);
  }

  .foot__credits {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
