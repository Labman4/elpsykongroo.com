import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

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

const firebaseApp = initializeApp(firebaseConfig);

const messaging = getMessaging(firebaseApp);

self.skipWaiting();
clientsClaim();

// self.addEventListener('fetch', (event) => {
//   if (event.request.url.includes("&X-Amz-Expires")) {
//     event.respondWith(
//       fetch(event.request, { mode: 'cors', credentials: "same-origin" })
//         .then(async (response) => {
//           const url = new URL(event.request.url);
//           const fileKey = url.pathname.slice(1).split("/")[1];
//           const db = await openDB('s3', 1, ['s3', 'aes']);
//           const iv = await getObject(db, "aes", "iv-" + fileKey, "readwrite", "");
//           const key = await getObject(db, "aes", "key-" + fileKey, "readwrite", "");
//           if (!key || !response.body || typeof response.body.getReader !== 'function') {
//             return response;
//           } else {
//             const reader = response.body.getReader();

//             const { readable, writable } = new TransformStream();
//             const writer = writable.getWriter();
  
//             (async () => {
//               try {
//                 while (true) {
//                   const { done, value } = await reader.read();
//                   if (done) {
//                     break;
//                   }
//                 let dataToWrite = value;
//                 if (key) {
//                   try {
//                     const decryptedData = await crypto.subtle.decrypt(
//                       {
//                         name: "AES-CTR",
//                         counter: iv,
//                         length: 128,
//                       }, 
//                       key,
//                       value
//                     );
//                     console.log(decryptedData)
  
//                     dataToWrite = decryptedData;
//                   } catch (error) {
//                     console.error(error);
//                     const db = await openDB('s3', 1, ['s3', 'aes']);
//                     await deleteObject(db, "aes", "key-" + key, "readwrite");
//                     return
//                   }
//                 }
//                 if (writer.state === "writable") {
//                   await writer.write(dataToWrite);
//                 }
//                 while (reader.desiredSize === 0) {
//                   await new Promise(resolve => setTimeout(resolve, 10));
//                 }
//                   }
//               } finally {
//                 reader.releaseLock();
//                 writer.close();
//               }
//             })();
  
//             return new Response(readable, {
//               status: response.status,
//               statusText: response.statusText,
//               headers: response.headers,
//             });
//           }
     
//         })
//         .catch((error) => {
//           console.error('Fetch error:', error);
//           return new Response(null, { status: 500, statusText: 'Internal Server Error' });
//         })
//     );
//   }
// });

// async function handleRequest(request) {
//   const rangeHeader = request.headers.get('Range');
//   const [start, end] = parseRangeHeader(rangeHeader);
//   console.log(request)
//   const url = new URL(request.url);
//   const fileKey = url.pathname.slice(1).split("/")[1];
//   const db = await openDB('s3', 1, ['s3', 'aes']);
//   const iv = await getObject(db, "aes", "iv-" + fileKey, "readwrite", "");
//   const key = await getObject(db, "aes", "key-" + fileKey, "readwrite", "");
//   return new Promise(async (resolve) => {
//       fetch(request, { mode: 'cors', credentials: "same-origin" }).then(async function(response) {
//         if (!key || !response.body || typeof response.body.getReader !== 'function') {
//           resolve(response);
//         } else {
//           console.log(2)
//           const { readable, writable } = new TransformStream({ close: false });
//           const writer = writable.getWriter();
//           // try {
//             await transform(response.body, key, iv, writer, () => {
//               const transformedResponse = new Response(readable, {
//                 status: response.status,
//                 statusText: response.statusText,
//                 headers: response.headers,
//               });
//               console.log(transformedResponse);
//               if (transformedResponse.body.getReader !== 'function') {
//                 console.log("unread")
//               }
//               resolve(transformedResponse);
//             });
//           // } finally {
//           //   writer.close();
//           // }
//         }
//       })        
//   })
// }

// async function transform(inputStream, key, iv, writer, callback) {
//   const reader = inputStream.getReader();

