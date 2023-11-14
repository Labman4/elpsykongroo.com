<template>
    <video ref="rVideoPlayer" controls class="video-js vjs-default-skin"></video>
  </template>
  <script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import videoJs from 'video.js'

  onMounted(() => {
    player.value = videoJs(rVideoPlayer.value as Element)
  })
  onUnmounted(() => {
  if (player.value) {
    player.value.dispose()
  }
})
  const rVideoPlayer = ref<Element>()
  let player = ref()

  const open = () => {
    if (!player.value) {
        player.value = videoJs(rVideoPlayer.value as Element)
    }
    if (player.value) {
        player.value.load()
    }
  }

  const pause = () => {
    if(player.value) {
        player.value.pause()
    }
  }
  const src = (url) => {
    if(player.value) {
        player.value.src(url)
    }
  }
  defineExpose({
    open, pause, src
})
  </script>