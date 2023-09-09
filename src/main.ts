import { createApp } from "vue";
import App from "~/App.vue";
import router from '~/router/router';
import "~/styles/index.scss";
import 'uno.css'
import 'virtual:svg-icons-register'
import 'element-plus/theme-chalk/display.css';
// import { registerSW } from 'virtual:pwa-register';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { visible } from "./assets/ts/visible";
import { env } from "./assets/ts/env";
import { access } from "./assets/ts/access";
import { axios } from "./assets/ts/axio";

import { ElNotification } from "element-plus";

const app = createApp(App)
app.use(router);
app.mount("#app");

const firebaseConfig = {
    apiKey: "AIzaSyCRthXUaRcPNWmYYq3NokfWVBRzm8uC09U",
    authDomain: "elpsykonngroo.firebaseapp.com",
    projectId: "elpsykonngroo",
    storageBucket: "elpsykonngroo.appspot.com",
    messagingSenderId: "1035237568740",
    appId: "1:1035237568740:web:75eb3c160355379a97bcf1"
  };

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

if ("serviceWorker" in navigator) {
        // registerSW();
    navigator.serviceWorker
      .register(    
        import.meta.env.VITE_PWA_MODE === 'production' ? '/firebase-messaging-sw.js' : '/dev-sw.js?dev-sw',
        { type: import.meta.env.VITE_PWA_MODE  === 'production' ? 'classic' : 'module' }
      )
      .then((registration) => {
        if ("Notification" in window ) {
            window.Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                  navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification("register ready");
                  });
                
                    if ('PushManager' in window) {
                        getToken(messaging, {
                            vapidKey: env.publicKey,
                            serviceWorkerRegistration : registration 
                        })
                        .then((currentToken) => {
                            access.registerToken = currentToken                       
                            const fcmOption = {
                                baseURL: env.messageUrl,
                                url: "notice/register",
                                method: "PUT",
                                params: {
                                    token: currentToken,
                                    timestamp: Date.now(),
                                    user: access.sub
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }
                            axios(fcmOption)
                        })
                    }
                }
             });
        }
       
    });
    
  }


onMessage(messaging, (payload) => {
  console.log(payload)
  ElNotification({
    title: payload.notification?.title,
    message: payload.notification?.body,
    duration: 5000,
  })
  visible.isDot = true
});

window.addEventListener('message', function(event) {
  // 在这里处理收到的消息
  // event.data 包含了发送的数据
  // event.source 包含了发送消息的窗口或 iframe 的引用
  // event.origin 包含了消息的来源地址

  // 例如，可以检查消息来源和数据类型来确保安全性
  // if (event.origin !== 'https://example.com') {
  //   console.error('来自不受信任的来源的消息');
  //   return;
  // }

  if (typeof event.data === 'object' && event.data.message) {
    const message = event.data.message;
    visible.isDot = true;
  }
});