//   async function writeData() {
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
//       console.log(value)
//       let dataToWrite = value;
//       if (key) {
//         try {
//           const decryptedData = await crypto.subtle.decrypt(
//             {
//               name: "AES-CTR",
//               counter: iv,
//               length: 128,
//             }, 
//             key,
//             value
//           );
//           console.log(decryptedData)

//           dataToWrite = decryptedData;
//         } catch (error) {
//           console.error(error);
//           const db = await openDB('s3', 1, ['s3', 'aes']);
//           await deleteObject(db, "aes", "key-" + key, "readwrite");
//           return
//         }
//       }
//       if (writer.state === "writable") {
//         await writer.write(dataToWrite);
//       }
//       while (reader.desiredSize === 0) {
//         await new Promise(resolve => setTimeout(resolve, 10));
//       }
//     }

//     callback();
//   }

//   await writeData();
// }

// function parseRangeHeader(rangeHeader) {
//   if (!rangeHeader) {
//     return [0, null]; // Default to start from the beginning if no range is specified
//   }

//   const matches = rangeHeader.match(/bytes=(\d+)-(\d+)?/);

//   if (!matches) {
//     return [0, null]; // Invalid or unsupported range format
//   }

//   const start = parseInt(matches[1], 10);
//   const end = matches[2] ? parseInt(matches[2], 10) : null;

//   return [start, end];
// }

// function openDB(databaseName, version, storageName) {
//   return new Promise((resolve, reject) => {
//     var request;
//     if (version != "") {
//       request = indexedDB.open(databaseName, version);
//     } else {
//       request = indexedDB.open(databaseName);
//     }

//     request.onsuccess = function(event) {
//       const db = request.result;
//       resolve(db);
//     };

//     request.onupgradeneeded = function(event) {
//       const db = request.result;
//       for (let i of storageName) {
//           if (!db.objectStoreNames.contains(i)) {
//               db.createObjectStore(i);
//           }
//       }    
//   } 
//     request.onerror = function(event) {
//       const error = request.error;
//       reject(error);
//     };
//   });
// }

// function getObject(db, storeName, key, permission, scope) {
//   if (permission == "" || permission == undefined) {
//       permission = "readwrite"
//   }
//   return new Promise((resolve, reject) => {
//       const transaction = db.transaction(storeName, permission);
//       const objectStore = transaction.objectStore(storeName);
//       var request;
//       if (scope == "all") {
//           request = objectStore.getAll();
//       } else {
//           request = objectStore.get(key);
//       }
//       request.onsuccess = function(event) {
//           const result = request.result;
//           resolve(result);
//       };

//       request.onerror = function(event) {
//           const error = request.error;
//           reject(error);
//       };
//   });
// }

// function deleteObject(db, storeName, key, permission) {
//   if (permission == "" || permission == undefined) {
//       permission = "readwrite"
//   }
//   return new Promise((resolve, reject) => {
//       const transaction = db.transaction(storeName, permission);
//       const objectStore = transaction.objectStore(storeName);
//       const request = objectStore.delete(key)
//       request.onsuccess = function(event) {
//           const result = request.result;
//           resolve(result);
//       };

//       request.onerror = function(event) {
//           const error = request.error;
//           reject(error);
//       };
//   });
// }


onBackgroundMessage(messaging, (payload)  => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log(1)
      }
    });
  } else {
    console.log(2)
    // const notificationTitle = payload.notification.title;
    // const notificationOptions = {
    //   body: payload.notification.body,
    //   icon: "/microfavico.ico"
    // };
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage("message");
      });
    });
    // self.registration.showNotification(notificationTitle)
    //   .catch(error => {
    //     if (error.name === "NotAllowedError") {
    //       console.log("通知权限未授予");
    //     }
    //   });
    // self.registration.showNotification(notificationTitle,
    //   notificationOptions)
    //   .catch(error => {
    //     if (error.name === "NotAllowedError") {
    //       console.log("通知权限未授予");
    //     }
    //   });
  }
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
});