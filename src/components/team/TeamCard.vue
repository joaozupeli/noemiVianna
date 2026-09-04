<script setup>
import { useWhatsApp } from '../../composables/useWhatsApp'

const props = defineProps({
  member: { type: Object, required: true },
  index: { type: Number, default: 1 },
})

defineEmits(['open'])

const { getUrl } = useWhatsApp()

function firstName(name) {
  return name.replace(/^(Dr\.|Dra\.)\s+/i, '').split(' ')[0]
}
</script>

<template>
  <article class="member">
    <button
      type="button"
      class="member__media"
      :aria-label="`Ver perfil de ${member.name}`"
      @click="$emit('open', member)"
    >
      <img
        :src="member.photo"
        :alt="member.photoAlt"
        width="400"
        height="500"
        loading="lazy"
        decoding="async"
      />
      <span class="member__tint" aria-hidden="true" />
      <span class="member__index index">{{ String(index).padStart(2, '0') }}</span>
      <span class="member__hint" aria-hidden="true">Ver perfil</span>
    </button>

    <div class="member__body">
      <h3 class="member__name display">{{ member.name }}</h3>
      <p class="member__role">{{ member.role }}</p>
      <p class="member__oab">{{ member.oab || 'Equipe de apoio' }}</p>

      <a
        v-if="member.showWhatsApp"
        class="btn-link member__wa"
        :href="
          getUrl(
            `Olá! Gostaria de falar com ${member.name} (${member.role}) do escritório.`,
          )
        "
        target="_blank"
        rel="noopener noreferrer"
      >
        Falar com {{ firstName(member.name) }}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </article>
</template>

<style scoped>
.member {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.member__media {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--ink-2);
  padding: 0;
}

.member__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
  transition: transform var(--t-slow) var(--ease-out),
    filter var(--t-slow) var(--ease-out);
}

.member__tint {
  position: absolute;
  inset: 0;
  background: var(--accent);
  mix-blend-mode: color;
  opacity: 0.35;
  transition: opacity var(--t-slow) var(--ease-out);
}

.member__media:hover img,
.member__media:focus-visible img {
  transform: scale(1.04);
  filter: grayscale(0) contrast(1);
}

.member__media:hover .member__tint,
.member__media:focus-visible .member__tint {
  opacity: 0;
}

.member__index {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.4rem 0.55rem;
  background: var(--ink);
  color: var(--paper);
}

.member__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.7rem var(--space-3);
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: var(--track-mono);
  text-transform: uppercase;
  text-align: left;
  transform: translateY(100%);
  transition: transform var(--t-mid) var(--ease-out);
}

.member__media:hover .member__hint,
.member__media:focus-visible .member__hint {
  transform: translateY(0);
}

.member__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: var(--space-4);
  margin-top: var(--space-4);
  border-top: var(--hairline) solid var(--rule-strong);
  flex: 1;
}

.member__name {
  font-size: var(--fs-md);
  color: var(--ink);
}

.member__role {
  font-size: var(--fs-sm);
  color: var(--text-mute);
  line-height: var(--lh-snug);
}

.member__oab {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.08em;
  color: var(--accent);
}

.member__wa {
  margin-top: auto;
  padding-top: var(--space-4);
  font-size: 0.625rem;
  letter-spacing: 0.12em;
}
</style>
