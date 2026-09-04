<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { gsap, ScrollTrigger } from '../../lib/motion'
import { setScrollLocked, scrollTo } from '../../lib/smoothScroll'
import { firm } from '../../data/firm'

const isOpen = ref(false)
const isScrolled = ref(false)
const activeSection = ref('')
const progressRef = ref(null)
const panelRef = ref(null)

let ctx = null
let menuTl = null

const navLinks = [
  { id: 'sobre', href: '#sobre', label: 'Sobre', index: '01' },
  { id: 'areas', href: '#areas', label: 'Áreas', index: '02' },
  { id: 'equipe', href: '#equipe', label: 'Equipe', index: '03' },
  { id: 'resultados', href: '#resultados', label: 'Resultados', index: '04' },
  { id: 'contato', href: '#contato', label: 'Contato', index: '05' },
]

function onScroll() {
  isScrolled.value = window.scrollY > 40
}

/* Precisa passar pelo helper: com o Lenis ativo, esconder o overflow do body
   não basta — a interpolação dele continua rolando a página por baixo. */
function lockScroll(lock) {
  setScrollLocked(lock)
}

function openMenu() {
  isOpen.value = true
  lockScroll(true)

  menuTl?.kill()
  menuTl = gsap.timeline()
  menuTl
    .fromTo(
      panelRef.value,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' },
    )
    .fromTo(
      panelRef.value.querySelectorAll('.menu__row'),
      { yPercent: 110 },
      { yPercent: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out' },
      0.15,
    )
    .fromTo(
      panelRef.value.querySelectorAll('.menu__foot > *'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 },
      0.45,
    )
}

function closeMenu(after) {
  const finish = () => {
    isOpen.value = false
    lockScroll(false)
    after?.()
  }

  if (!isOpen.value) {
    after?.()
    return
  }

  menuTl?.kill()
  menuTl = gsap.timeline({ onComplete: finish })
  menuTl.to(panelRef.value, {
    clipPath: 'inset(0 0 100% 0)',
    duration: 0.55,
    ease: 'expo.inOut',
  })
}

/* A rolagem tem que esperar o painel fechar: enquanto o menu está aberto o
   scroll está travado, então rolar antes só faria a página pular ao destravar. */
function onNavClick(event) {
  event.preventDefault()

  const hash = event.currentTarget.getAttribute('href')
  closeMenu(() => {
    const target = document.querySelector(hash)
    if (target) scrollTo(target)
  })
}

function toggleMenu() {
  if (isOpen.value) closeMenu()
  else openMenu()
}

function onKeydown(e) {
  if (e.key === 'Escape') closeMenu()
}

onMounted(async () => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)

  /* O header é montado antes do conteúdo da rota, então as seções ainda não
     existem no DOM neste ponto. Sem esperar, os gatilhos abaixo não achariam
     nada e o item ativo do menu nunca acenderia. */
  await nextTick()

  ctx = gsap.context(() => {
    gsap.to(progressRef.value, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    })

    navLinks.forEach((link) => {
      const section = document.getElementById(link.id)
      if (!section) return

      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) activeSection.value = link.id
        },
      })
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  lockScroll(false)
  menuTl?.kill()
  ctx?.revert()
})
</script>

<template>
  <header class="head" :class="{ 'is-scrolled': isScrolled, 'is-open': isOpen }">
    <div class="container head__bar">
      <a href="#topo" class="brand" @click="onNavClick">
        <span class="brand__mark" aria-hidden="true">N<span>V</span></span>
        <span class="brand__name">
          <strong>{{ firm.name }}</strong>
          <small>{{ firm.legal.oab }}</small>
        </span>
      </a>

      <nav class="nav" aria-label="Navegação principal">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="nav__item"
          :class="{ 'is-active': activeSection === link.id }"
        >
          <span class="nav__index">{{ link.index }}</span>
          <span class="nav__label">{{ link.label }}</span>
        </a>
      </nav>

      <a href="#contato" class="btn btn--ink head__cta">
        <span class="btn__text">Agendar conversa</span>
      </a>

      <button
        class="burger"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="menu-mobile"
        :aria-label="isOpen ? 'Fechar menu' : 'Abrir menu'"
        @click="toggleMenu"
      >
        <span class="burger__label">{{ isOpen ? 'Fechar' : 'Menu' }}</span>
        <span class="burger__bars" :class="{ 'is-open': isOpen }" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
    </div>

    <span ref="progressRef" class="head__progress" aria-hidden="true" />

    <nav
      id="menu-mobile"
      ref="panelRef"
      class="menu"
      :class="{ 'is-open': isOpen }"
      aria-label="Menu"
    >
      <ul class="menu__list">
        <li v-for="link in navLinks" :key="link.href" class="menu__item mask">
          <a :href="link.href" class="menu__row" @click="onNavClick">
            <span class="index">{{ link.index }}</span>
            <span class="menu__text display">{{ link.label }}</span>
          </a>
        </li>
      </ul>

      <div class="menu__foot">
        <p class="label label--mute">Contato direto</p>
        <a :href="`tel:${firm.contact.phone.replace(/\D/g, '')}`" class="menu__phone">
          {{ firm.contact.phone }}
        </a>
        <a v-if="firm.contact.email" :href="`mailto:${firm.contact.email}`" class="menu__mail">
          {{ firm.contact.email }}
        </a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.head {
  position: fixed;
  inset: 0 0 auto;
  z-index: var(--z-header);
  color: var(--on-ink);
  transition: background-color var(--t-mid) var(--ease-out),
    border-color var(--t-mid) var(--ease-out);
  border-bottom: var(--hairline) solid transparent;
}

