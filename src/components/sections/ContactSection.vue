<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { gsap, reveal, maskReveal, drawLine } from '../../lib/motion'
import { firm, interestAreas } from '../../data/firm'
import { useWhatsApp } from '../../composables/useWhatsApp'

const root = ref(null)
const { getUrl, open } = useWhatsApp()
let ctx = null

const form = reactive({ name: '', phone: '', interest: '', message: '' })
const errors = reactive({ name: '', phone: '', interest: '', message: '' })

function validate() {
  errors.name = form.name.trim() ? '' : 'Informe seu nome'
  errors.phone = form.phone.trim().length >= 8 ? '' : 'Informe um telefone válido'
  errors.interest = form.interest ? '' : 'Selecione uma área'
  errors.message = form.message.trim() ? '' : 'Escreva uma mensagem'
  return !Object.values(errors).some(Boolean)
}

function buildMessage() {
  return [
    `Olá! Meu nome é ${form.name}.`,
    `Telefone: ${form.phone}.`,
    `Área de interesse: ${form.interest}.`,
    '',
    form.message,
  ].join('\n')
}

function submitViaWhatsApp(e) {
  e.preventDefault()
  if (!validate()) return
  open(buildMessage())
}

const details = [
  {
    label: 'Endereço',
    lines: [
      firm.contact.address.street,
      `${firm.contact.address.neighborhood} — ${firm.contact.address.city}/${firm.contact.address.state}`,
      `CEP ${firm.contact.address.zip}`,
    ],
  },
]

onMounted(() => {
  if (!root.value) return

  ctx = gsap.context(() => {
    maskReveal('.contact__title-line > span', { trigger: '.contact__chapter' })
    reveal('.contact__chapter .label, .contact__chapter .index, .contact__chapter .chapter__lead', {
      y: 16,
      trigger: '.contact__chapter',
    })
    reveal('.contact__info > *', { y: 26, stagger: 0.09, trigger: '.contact__info' })
    reveal('.contact__form-inner > *', { y: 26, stagger: 0.07, trigger: '.contact__form' })
    drawLine('.contact__rule')
  }, root.value)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="contato" ref="root" class="section contact">
    <span class="rules" aria-hidden="true" />

    <div class="container">
      <header class="chapter contact__chapter">
        <div class="chapter__meta">
          <span class="index">05</span>
          <span class="label">Contato e localização</span>
        </div>
        <h2 class="chapter__title display contact__title">
          <span class="contact__title-line mask"><span>Estamos à</span></span>
          <span class="contact__title-line mask"><span><em>disposição</em></span></span>
        </h2>
        <p class="chapter__lead">
          Agende uma conversa. Preferimos canais diretos e resposta ágil.
        </p>
      </header>

      <div class="contact__layout">
        <div class="contact__info">
          <dl class="contact__list">
            <div v-for="item in details" :key="item.label" class="contact__item">
              <dt class="label label--mute">{{ item.label }}</dt>
              <dd>
                <span v-for="line in item.lines" :key="line" class="contact__line">
                  {{ line }}
                </span>
              </dd>
            </div>

            <div class="contact__item">
              <dt class="label label--mute">Telefone</dt>
              <dd>
                <a
                  class="contact__big"
                  :href="`tel:${firm.contact.phone.replace(/\D/g, '')}`"
                >
                  {{ firm.contact.phone }}
                </a>
              </dd>
            </div>

            <div class="contact__item">
              <dt class="label label--mute">E-mail</dt>
              <dd>
                <a class="contact__mail" :href="`mailto:${firm.contact.email}`">
                  {{ firm.contact.email }}
                </a>
              </dd>
            </div>

            <div class="contact__item">
              <dt class="label label--mute">Horário</dt>
              <dd>
                <ul class="contact__hours">
                  <li v-for="h in firm.contact.hours" :key="h.days">
                    <span>{{ h.days }}</span>
                    <span class="contact__dots" aria-hidden="true" />
                    <span>{{ h.time }}</span>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>

          <figure class="contact__map">
            <iframe
              title="Localização do escritório Mendes &amp; Associados"
              :src="firm.contact.address.mapEmbedUrl"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            />
            <figcaption class="index">Fig. 02 — Sede</figcaption>
          </figure>
        </div>

        <form class="contact__form" @submit="submitViaWhatsApp" novalidate>
          <div class="contact__form-inner">
            <div class="contact__form-head">
              <h3 class="contact__form-title display">Envie sua mensagem</h3>
              <p class="contact__form-note">
                O envio abre o WhatsApp com os dados já preenchidos.
              </p>
            </div>

            <span class="contact__rule hairline" />

            <label class="field">
              <span class="field__label"><i>01</i> Nome completo</span>
              <input
                v-model="form.name"
                type="text"
                name="name"
                autocomplete="name"
                required
                :aria-invalid="!!errors.name"
              />
              <span v-if="errors.name" class="field__error">{{ errors.name }}</span>
            </label>

            <label class="field">
              <span class="field__label"><i>02</i> Telefone</span>
              <input
                v-model="form.phone"
                type="tel"
                name="phone"
                autocomplete="tel"
                placeholder="(11) 99999-9999"
                required
                :aria-invalid="!!errors.phone"
              />
              <span v-if="errors.phone" class="field__error">{{ errors.phone }}</span>
            </label>

            <label class="field">
              <span class="field__label"><i>03</i> Área de interesse</span>
              <select
                v-model="form.interest"
                name="interest"
                required
                :aria-invalid="!!errors.interest"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="area in interestAreas" :key="area" :value="area">
                  {{ area }}
                </option>
              </select>
              <span v-if="errors.interest" class="field__error">{{ errors.interest }}</span>
            </label>

            <label class="field">
              <span class="field__label"><i>04</i> Mensagem</span>
              <textarea
                v-model="form.message"
                name="message"
                rows="4"
                required
                :aria-invalid="!!errors.message"
              />
              <span v-if="errors.message" class="field__error">{{ errors.message }}</span>
            </label>

            <div class="contact__actions">
              <button type="submit" class="btn btn--ink btn--full">
                <span class="btn__text">Enviar via WhatsApp</span>
              </button>
              <a
                class="btn-link"
                :href="getUrl()"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ou fale agora sem formulário
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: var(--paper);
}

.contact__title {
  font-size: var(--fs-2xl);
}

.contact__title em {
  color: var(--accent);
}

.contact__layout {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-8);
}

