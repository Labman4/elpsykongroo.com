import '~/assets/js/live2d/live2d.min';
import '~/assets/js/live2d/live2dcubismcore';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display-labman4';
import { visible } from './visible';


// import { HitAreaFrames } from 'pixi-live2d-display/extra';

(window as any).PIXI = PIXI;

const app = new PIXI.Application({
    view: document.getElementById('Kurisu') as HTMLCanvasElement,
    autoStart: true,
    // width: window.innerWidth/2,
    // height: window.innerHeight/2,
    resizeTo: window,
    backgroundAlpha: 0,
});

const Rintaro_URL = "/Rintaro/Rintaro.model3.json";
const Christina_URL = "/Christina/Christina.model3.json";
const Mayuri_URL = "/Mayuri/Mayuri.model3.json";
load();
let models;
async function load() {
    models = await Promise.all([
    Live2DModel.from(Christina_URL),
    Live2DModel.from(Rintaro_URL),
    Live2DModel.from(Mayuri_URL),
    ]);
    models.forEach((model) => {
        app.stage.addChild(model);

        // resize();

        // fit the window
        const scaleX = (innerWidth * 0.4) / model.width;
        const scaleY = (innerHeight * 0.8) / model.height;

        // fit the window
        model.scale.set(Math.min(scaleX, scaleY));

        model.y = innerHeight * 0.1;
        // model[0].anchor.set(0.5, 0.5);
        // draggable(model);
        model.on('pointertap', () => {
            models[0].motion('tap')
        });
        model.on('pointerleave', () => {
            models[0].motion('Idle')
        });
        model.on('pointertap', () => {
            models[0].motion('tap')
        });
        model.on('pointerupoutside', () => {
            models[0].motion('pose')
        });
    })
    const Mayuri = models[2];
    const Rintaro = models[1];
    const Christina = models[0];

    Christina.x = (innerWidth - Mayuri.width - Rintaro.width- Christina.width) / 3;
    Rintaro.x =  Christina.x + Christina.width;
    Mayuri.x = Rintaro.x + Rintaro.width;
    draggable(models[0]);
    // const hit = new HitAreaFrames();
    // models[0].addChild(hit);
    // hit.visible = true;

    models[0].on('pointertap', () => {
        models[0].motion('tap')
    });
}

// app.renderer.view.style.position = 'absolute';
// app.renderer.view.style.left = '25%';
// app.renderer.view.style.top = '6.8%';


var scaleInit;
// 
var store = {
    originScale: 1,
    scale: 1,
    pageX: 0,
    pageY: 0,
    pageX2: 0, 
    pageY2: 0
};

document.addEventListener('touchstart', function (event) {
    var touches = event.touches;
    var events = touches[0];
    var events2 = touches[1];
    // event.preventDefault();
    // 第一个触摸点的坐标
    store.pageX = events.pageX;
    store.pageY = events.pageY;
    if (events2 != undefined) {
        store.pageX2 = events2.pageX;
        store.pageY2 = events2.pageY;
    }
    store.originScale = store.scale || 1;
});

document.addEventListener('touchmove', function (event) {
    // event.preventDefault();
    var touches = event.touches;

    var events = touches[0];
    var events2 = touches[1];

        // 双指移动
    if (events2 !=undefined) {
        // 第2个指头坐标在touchmove时候获取
        if (!store.pageX2) {
            store.pageX2 = events2.pageX;
        }
        if (!store.pageY2) {
            store.pageY2 = events2.pageY;
        }

        // 获取坐标之间的举例
        var getDistance = function (start, stop) {
            return Math.hypot(stop.x - start.x, stop.y - start.y);
        };
        // 双指缩放比例计算
        var zoom = getDistance({
            x: events.pageX,
            y: events.pageY
        }, {
            x: events2.pageX,
            y: events2.pageY
        }) /
        getDistance({
            x: store.pageX,
            y: store.pageY
        }, {
            x: store.pageX2,
            y: store.pageY2
        });
        // 应用在元素上的缩放比例
        var newScale = store.originScale * zoom;
    
        // 记住使用的缩放值
        store.scale = newScale;
        // 图像应用缩放效果
        models[0].scale.set(store.scale);
    }

    });

function resize(models) {
    if (window.innerWidth < window.innerHeight) {
        // app.renderer.resize(window.innerWidth, window.innerHeight + (((((window.innerWidth * 100) / window.innerHeight) / 100) - 0.5) * window.innerWidth)); 
        scaleInit = 0.3;
    } else {
        // app.renderer.resize(window.innerWidth, window.innerHeight - (((((window.innerHeight * 100) / window.innerWidth) / 100) - 0.65) * window.innerWidth));
        scaleInit = 0.8;
    }
    if (models[0].scale && models[1].scale) {
        models[0].scale.set(scaleInit);
        models[1].scale.set(scaleInit);
    }
    // app.renderer.resize(window.innerWidth/2, window.innerHeight/2);
}

window.onresize = function() {
    resize(models);
    visible.width = window.innerWidth;
};

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
