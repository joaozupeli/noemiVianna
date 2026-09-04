import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Ponto ÚNICO de entrada do GSAP no projeto.
 *
 * Todo componente deve importar daqui (`../../lib/gsap`) e nunca de 'gsap'
 * direto. Importar de 'gsap' em um componente e registrar o plugin em outro
 * arquivo funciona por acidente: no build de produção o bundler pode separar
 * os módulos em chunks diferentes e o `scrollTrigger:` das tweens passa a ser
 * ignorado silenciosamente — as animações disparam todas no load.
 */
gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 0.9 })

/* No mobile a barra de endereço aparece/desaparece e muda a altura da viewport.
   Sem isso o ScrollTrigger recalcula tudo e os pins "pulam" durante o scroll. */
ScrollTrigger.config({ ignoreMobileResize: true })

/**
 * O ScrollTrigger mede a posição dos elementos uma única vez, na criação.
 * Fontes e imagens externas chegam depois disso e empurram o conteúdo para
 * baixo — em produção (rede real) isso é muito mais lento que em localhost.
 * Sem recalcular, os gatilhos ficam apontando para posições erradas.
 */
export function refreshOnAssetsLoad() {
  const refresh = () => ScrollTrigger.refresh()

  if (document.fonts?.ready) document.fonts.ready.then(refresh)

  window.addEventListener('load', refresh)

  document.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', refresh, { once: true })
  })
}

export { gsap, ScrollTrigger }
