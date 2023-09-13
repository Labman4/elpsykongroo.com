import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { precacheAndRoute } from 'workbox-precaching'
import { getToken } from "firebase/messaging";

precacheAndRoute(self.__WB_MANIFEST)

const firebaseConfig = {
    apiKey: "AIzaSyCRthXUaRcPNWmYYq3NokfWVBRzm8uC09U",
    authDomain: "elpsykonngroo.firebaseapp.com",
    projectId: "elpsykonngroo",
    storageBucket: "elpsykonngroo.appspot.com",
    messagingSenderId: "1035237568740",
    appId: "1:1035237568740:web:75eb3c160355379a97bcf1"
  };

const app = initializeApp(firebaseConfig);

// // // // Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app)

onBackgroundMessage(messaging, (payload)  => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log(1)
      }
    });
  } else {
    console.log(2)
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/microfavico.ico"
    };
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage("message");
      });
    });
    self.registration.showNotification(notificationTitle)
      .catch(error => {
        if (error.name === "NotAllowedError") {
          console.log("通知权限未授予");
        }
      });
    // self.registration.showNotification(notificationTitle,
    //   notificationOptions)
    //   .catch(error => {
    //     if (error.name === "NotAllowedError") {
    //       console.log("通知权限未授予");
    //     }
    //   });
  }
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here

});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();
  },
  false,
);

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});