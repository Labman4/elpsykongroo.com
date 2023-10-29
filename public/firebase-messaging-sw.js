import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

// import { initializeApp } from "firebase/app";
// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

const firebaseConfig = {
  apiKey: "AIzaSyCRthXUaRcPNWmYYq3NokfWVBRzm8uC09U",
  authDomain: "elpsykonngroo.firebaseapp.com",
  projectId: "elpsykonngroo",
  storageBucket: "elpsykonngroo.appspot.com",
  messagingSenderId: "1035237568740",
  appId: "1:1035237568740:web:75eb3c160355379a97bcf1"
};

// const firebaseApp = initializeApp(firebaseConfig);

// const messaging = getMessaging(firebaseApp);

self.skipWaiting();
clientsClaim();


// onBackgroundMessage(messaging, (payload)  => {
//   if (Notification.permission !== "granted") {
//     Notification.requestPermission().then(permission => {
//       if (permission === "granted") {
//         console.log(1)
//       }
//     });
//   } else {
//     console.log(2)
//     // const notificationTitle = payload.notification.title;
//     // const notificationOptions = {
//     //   body: payload.notification.body,
//     //   icon: "/microfavico.ico"
//     // };
//     self.clients.matchAll().then(clients => {
//       clients.forEach(client => {
//         client.postMessage("message");
//       });
//     });
//     // self.registration.showNotification(notificationTitle)
//     //   .catch(error => {
//     //     if (error.name === "NotAllowedError") {
//     //       console.log("通知权限未授予");
//     //     }
//     //   });
//     // self.registration.showNotification(notificationTitle,
//     //   notificationOptions)
//     //   .catch(error => {
//     //     if (error.name === "NotAllowedError") {
//     //       console.log("通知权限未授予");
//     //     }
//     //   });
//   }
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
// });