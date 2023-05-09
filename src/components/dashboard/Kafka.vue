<template>
    <div>
        <iframe src="https://akhq.elpsykongroo.com"  scrolling="no" frameborder="0" :style="{width:'100%',height: GetWindowHeight}"></iframe>
    </div>
</template>

<script lang="ts" setup>
  const GetWindowHeight = window.innerHeight + "px";

</script>