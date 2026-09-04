<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { gsap, ScrollTrigger, reveal, maskReveal } from '../../lib/motion'
import { firm, teamFilters } from '../../data/firm'
import TeamCard from '../team/TeamCard.vue'
import TeamModal from '../team/TeamModal.vue'

const root = ref(null)
const activeFilter = ref('todos')
const selected = ref(null)
let ctx = null

const filteredTeam = computed(() => {
  if (activeFilter.value === 'todos') return firm.team
  return firm.team.filter((m) => m.category === activeFilter.value)
})

function countFor(id) {
  if (id === 'todos') return firm.team.length
  return firm.team.filter((m) => m.category === id).length
}

function openMember(member) {
  selected.value = member
}

function closeModal() {
  selected.value = null
}

watch(activeFilter, async () => {
  await nextTick()

  gsap.fromTo(
    '.team__cell',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, stagger: 0.06, duration: 0.6, clearProps: 'transform,opacity' },
  )

  ScrollTrigger.refresh()
})

onMounted(() => {
  if (!root.value) return

  ctx = gsap.context(() => {
    maskReveal('.team__title-line > span', { trigger: '.team__chapter' })
    reveal('.team__chapter .label, .team__chapter .index, .team__chapter .chapter__lead', {
      y: 16,
      trigger: '.team__chapter',
    })
    reveal('.team__filter', { y: 14, stagger: 0.06, trigger: '.team__filters' })
    reveal('.team__cell', { y: 44, stagger: 0.08, trigger: '.team__grid' })
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="equipe" ref="root" class="section section--tint team">
    <span class="rules" aria-hidden="true" />

    <div class="container">
      <header class="chapter team__chapter">
        <div class="chapter__meta">
          <span class="index">03</span>
          <span class="label">Nossa equipe</span>
        </div>
        <h2 class="chapter__title display team__title">
          <span class="team__title-line mask"><span>Advogados e</span></span>
          <span class="team__title-line mask"><span><em>colaboradores</em></span></span>
        </h2>
        <p class="chapter__lead">
          Profissionais jurídicos e equipe de apoio unidos pela mesma excelência
          no atendimento.
        </p>
      </header>

      <div class="team__filters" aria-label="Filtrar equipe">
        <button
          v-for="filter in teamFilters"
          :key="filter.id"
          type="button"
          class="team__filter"
          :class="{ 'is-active': activeFilter === filter.id }"
          :aria-pressed="activeFilter === filter.id"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
          <sup>{{ String(countFor(filter.id)).padStart(2, '0') }}</sup>
        </button>
      </div>

      <div class="team__grid">
        <div
          v-for="(member, i) in filteredTeam"
          :key="member.id"
          class="team__cell"
        >
          <TeamCard :member="member" :index="i + 1" @open="openMember" />
        </div>
      </div>

      <p v-if="!filteredTeam.length" class="team__empty">
        Nenhum colaborador nesta categoria.
      </p>
    </div>

    <TeamModal :member="selected" @close="closeModal" />
  </section>
</template>

<style scoped>
.team__title {
  font-size: var(--fs-2xl);
}

.team__title em {
  color: var(--accent);
}

.team__filters {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-7);
  border-bottom: var(--hairline) solid var(--rule-strong);
}

.team__filter {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-mute);
  padding-bottom: var(--space-3);
  transition: color var(--t-fast);
}

.team__filter sup {
  font-size: 0.5rem;
  color: var(--accent);
  opacity: 0.75;
}

.team__filter::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--t-mid) var(--ease-in-out);
}

.team__filter:hover {
  color: var(--ink);
}

.team__filter.is-active {
  color: var(--ink);
}

.team__filter.is-active::after {
  transform: scaleX(1);
}

.team__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-7) var(--space-5);
}

.team__empty {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-mute);
  padding-block: var(--space-7);
}

@media (min-width: 640px) {
  .team__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .team__grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-8) var(--space-5);
  }

  /* Linha de base alternada: o grid deixa de parecer uma tabela. */
  .team__cell:nth-child(even) {
    margin-top: var(--space-8);
  }
}
</style>
