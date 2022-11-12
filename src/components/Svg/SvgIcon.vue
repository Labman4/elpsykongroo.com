<template>
    <svg>
      <use :href="symbolId" class="nixie-number-part" />
    </svg>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue'
  const props = defineProps({
    prefix: {
      type: String,
      default: 'icon'
    },
    name: {
      type: String,
      required: true
    }
  })
  
  const symbolId = computed(() => `#${props.prefix}-${props.name}`)
  </script>
  
