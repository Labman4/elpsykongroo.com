<template>
    <div>
        <iframe src="https://dashboard.elpsykongroo.com"  
                scrolling="no" 
                frameborder="0" 
                :style="{width:'100%',height: GetWindowHeight}"
                >
        </iframe>
    </div>
</template>

<script lang="ts" setup>
  const GetWindowHeight = window.innerHeight + "px";
  // window.addEventListener('message', (event) => {
  // // if (event.origin !== 'https://elpsykongroo.com') return;
  // if (event.source!= null) {
  //   event.source.postMessage('succeeded', event.origin);
  // }
// });
</script>