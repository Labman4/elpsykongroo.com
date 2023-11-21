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


// const rangeHeader = request.headers.get('Range');
// const [start, end] = parseRangeHeader(rangeHeader);
// console.log(start)
// console.log(end)

self.addEventListener('fetch', async (event) => {
  if (event.request.url.includes("&X-Amz-Expires")) {
    event.respondWith(handleRequest(event.request));
  }
});

const handleRequest = async (request) => {
  const url = new URL(request.url);
  const fileKey = url.pathname.slice(1).split("/")[1];
  const db = await openDB('s3', 1, ['s3', 'aes']);
  const iv = await getObject(db, "aes", "iv-" + fileKey, "readwrite", "");
  const key = await getObject(db, "aes", "key-" + fileKey, "readwrite", "");
  const response = await fetch(request, { mode: 'cors', credentials: "same-origin" });
  if (key) {
    if (response.body && typeof response.body.getReader === 'function') {
      const transformedStream = decryptStream(response.body, key, iv);
      return new Response(transformedStream, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } else {
      return response;
    }
  } else {
    // console.log("fetch 2");
    return fetch(request, { mode: 'cors', credentials: "same-origin" });
  }
};

function decryptStream(cipherStream, key, iv) {
  const transformer = new TransformStream({
    async transform(chunk, controller) {
      try {
        if (key && iv) {
          console.log("start decrypt");
          const decryptedData = await crypto.subtle.decrypt(
            { name: "AES-CTR", counter: iv, length: 128 },
            key,
            chunk
          );
          controller.enqueue(decryptedData);
        } else {
          console.log("start transform");
          controller.enqueue(chunk);
        } 
      } catch (error) {
        console.log(error);
        const db = await openDB('s3', 1, ['s3', 'aes']);
        await deleteObject(db, "aes", "key-" + key, "readwrite");
      }
    }
  });

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Pipe the original cipherStream through the transformer
  cipherStream.pipeTo(transformer.writable);

  // Create a new Response object with the transformed stream and original headers
  const response = new Response(readable, {
    headers: cipherStream.headers,
  });

  // Close the writer to signal that no more data will be written
  writer.close();

  return response;
}

function parseRangeHeader(rangeHeader) {
  if (!rangeHeader) {
    return [0, null]; // Default to start from the beginning if no range is specified
  }

  const matches = rangeHeader.match(/bytes=(\d+)-(\d+)?/);

  if (!matches) {
    return [0, null]; // Invalid or unsupported range format
  }

  const start = parseInt(matches[1], 10);
  const end = matches[2] ? parseInt(matches[2], 10) : null;

  return [start, end];
}

function openDB(databaseName, version, storageName) {
  return new Promise((resolve, reject) => {
    var request;
    if (version != "") {
      request = indexedDB.open(databaseName, version);
    } else {
      request = indexedDB.open(databaseName);
    }

    request.onsuccess = function(event) {
      const db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = function(event) {
      const db = request.result;
      for (let i of storageName) {
          if (!db.objectStoreNames.contains(i)) {
              db.createObjectStore(i);
          }
      }    
  } 
    request.onerror = function(event) {
      const error = request.error;
      reject(error);
    };
  });
}

function getObject(db, storeName, key, permission, scope) {
  if (permission == "" || permission == undefined) {
      permission = "readwrite"
  }
  return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, permission);
      const objectStore = transaction.objectStore(storeName);
      var request;
      if (scope == "all") {
          request = objectStore.getAll();
      } else {
          request = objectStore.get(key);
      }
      request.onsuccess = function(event) {
          const result = request.result;
          resolve(result);
      };

      request.onerror = function(event) {
          const error = request.error;
          reject(error);
      };
  });
}

function deleteObject(db, storeName, key, permission) {
  if (permission == "" || permission == undefined) {
      permission = "readwrite"
  }
  return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, permission);
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.delete(key)
      request.onsuccess = function(event) {
          const result = request.result;
          resolve(result);
      };

      request.onerror = function(event) {
          const error = request.error;
          reject(error);
      };
  });
}


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