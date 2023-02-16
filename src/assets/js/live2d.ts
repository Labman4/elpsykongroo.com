import '~/assets/live2d/js/live2d.min';
import '~/assets/live2d/js/live2dcubismcore';
import * as PIXI from 'pixi.js';
import { Live2DModel } from "pixi-live2d-display";

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
    // width: window.innerWidth/2,
    // height: window.innerHeight/2,
    resizeTo: window,
    backgroundAlpha: 0,
});
const model = await Live2DModel.from('https://raw.githubusercontent.com/Labman4/live2d/main/%E5%86%BB%E4%BA%AC/Christina/Christina.model3.json');
// app.renderer.view.style.position = 'absolute';
// app.renderer.view.style.left = '25%';

// app.renderer.view.style.top = '6.8%';
app.stage.addChild(model);
    resize();
    model.y = innerHeight * 0.1;
    draggable(model);

// const item = document.querySelector("#live2d");
// const hm = new Hammer(item) ;

// hm.get('pinch').set({
//     enable: true
// })

// var scaleRatio = 1;

// hm.on("pinchmove", ev =>{
//     scaleRatio = ev.scale * scaleInit
//     model.scale.set(scaleRatio);
// })

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
    event.preventDefault();
    // 第一个触摸点的坐标
    store.pageX = events.pageX;
    store.pageY = events.pageY;
    if (events2 != undefined) {
        store.pageX2 = events2.pageX;
        store.pageY2 = events2.pageY;
    }
    store.originScale = store.scale || 1;
},false);

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
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
        model.scale.set(store.scale);
    }

    }, false);

function resize() {
    if (window.innerWidth < window.innerHeight) {
        // app.renderer.resize(window.innerWidth, window.innerHeight + (((((window.innerWidth * 100) / window.innerHeight) / 100) - 0.5) * window.innerWidth)); 
        scaleInit = 0.3;
        model.scale.set(scaleInit);

    } else {
        // app.renderer.resize(window.innerWidth, window.innerHeight - (((((window.innerHeight * 100) / window.innerWidth) / 100) - 0.65) * window.innerWidth));
        scaleInit = 0.8;
        model.scale.set(scaleInit);
    }
    // app.renderer.resize(window.innerWidth/2, window.innerHeight/2);
}

window.onresize = function() {
    resize();
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

    