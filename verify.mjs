import { chromium } from 'playwright'

/**
 * Verificação do build de produção num navegador real.
 *
 * Como usar:
 *   npm run build
 *   npm run preview          (em outro terminal)
 *   npm run check
 *
 * Na primeira vez, baixe o navegador: npx playwright install chromium
 * Para apontar para outra URL: node verify.mjs https://seu-site.vercel.app
 */
const URL = process.argv[2] || process.env.CHECK_URL || 'http://localhost:4173/'
console.log(`Verificando: ${URL}`)

const browser = await chromium.launch()
const problems = []

function check(name, ok, detail = '') {
  console.log(`${ok ? '  OK  ' : ' FALHA'} | ${name}${detail ? ' — ' + detail : ''}`)
  if (!ok) problems.push(name + (detail ? ': ' + detail : ''))
}

async function scrollThrough(page, steps = 16) {
  for (let i = 1; i <= steps; i++) {
    await page.evaluate(
      (f) => window.scrollTo(0, document.documentElement.scrollHeight * f),
      i / steps,
    )
    await page.waitForTimeout(320)
  }
  await page.waitForTimeout(1200)
}

async function newPage(opts = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ...opts })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.errors = errors
  return page
}

/* ---------- 1. Desktop completo ---------- */
console.log('\n=== 1. DESKTOP 1440x900 ===')
{
  const page = await newPage()
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(2500)

  /* Prova que o ScrollTrigger está ativo: a barra de progresso é dirigida por
     uma tween com scrub, e o item ativo do menu por um onToggle. */
  const p0 = await page.evaluate(
    () => getComputedStyle(document.querySelector('.head__progress')).transform,
  )
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5))
  await page.waitForTimeout(900)
  const p1 = await page.evaluate(() => ({
    transform: getComputedStyle(document.querySelector('.head__progress')).transform,
    navActive: document.querySelector('.nav__item.is-active')?.textContent.trim(),
  }))
  check('barra de progresso segue o scroll (tween com scrub)', p0 !== p1.transform, `${p0} -> ${p1.transform}`)
  check('item ativo do menu acompanha a seção (onToggle)', !!p1.navActive, p1.navActive)

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  await scrollThrough(page)

  const state = await page.evaluate(() => {
    const sels = [
      '.about__prose > *',
      '.area__row',
      '.team__cell',
      '.value__inner',
      '.contact__info > *',
      '.quote.is-active',
    ]
    const invisible = []
    let total = 0
    for (const s of sels) {
      for (const el of document.querySelectorAll(s)) {
        total++
        if (+getComputedStyle(el).opacity < 0.05) invisible.push(s)
      }
    }
    return {
      total,
      invisible: [...new Set(invisible)],
      counters: [...document.querySelectorAll('.stat__value')].map((e) =>
        e.textContent.trim().replace(/\s+/g, ''),
      ),
      wordmark: !!document.querySelector('.foot__wordmark'),
    }
  })

  check('nenhum elemento invisivel apos rolar', state.invisible.length === 0, state.invisible.join(', '))
  check(
    'contadores animaram',
    state.counters.every((c) => !/^0[^0-9]*$/.test(c)),
    state.counters.join(' | '),
  )
  check('sem erros de console', page.errors.length === 0, page.errors.join(' | '))

  /* Valores: o bloco fica travado durante o scroll? */
  const pinTop = await page.evaluate(() => {
    const el = document.querySelector('.values')
    return el.getBoundingClientRect().top + window.scrollY
  })
  await page.evaluate((y) => window.scrollTo(0, y + 250), pinTop)
  await page.waitForTimeout(600)
  const a = await page.evaluate(() =>
    Math.round(document.querySelector('.values__sticky').getBoundingClientRect().top),
  )
  await page.evaluate((y) => window.scrollTo(0, y + 700), pinTop)
  await page.waitForTimeout(600)
  const b = await page.evaluate(() =>
    Math.round(document.querySelector('.values__sticky').getBoundingClientRect().top),
  )
  check('bloco de valores fica fixo durante o scroll', a === b, `${a}px -> ${b}px`)

  const active = await page.evaluate(() => document.querySelectorAll('.value.is-active').length)
  check('valor ativo destacado', active === 1, `${active} ativo(s)`)

  await page.close()
}

/* ---------- 2. Interações ---------- */
console.log('\n=== 2. INTERAÇÕES ===')
{
  const page = await newPage()
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(1800)

  await page.evaluate(() => document.querySelector('#areas').scrollIntoView())
  await page.waitForTimeout(900)
  const h1 = await page.evaluate(() => document.querySelector('.area').offsetHeight)
  await page.click('.area:first-child .area__row')
  await page.waitForTimeout(900)
  const h2 = await page.evaluate(() => document.querySelector('.area').offsetHeight)
  check('area expande ao clicar', h2 > h1 + 20, `${h1}px -> ${h2}px`)

  await page.evaluate(() => document.querySelector('#equipe').scrollIntoView())
  await page.waitForTimeout(700)
  const before = await page.evaluate(() => document.querySelectorAll('.team__cell').length)
  await page.click('.team__filter:nth-child(2)')
  await page.waitForTimeout(1000)
  const after = await page.evaluate(() => ({
    count: document.querySelectorAll('.team__cell').length,
    visible: [...document.querySelectorAll('.team__cell')].every(
      (el) => +getComputedStyle(el).opacity > 0.9,
    ),
  }))
  check('filtro da equipe funciona', after.count > 0 && after.count < before, `${before} -> ${after.count}`)
  check('cards visiveis depois do filtro', after.visible)

  await page.click('.member__media')
  await page.waitForTimeout(1100)
  const modal = await page.evaluate(() => {
    const el = document.querySelector('.dossier__sheet')
    if (!el) return null
    return { op: +getComputedStyle(el).opacity, clip: getComputedStyle(el).clipPath }
  })
  check('modal do perfil abre visivel', modal && modal.op > 0.9, JSON.stringify(modal))

  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  const closed = await page.evaluate(() => !document.querySelector('.dossier'))
  check('modal fecha com Esc', closed)

  const carousel = await page.evaluate(() => {
    document.querySelector('#resultados').scrollIntoView()
    return document.querySelector('.results__counter').textContent.trim()
  })
  await page.waitForTimeout(600)
  await page.click('.results__arrow:last-child')
  await page.waitForTimeout(900)
  const carousel2 = await page.evaluate(() =>
    document.querySelector('.results__counter').textContent.trim(),
  )
  check('carrossel avanca', carousel !== carousel2, `${carousel} -> ${carousel2}`)

  check('sem erros de console nas interacoes', page.errors.length === 0, page.errors.join(' | '))
  await page.close()
}

