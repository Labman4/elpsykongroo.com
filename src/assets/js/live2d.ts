import '~/assets/live2d/js/live2d.min';
import '~/assets/live2d/js/live2dcubismcore';

// import { Application } from '@pixi/app';
// import { Ticker, TickerPlugin } from '@pixi/ticker';
// import { InteractionManager } from '@pixi/interaction';
// import { Renderer } from "pixi.js";

import './string.extensions';
import * as PIXI from 'pixi.js';
import { Live2DModel } from "pixi-live2d-display";
import "pixi-live2d-display/extra";

// Live2DModel.registerTicker(Ticker);

// Application.registerPlugin(TickerPlugin);

// Renderer.registerPlugin('interaction', InteractionManager);
// var ratio;
//   if(window.innerWidth > window.innerHeight ) {
//     ratio = window.innerWidth / window.innerHeight -1;  
//   } else {
//     ratio =window.innerHeight / window.innerWidth -1;
//   }

(window as any).PIXI = PIXI;

const app = new PIXI.Application({
    view: document.getElementById('Kurisu') as HTMLCanvasElement,
    autoStart: true,
    resizeTo: window,
    backgroundAlpha: 0,
});
    
const model = await Live2DModel.from('https://raw.githubusercontent.com/Labman4/live2d/main/%E5%86%BB%E4%BA%AC/Christina/Christina.model3.json');

app.stage.addChild(model);
    // transforms

draggable(model);
    // model.rotation = Math.PI;
    // model.skew.x = Math.PI;
    // model.scale.set(2, 2);
    // model.anchor.set(0.0005, 0.0005);



function resize() {
    if (window.innerWidth < window.innerHeight) {
        app.renderer.resize(window.innerWidth, window.innerHeight + (((((window.innerWidth * 100) / window.innerHeight) / 100) - 0.5) * window.innerWidth));  
        model.scale.set(0.3);

    } else {
        app.renderer.resize(window.innerWidth, window.innerHeight - (((((window.innerHeight * 100) / window.innerWidth) / 100) - 0.65) * window.innerWidth));
        model.scale.set(0.8);
    }
  
    const scaleX = (innerWidth * 0.4) / model.width;
    const scaleY = (innerHeight * 0.8) / model.height;
    console.log(Math.min(scaleX, scaleY));
    // model.y = innerHeight * 0.1;
}
window.onresize = function() {
    resize();
};

// (async function () {
//     const app = new PIXI.Application({
//         view: document.getElementById('Rintaro') as HTMLCanvasElement,
//         autoStart: true,
//     });
//     const model = await Live2DModel.from('https://raw.githubusercontent.com/Labman4/live2d/main/%E5%86%BB%E4%BA%AC/Christina/Christina.model3.json');
//     app.stage.addChild(model);
//     // transforms
//     const scaleX = (innerWidth * 1) / model.width;
//     const scaleY = (innerHeight * 1) / model.height;
//     // fit the window
//     model.scale.set(Math.min(scaleX, scaleY));
//     // model.y = innerHeight * 0.1;
//     // draggable(model);
//     // model.rotation = Math.PI;
//     // model.skew.x = Math.PI;
//     // model.scale.set(2, 2);
//     // model.anchor.set(0.0005, 0.0005);

//     // interaction
// })();


// (async function () {
//     const app = new PIXI.Application({
//         view: document.getElementById('Mayuri') as HTMLCanvasElement,
//         autoStart: true,
//     });
//     const model = await Live2DModel.from('https://raw.githubusercontent.com/Labman4/live2d/main/%E5%86%BB%E4%BA%AC/Christina/Christina.model3.json');
//     app.stage.addChild(model);
//     // transforms
//     const scaleX = (innerWidth * 1) / model.width;
//     const scaleY = (innerHeight * 1) / model.height;
//     // fit the window
//     model.scale.set(Math.min(scaleX, scaleY));
//     // model.y = innerHeight * 0.1;
//     // draggable(model);
//     // model.rotation = Math.PI;
//     // model.skew.x = Math.PI;
//     // model.scale.set(2, 2);
//     // model.anchor.set(0.0005, 0.0005);

//     // interaction
// })();

function draggable(model) {
    model.buttonMode = true;
    model.on("pointerdown", (e) => {
      model.dragging = true;
      model._pointerX = e.data.global.x - model.x;
      model._pointerY = e.data.global.y - model.y;
    });
    model.on("pointermove", (e) => {
      if (model.dragging) {
        model.position.x = e.data.global.x - model._pointerX;
        model.position.y = e.data.global.y - model._pointerY;
      }
    });
    model.on("pointerupoutside", () => (model.dragging = false));
    model.on("pointerup", () => (model.dragging = false));
}
