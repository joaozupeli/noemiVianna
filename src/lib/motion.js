import { gsap, ScrollTrigger } from './gsap'

/**
 * Helpers de animação usados por todas as seções.
 *
 * Duas regras que valem para todos:
 *
 * 1. O estado final é o estado natural do HTML/CSS. Nenhuma animação depende
 *    de um `opacity: 0` escrito no CSS. Se o JS falhar, o navegador bloquear o
 *    script ou o GSAP não carregar, o conteúdo continua visível — o site perde
 *    a animação, não o conteúdo.
 *
 * 2. Sempre `fromTo` com início e fim explícitos, nunca `from`. Com `from` o
 *    GSAP descobre o valor final lendo o elemento; quando o
 *    `ScrollTrigger.refresh()` roda (fontes e imagens terminando de carregar)
 *    ele relê esse valor, e nesse momento o elemento ainda está em
 *    `opacity: 0` — a tween passa a animar de 0 para 0 e a seção nunca
 *    aparece. Com `fromTo` não existe valor para adivinhar.
 */

const REVEAL_START = 'top 88%'

/* Atraso do scrub, em segundos. É o que dá o peso das animações ligadas ao
   scroll: o elemento persegue a posição da rolagem em vez de estar colado
   nela. Um valor único aqui mantém todas as seções no mesmo ritmo. */
export const SCRUB = 1

export function reveal(targets, options = {}) {
  const {
    y = 40,
    x = 0,
    stagger = 0.1,
    duration = 1.2,
    delay = 0,
    trigger,
    start = REVEAL_START,
  } = options

  return gsap.fromTo(
    targets,
    { opacity: 0, y, x },
    {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      stagger,
      delay,
      ease: 'expo.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: trigger || targets, start, once: true },
    },
  )
}

/**
 * Revelação em máscara: o elemento sobe de dentro de um pai com
 * `overflow: hidden`. É o efeito de título de revista.
 */
export function maskReveal(targets, options = {}) {
  const {
    stagger = 0.12,
    duration = 1.1,
    delay = 0,
    trigger,
    start = REVEAL_START,
    scroll = true,
  } = options

  return gsap.fromTo(
    targets,
    { yPercent: 115 },
    {
      yPercent: 0,
      duration,
      stagger,
      delay,
      ease: 'expo.out',
      clearProps: 'transform',
      scrollTrigger: scroll
        ? { trigger: trigger || targets, start, once: true }
        : undefined,
    },
  )
}

/** Traço horizontal que se desenha da esquerda para a direita. */
export function drawLine(targets, options = {}) {
  const { duration = 1.2, stagger = 0.1, delay = 0, trigger, start = 'top 90%' } = options

  return gsap.fromTo(
    targets,
    { scaleX: 0 },
    {
      scaleX: 1,
      transformOrigin: 'left center',
      duration,
      stagger,
      delay,
      ease: 'expo.inOut',
      clearProps: 'transform',
      scrollTrigger: { trigger: trigger || targets, start, once: true },
    },
  )
}

/** Deslocamento suave conforme a página rola. */
export function parallax(targets, options = {}) {
  const { amount = 15, trigger, from = 'top bottom', to = 'bottom top' } = options

  return gsap.fromTo(
    targets,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger || targets,
        start: from,
        end: to,
        scrub: SCRUB,
        invalidateOnRefresh: true,
      },
    },
  )
}

/**
 * Contador numérico disparado quando a seção entra na tela.
 * `onTick` recebe o valor arredondado a cada frame.
 */
export function countUp(trigger, value, onTick, options = {}) {
  const { duration = 2.2, start = 'top 80%' } = options
  const state = { current: 0 }

  return gsap.to(state, {
    current: value,
    duration,
    ease: 'power2.out',
    onUpdate: () => onTick(Math.round(state.current)),
    scrollTrigger: { trigger, start, once: true },
  })
}

/** Faixa de texto em loop infinito (ticker de jornal). */
export function marquee(target, options = {}) {
  const { duration = 26 } = options

  return gsap.to(target, {
    xPercent: -50,
    duration,
    ease: 'none',
    repeat: -1,
  })
}

export { gsap, ScrollTrigger }
