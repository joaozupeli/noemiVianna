/**
 * Helpers da rolagem suave.
 *
 * A instância do Lenis nasce no App.vue (igual ao padrão que você passou).
 * Este arquivo só guarda a referência e cuida de âncoras / travar o scroll.
 */

let lenis = null

const headerOffset = () => {
  const head = document.querySelector('.head')
  return -((head?.offsetHeight || 76) + 24)
}

function onAnchorClick(event) {
  if (event.defaultPrevented) return

  const link = event.target.closest('a[href^="#"]')
  if (!link) return

  const hash = link.getAttribute('href')
  if (!hash || hash === '#') return

  const target = document.querySelector(hash)
  if (!target) return

  event.preventDefault()
  scrollTo(target)
}

/** App.vue chama isso depois de criar o Lenis. */
export function bindSmoothScroll(instance) {
  lenis = instance
  document.addEventListener('click', onAnchorClick)
}

/** App.vue chama no onUnmounted. */
export function unbindSmoothScroll() {
  document.removeEventListener('click', onAnchorClick)
  lenis = null
}

/** Rola até um elemento parando abaixo do header fixo. */
export function scrollTo(target) {
  if (lenis) {
    lenis.scrollTo(target, { offset: headerOffset(), duration: 1.4, force: true })
    return
  }

  const top = target.getBoundingClientRect().top + window.scrollY + headerOffset()
  window.scrollTo({ top, behavior: 'smooth' })
}

/** Travar a rolagem enquanto o menu ou o modal estão abertos. */
export function setScrollLocked(locked) {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}