/* ---------- 3. Mobile ---------- */
console.log('\n=== 3. MOBILE 390x844 ===')
{
  const page = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(2200)

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  check('sem rolagem horizontal', overflow <= 1, `${overflow}px de excesso`)

  await page.click('.burger')
  await page.waitForTimeout(1000)
  const menu = await page.evaluate(() => {
    const el = document.querySelector('.menu')
    const rows = [...document.querySelectorAll('.menu__row')]
    return {
      shown: getComputedStyle(el).display !== 'none',
      rowsVisible: rows.every((r) => +getComputedStyle(r).opacity > 0.9),
      clip: getComputedStyle(el).clipPath,
    }
  })
  check('menu mobile abre', menu.shown && menu.rowsVisible, JSON.stringify(menu))

  await page.click('.menu__row')
  await page.waitForTimeout(900)
  const closedMenu = await page.evaluate(
    () => getComputedStyle(document.querySelector('.menu')).display === 'none',
  )
  check('menu fecha ao clicar num link', closedMenu)

  await scrollThrough(page, 14)
  const vis = await page.evaluate(() => {
    const sels = ['.area__row', '.team__cell', '.value__inner', '.stat']
    let total = 0
    const invisible = []
    for (const s of sels)
      for (const el of document.querySelectorAll(s)) {
        total++
        if (+getComputedStyle(el).opacity < 0.05) invisible.push(s)
      }
    return { total, invisible: [...new Set(invisible)] }
  })
  check('conteudo visivel no mobile', vis.invisible.length === 0, vis.invisible.join(', '))
  check('sem erros de console', page.errors.length === 0, page.errors.join(' | '))
  await page.close()
}

/* ---------- 4. Recursos externos indisponiveis ---------- */
console.log('\n=== 4. FONTES E IMAGENS EXTERNAS BLOQUEADAS ===')
{
  const page = await newPage()
  await page.route('**images.unsplash.com/**', (r) => r.abort())
  await page.route('**fonts.g**/**', (r) => r.abort())
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await scrollThrough(page, 14)

  const r = await page.evaluate(() => {
    const sels = ['.about__prose > *', '.area__row', '.team__cell', '.value__inner', '.stat']
    let total = 0
    const invisible = []
    for (const s of sels)
      for (const el of document.querySelectorAll(s)) {
        total++
        if (+getComputedStyle(el).opacity < 0.05) invisible.push(s)
      }
    return { total, invisible: [...new Set(invisible)] }
  })
  check('site continua legivel sem recursos externos', r.invisible.length === 0, r.invisible.join(', '))
  await page.close()
}

/* ---------- 5. Rolagem suave ---------- */
console.log('\n=== 5. ROLAGEM SUAVE (LENIS) ===')
{
  const page = await newPage()
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(2000)

  const active = await page.evaluate(() =>
    document.documentElement.classList.contains('lenis'),
  )
  check('lenis ativo na pagina', active)

  /* Uma rolagem nativa salta de uma vez. Com interpolação, a posição passa por
     muitos valores diferentes ao longo de vários frames. */
  await page.mouse.move(700, 450)
  await page.mouse.wheel(0, 700)
  const samples = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = []
        const tick = () => {
          out.push(Math.round(window.scrollY))
          if (out.length < 30) requestAnimationFrame(tick)
          else resolve(out)
        }
        requestAnimationFrame(tick)
      }),
  )
  const steps = new Set(samples).size
  const growing = samples[samples.length - 1] > samples[0]
  check('scroll do mouse é interpolado', steps > 6 && growing, `${steps} posicoes distintas`)

  /* A âncora tem que parar abaixo do header fixo, não atrás dele. */
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(600)
  await page.click('.nav__item:last-child')
  await page.waitForTimeout(2600)
  const anchor = await page.evaluate(() => {
    const head = document.querySelector('.head').offsetHeight
    const top = Math.round(document.querySelector('#contato').getBoundingClientRect().top)
    return { head, top }
  })
  check(
    'ancora para abaixo do header fixo',
    anchor.top >= anchor.head && anchor.top < anchor.head + 60,
    `secao a ${anchor.top}px, header tem ${anchor.head}px`,
  )

  check('sem erros de console', page.errors.length === 0, page.errors.join(' | '))
  await page.close()
}

await browser.close()

console.log('\n============================')
if (problems.length) {
  console.log(`${problems.length} PROBLEMA(S):`)
  problems.forEach((p) => console.log(' - ' + p))
  process.exitCode = 1
} else {
  console.log('TUDO PASSOU')
}
