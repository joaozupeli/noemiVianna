<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { gsap } from '../../lib/motion'
import { setScrollLocked } from '../../lib/smoothScroll'
import { useWhatsApp } from '../../composables/useWhatsApp'

const props = defineProps({
  member: { type: Object, default: null },
})

const emit = defineEmits(['close'])
const { getUrl } = useWhatsApp()
const closeRef = ref(null)

function firstName(name) {
  return name.replace(/^(Dr\.|Dra\.)\s+/i, '').split(' ')[0]
}

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.member,
  async (member) => {
    setScrollLocked(Boolean(member))
    if (!member) return

    await nextTick()
    closeRef.value?.focus()

    gsap
      .timeline()
      .fromTo('.dossier__backdrop', { opacity: 0 }, { opacity: 1, duration: 0.35 })
      .fromTo(
        '.dossier__sheet',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' },
        0,
      )
      .fromTo(
        '.dossier__reveal',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.6, clearProps: 'transform,opacity' },
        0.25,
      )
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  setScrollLocked(false)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="member"
      class="dossier"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`dossier-title-${member.id}`"
    >
      <div class="dossier__backdrop" @click="emit('close')" />

      <div class="dossier__sheet">
        <div class="dossier__bar">
          <span class="label label--mute">Perfil profissional</span>
          <button
            ref="closeRef"
            type="button"
            class="dossier__close"
            @click="emit('close')"
          >
            Fechar
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div class="dossier__grid">
          <figure class="dossier__photo dossier__reveal">
            <img :src="member.photo" :alt="member.photoAlt" width="480" height="600" />
          </figure>

          <div class="dossier__content">
            <div class="dossier__reveal">
              <span class="label">{{ member.role }}</span>
              <h2 :id="`dossier-title-${member.id}`" class="dossier__name display">
                {{ member.name }}
              </h2>
              <p class="dossier__oab index">{{ member.oab || 'Equipe de apoio' }}</p>
            </div>

            <p class="dossier__bio dossier__reveal">{{ member.bio }}</p>

            <dl class="dossier__specs">
              <div class="dossier__spec dossier__reveal">
                <dt class="label label--mute">Formação</dt>
                <dd>{{ member.formation }}</dd>
              </div>

              <div class="dossier__spec dossier__reveal">
                <dt class="label label--mute">Expertise</dt>
                <dd>
                  <ul class="dossier__tags">
                    <li v-for="tag in member.expertise" :key="tag">{{ tag }}</li>
                  </ul>
                </dd>
              </div>

              <div class="dossier__spec dossier__reveal">
                <dt class="label label--mute">Destaques</dt>
                <dd>
                  <ul class="dossier__list">
                    <li v-for="item in member.achievements" :key="item">{{ item }}</li>
                  </ul>
                </dd>
              </div>
            </dl>

            <a
              v-if="member.showWhatsApp"
              class="btn btn--ink dossier__cta dossier__reveal"
              :href="
                getUrl(
                  `Olá! Gostaria de falar com ${member.name} (${member.role}) do escritório.`,
                )
              "
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="btn__text">Falar com {{ firstName(member.name) }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dossier {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: grid;
  place-items: center;
  padding: var(--space-3);
}

.dossier__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(20, 16, 13, 0.82);
}

.dossier__sheet {
  position: relative;
  z-index: 1;
  width: min(72rem, 100%);
  max-height: 92svh;
  overflow-y: auto;
  background: var(--paper);
  border: var(--hairline) solid var(--ink);
}

.dossier__bar {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--paper);
  border-bottom: var(--hairline) solid var(--rule-strong);
}

.dossier__close {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
  color: var(--ink);
  transition: color var(--t-fast);
}

.dossier__close:hover {
  color: var(--accent);
}

.dossier__close span {
  font-size: 1.1rem;
  line-height: 1;
}

.dossier__grid {
  display: grid;
}

.dossier__photo {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--ink-2);
  border-bottom: var(--hairline) solid var(--rule);
}

.dossier__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
}

.dossier__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-5) var(--space-4) var(--space-6);
}

.dossier__name {
  font-size: var(--fs-xl);
  margin-block: var(--space-2) 0.35rem;
}

.dossier__oab {
  color: var(--accent);
}

.dossier__bio {
  font-family: var(--font-display);
  font-size: var(--fs-md);
  line-height: var(--lh-snug);
  color: var(--ink);
  padding-bottom: var(--space-5);
  border-bottom: var(--hairline) solid var(--rule);
}

.dossier__specs {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.dossier__spec {
  display: grid;
  gap: var(--space-2);
}

.dossier__spec dd {
  font-size: var(--fs-sm);
  line-height: var(--lh-snug);
  color: var(--text-mute);
}

.dossier__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.dossier__tags li {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.08em;
  color: var(--ink);
  border: var(--hairline) solid var(--rule-strong);
  padding: 0.35rem 0.6rem;
}

.dossier__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.dossier__list li {
  position: relative;
  padding-left: var(--space-5);
}

.dossier__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: var(--space-4);
  height: var(--hairline);
  background: var(--accent);
}

.dossier__cta {
  align-self: flex-start;
}

@media (min-width: 768px) {
  .dossier {
    padding: var(--space-5);
  }

  .dossier__grid {
    grid-template-columns: 0.85fr 1.15fr;
  }

  .dossier__photo {
    aspect-ratio: auto;
    height: 100%;
    border-bottom: 0;
    border-right: var(--hairline) solid var(--rule);
  }

  .dossier__bar {
    padding-inline: var(--space-5);
  }

  .dossier__content {
    padding: var(--space-6);
  }
}
</style>
