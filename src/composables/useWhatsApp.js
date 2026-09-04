/**
 * Composable reutilizável para CTAs de WhatsApp.
 * @param {string} [phoneNumber] — DDI+DDD+número (só dígitos). Usa firm.whatsapp.phone se omitido.
 * @param {string} [message] — mensagem pré-preenchida
 */
import { firm } from '../data/firm'

export function useWhatsApp(phoneNumber, message) {
  const phone = phoneNumber || firm.whatsapp.phone
  const text = message || firm.whatsapp.defaultMessage

  function getUrl(customMessage) {
    const msg = encodeURIComponent(customMessage || text)
    return `https://wa.me/${phone}?text=${msg}`
  }

  function open(customMessage) {
    window.open(getUrl(customMessage), '_blank', 'noopener,noreferrer')
  }

  return { getUrl, open, phone }
}