.head.is-scrolled {
  background: var(--ink);
  border-bottom-color: var(--rule-on-ink);
}

.head.is-open {
  background: var(--ink);
  border-bottom-color: var(--rule-on-ink);
}

.head__bar {
  position: relative;
  z-index: 2;
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
}

/* --- Marca --- */
.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.brand__mark {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border: var(--hairline) solid var(--rule-on-ink-strong);
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--on-ink);
}

.brand__mark span {
  color: var(--accent-2);
}

.brand__name {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand__name strong {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.brand__name small {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--on-ink-mute);
  margin-top: 3px;
}

/* --- Navegação desktop --- */
.nav {
  display: none;
  align-items: baseline;
  gap: var(--space-6);
}

.nav__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  padding-bottom: 0.3rem;
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--on-ink-mute);
  transition: color var(--t-fast);
}

.nav__index {
  font-size: 0.5rem;
  color: var(--accent-2);
  opacity: 0.7;
  transition: opacity var(--t-fast);
}

.nav__item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: var(--hairline);
  background: var(--accent-2);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--t-mid) var(--ease-in-out);
}

.nav__item:hover,
.nav__item.is-active {
  color: var(--on-ink);
}

.nav__item:hover::after,
.nav__item.is-active::after {
  transform: scaleX(1);
}

.head__cta {
  display: none;
  padding: 0.8rem 1.25rem;
  background: transparent;
  border-color: var(--rule-on-ink-strong);
  color: var(--on-ink);
}

.head__cta::after {
  background: var(--accent);
}

.head__cta:hover {
  border-color: var(--accent);
  color: #fff;
}

.head__progress {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: var(--accent-2);
  transform: scaleX(0);
  transform-origin: left center;
  z-index: 3;
}

/* --- Botão do menu --- */
.burger {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--on-ink);
}

.burger__bars {
  display: grid;
  gap: 5px;
  width: 26px;
}

.burger__bars i {
  display: block;
  height: var(--hairline);
  background: currentColor;
  transition: transform var(--t-mid) var(--ease-in-out);
}

.burger__bars.is-open i:first-child {
  transform: translateY(3px) rotate(45deg);
}

.burger__bars.is-open i:last-child {
  transform: translateY(-3px) rotate(-45deg);
}

/* --- Menu em tela cheia --- */
.menu {
  position: fixed;
  inset: 0;
  z-index: 1;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-6);
  padding: calc(var(--header-h) + var(--space-6)) var(--pad) var(--space-7);
  background: var(--ink);
}

.menu.is-open {
  display: flex;
}

.menu__list {
  display: flex;
  flex-direction: column;
}

.menu__item {
  border-bottom: var(--hairline) solid var(--rule-on-ink);
}

.menu__row {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
  padding-block: var(--space-4);
  color: var(--on-ink);
  transition: color var(--t-fast);
}

.menu__row:hover {
  color: var(--accent-2);
}

.menu__text {
  font-size: var(--fs-lg);
}

.menu__foot {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.menu__phone {
  font-family: var(--font-display);
  font-size: var(--fs-md);
  color: var(--on-ink);
}

.menu__mail {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  color: var(--on-ink-mute);
}

@media (min-width: 1024px) {
  .nav,
  .head__cta {
    display: flex;
  }

  .burger,
  .menu {
    display: none !important;
  }
}
</style>
