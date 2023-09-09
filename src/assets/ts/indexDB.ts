
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

function setObject(db, storeName, key, value, permission, scope) {
    if (permission == "" || permission == undefined) {
        permission = "readwrite"
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, permission);
        const objectStore = transaction.objectStore(storeName);
        var request;
        if (scope == "put") {
            request = objectStore.put(value, key);
        } else {
            request = objectStore.add(value, key);
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
  
export {openDB, getObject, setObject, deleteObject}