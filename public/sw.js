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

// let CompleteContentLength

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes("&X-Amz-Expires")) {
    const chunkPart = 5 * 1024 * 1024;
    const chunkSize = chunkPart + 28;
    const rangeHeader = event.request.headers.get('Range');
    let currentRequest
    // let size
    // let startOffset
    // let start = parseRangeHeader(rangeHeader);
    //if (rangeHeader) {
      // startOffset = Math.floor(start / chunkPart);
      // if (start != startOffset * chunkPart) {
      //     start = startOffset * chunkPart;
      // }
      // const newRequest = new Request(event.request);
      // if (CompleteContentLength) {
      //   size = Math.ceil(CompleteContentLength / chunkPart)
      //   if (size -1 != startOffset ) {
      //     console.log(1)
      //     newRequest.headers.set('Range', 'bytes=' + start + '-' + (startOffset + 1) * chunkPart);
      //   } else {
      //     console.log(3)
      //     newRequest.headers.set('Range', "bytes=" + start + "-" + CompleteContentLength -1);
      //   }
      // } else {
      //   console.log(2)
      //   newRequest.headers.set('Range', "bytes=" + start + "-" + (startOffset + 1) * chunkPart);
      // }
      // console.log(newRequest.headers.get("Range"))
      // currentRequest = new Request(event.request, {
      //   headers: newRequest.headers,
      // });
    //}
    if (!currentRequest) {
      currentRequest = new Request(event.request)
    }

    event.respondWith(
      fetch(currentRequest, { mode: 'cors', credentials: "same-origin" })
        .then(async (response) => {
          const url = new URL(event.request.url);
          const fileKey = url.pathname.slice(1).split("/")[1];
          const db = await openDB('s3', 1, ['s3', 'aes']);
          const key = await getObject(db, "aes", "key-" + decodeURIComponent(fileKey), "readwrite", "");
          if (!key || !response.body || typeof response.body.getReader !== 'function') {
            return response;
          } else {
            let result = new Uint8Array(0)
            const reader = response.body.getReader();
            let etag = response.headers.get('ETag')
            // let contentLength = response.headers.get('Content-Length')
            // let contentRanges = response.headers.get('Content-Range')
            // if (rangeHeader) {
            //   startOffset = Math.floor(start / chunkPart);
            //   if (CompleteContentLength) {
            //     size = Math.ceil(CompleteContentLength / chunkPart)
            //   } else {
            //     size = Math.ceil(contentLength / chunkPart)
            //   }
            //   contentLength = contentLength - size * 28
            //   if (start == 0) {
            //     CompleteContentLength = contentLength
            //   }
            //   if (startOffset == 0 ) {
            //     contentRanges = "bytes " + start + "-" + (CompleteContentLength - 1) + "/" + CompleteContentLength;
            //   }
            //   else if (startOffset != size - 1 ) {                              
            //     contentRanges = "bytes " + start + "-" + ((startOffset + 1) * chunkPart -1 ) + "/" + CompleteContentLength;
            //   } else {
            //     contentRanges = "bytes " + start + "-" + (CompleteContentLength - 1) + "/" + CompleteContentLength;
            //   };
            //   // console.log(contentRanges)
            // }
            let buffer = new Uint8Array(chunkSize);
            let offset = 0
            async function processBuffer() {
              // Handle decryption logic for the entire buffer
              const dataToDecrypt = buffer.subarray(0, offset);
              const decryptedData = await decryptData(dataToDecrypt, key, decodeURIComponent(fileKey), "AES-GCM");
              result = concatenateArrays(result, new Uint8Array(decryptedData));
              // Clear the buffer and reset the offset
              buffer.fill(0); // You may want to clear the buffer content if needed
              offset = 0;
            }
            let headers = new Headers()
            headers.set("Connection", "keep-alive")
            headers.set("Content-Type","binary/octet-stream")
            // headers.set("Accept-Ranges", "bytes")
            const transform = async ({ done, value }) => {
              if (done) {
                // If there's any remaining data in the buffer, process it
                if (offset >= 0) {
                  await processBuffer();
                }
                return;
              }
              const chunkData = new Uint8Array(value);
              let remainingSpace = buffer.byteLength - offset;
              if (chunkData.byteLength <= remainingSpace) {
                // There is enough space in the buffer to accommodate the entire chunk
                buffer.set(chunkData, offset);
                offset += chunkData.byteLength;
              } else {
                // Fill the buffer to its capacity
                buffer.set(chunkData.subarray(0, remainingSpace), offset);
                offset = buffer.byteLength;
                // Process the filled buffer
                await processBuffer();
                // Place the remaining data in a new buffer at the beginning
                buffer.set(chunkData.subarray(remainingSpace), 0);
                offset = chunkData.byteLength - remainingSpace;
              }
              return reader.read().then(transform);
            }
            let status
            await reader.read().then(transform);
            if (rangeHeader) {
              // headers.set("Content-Range", contentRanges)
              headers.set("Content-Length", result.length)
              headers.set("ETag", etag)
              status = 200
            } else {
              headers.set("Content-Length", result.length)
            }
            console.log(result)
            return new Response(result, {
              status: status,
              statusText: response.statusText,
              headers: headers,
            });  
          }    
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          return new Response(null, { status: 500, statusText: 'Internal Server Error' });
        })
    );
  }
});

function concatenateArrays(arr1, arr2) {
  const result = new Uint8Array(arr1.length + arr2.length);
  result.set(arr1, 0);
  result.set(arr2, arr1.length);
  return result;
}

async function decryptData(ciphertext, key, fileKey, algorithm) {
  let iv
  if (algorithm == "AES-GCM") {
      iv = ciphertext.slice(0, 12);
      ciphertext = ciphertext.slice(12, ciphertext.length)
  } else {
      iv = ciphertext.slice(0, 16);
      ciphertext = ciphertext.slice(16, ciphertext.length)
  }

  let decryptionParams = {
      name: algorithm,
      iv: iv,
  };
  let decryptData
  try {
      decryptData = await crypto.subtle.decrypt(
          decryptionParams,
          key,
          ciphertext
      )
  } catch (error){
      console.log(error)
      const db = await openDB('s3', 1, ['s3', 'aes']);
      await deleteObject(db, "aes", "key-" + fileKey, "readwrite");
      return new Uint8Array(0)
  }  
  return decryptData
}

// function parseRangeHeader(rangeHeader) {
//   if (!rangeHeader) {
//     return 0; // Default to start from the beginning if no range is specified
//   }

//   const matches = rangeHeader.match(/bytes=(\d+)-(\d+)?/);

//   if (!matches) {
//     return 0; // Invalid or unsupported range format
//   }

//   const start = parseInt(matches[1], 10);
//   // const end = matches[2] ? parseInt(matches[2], 10) : null;

//   return start;
// }

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
  }
});