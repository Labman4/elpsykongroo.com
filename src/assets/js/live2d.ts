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

(window as any).PIXI = PIXI;

(async function () {
    const app = new PIXI.Application({
        view: document.getElementById('Kurisu') as HTMLCanvasElement,
        autoStart: true,
        resizeTo: window,
        backgroundAlpha: 0,

    });
    const model = await Live2DModel.from('https://raw.githubusercontent.com/Labman4/live2d/main/%E5%86%BB%E4%BA%AC/Christina/Christina.model3.json');
    app.stage.addChild(model);
    // transforms
    const scaleX = (innerWidth * 0.9) / model.width;
    const scaleY = (innerHeight * 0.9) / model.height;
    // fit the window
    model.scale.set(Math.min(scaleX, scaleY));
    model.x = 1000
    // model.y = innerHeight * 0.1;
    // draggable(model);
    // model.rotation = Math.PI;
    // model.skew.x = Math.PI;
    // model.scale.set(2, 2);
    // model.anchor.set(0.0005, 0.0005);

    const xs = window.matchMedia('screen and (max-width: 576px)');
    const sm = window.matchMedia('screen and (max-width: 768px)');
    const md = window.matchMedia('screen and (max-width: 992px)');

    xs.addEventListener('change', (e) => {
        if (e.matches) {
            model.scale.set(Math.min(scaleX, scaleY));
            model.x = 300;
        }
    })
    sm.addEventListener('change', (e) => {
        if (e.matches) {
            model.scale.set(Math.min(scaleX, scaleY));
            model.x = 500;
        }
    });
    md.addEventListener('change', (e) => {
        if (e.matches)    {
            model.scale.set(Math.min(scaleX, scaleY));
            model.x = 700;
        }
    });
    // interaction
})();

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
