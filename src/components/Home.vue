<template>
    <Clock/>
    <div class="hidden-md-and-up"> 
        <Dashboard  v-if = "access.expires_in > 0"/>
    </div>
    <canvas id="canvas"></canvas>
</template>

<script lang="ts" setup>
import {access} from '~/assets/js/access';
// import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

// (async function () {
//     const app = new PIXI.Application({
//         view: document.getElementById('canvas') as HTMLCanvasElement,
//     });

//     const model = await Live2DModel.from('../assets/live2d/leimu.model.json');

//     app.stage.addChild(model);

//     // transforms
//     model.x = 100;
//     model.y = 100;
//     model.rotation = Math.PI;
//     model.skew.x = Math.PI;
//     model.scale.set(2, 2);
//     model.anchor.set(0.5, 0.5);

//     // interaction
//     model.on('hit', (hitAreas) => {
//         if (hitAreas.includes('body')) {
//             model.motion('tap_body');
//         }
//     });
// })();
</script>