/* --- Coluna de informações --- */
.contact__list {
  display: flex;
  flex-direction: column;
  border-top: var(--hairline) solid var(--rule-strong);
}

.contact__item {
  display: grid;
  gap: var(--space-2);
  padding-block: var(--space-4);
  border-bottom: var(--hairline) solid var(--rule);
}

.contact__item dd {
  font-size: var(--fs-sm);
  color: var(--text-mute);
}

.contact__line {
  display: block;
}

.contact__big {
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  color: var(--ink);
  transition: color var(--t-fast);
}

.contact__big:hover {
  color: var(--accent);
}

.contact__mail {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.04em;
  color: var(--ink);
  border-bottom: var(--hairline) solid var(--rule-strong);
  padding-bottom: 2px;
}

.contact__mail:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.contact__hours {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 22rem;
}

.contact__hours li {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.contact__dots {
  flex: 1;
  height: var(--hairline);
  background: var(--rule);
}

.contact__map {
  margin-top: var(--space-6);
}

.contact__map iframe {
  width: 100%;
  aspect-ratio: 16 / 10;
  border: var(--hairline) solid var(--ink);
  filter: grayscale(1) contrast(1.05);
}

.contact__map figcaption {
  margin-top: var(--space-2);
}

/* --- Formulário --- */
.contact__form {
  background: var(--paper-2);
  padding: var(--space-5);
  border-top: 2px solid var(--ink);
}

.contact__form-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.contact__form-title {
  font-size: var(--fs-lg);
}

.contact__form-note {
  font-size: var(--fs-sm);
  color: var(--text-mute);
  margin-top: var(--space-2);
}

.field__label i {
  font-style: normal;
  color: var(--accent);
  margin-right: 0.35rem;
}

.contact__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
  margin-top: var(--space-2);
}

@media (min-width: 768px) {
  .contact__form {
    padding: var(--space-7);
  }
}

@media (min-width: 1024px) {
  .contact__layout {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
    align-items: start;
  }
}
</style>
