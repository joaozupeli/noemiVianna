<script setup>
/**
 * Ícones SVG leves para áreas / valores.
 * name: scale | award | eye | shield | civil | labor | business | family | criminal | tax
 */
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 28 },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="square"
    stroke-linejoin="miter"
    aria-hidden="true"
  >
    <!-- Valores -->
    <template v-if="name === 'scale'">
      <path d="M12 3v18M5 7h14" />
      <path d="M5 7l-3 7h6L5 7zM19 7l-3 7h6l-3-7z" />
      <path d="M8 21h8" />
    </template>
    <template v-else-if="name === 'award'">
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </template>
    <!-- Áreas -->
    <template v-else-if="name === 'civil'">
      <path d="M4 20h16M6 20V10l6-5 6 5v10" />
      <path d="M10 20v-5h4v5" />
    </template>
    <template v-else-if="name === 'labor'">
      <rect x="3" y="8" width="18" height="12" />
      <path d="M8 8V6a4 4 0 018 0v2" />
    </template>
    <template v-else-if="name === 'business'">
      <rect x="3" y="10" width="6" height="10" />
      <rect x="10" y="4" width="6" height="16" />
      <rect x="17" y="13" width="4" height="7" />
    </template>
    <template v-else-if="name === 'family'">
      <circle cx="9" cy="7" r="2.5" />
      <circle cx="16" cy="8" r="2" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M14 20c0-2 1.5-3.5 4-3.5s3.5 1 3.5 3.5" />
    </template>
    <template v-else-if="name === 'criminal'">
      <rect x="5" y="11" width="14" height="10" rx="1" />
      <path d="M8 11V8a4 4 0 018 0v3" />
      <circle cx="12" cy="16" r="1.5" />
    </template>
    <template v-else-if="name === 'tax'">
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8M8 12h5M8 16h8" />
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="8" />
    </template>
  </svg>
</template>
