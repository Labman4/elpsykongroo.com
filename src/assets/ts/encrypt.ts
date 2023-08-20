async function generateSHA256ByInput(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return await crypto.subtle.digest('SHA-256', data);
}
  
async function computeFileSHA256(file:ArrayBuffer) {
    const arraybuffer = new Uint8Array(file);
    const hashBuffer = await crypto.subtle.digest('SHA-256', arraybuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function arrayBufferToBase64(arrayBuffer) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return base64;
}
  
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray.buffer;
}

async function generateFixedKey(text) {
    const keyData = await generateSHA256ByInput(text);
    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
    return key;
}
  
async function encryptData(data, text) {
    const key = await generateFixedKey(text);
    const encoder = new TextEncoder();
    const plaintextData = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptionParams = {
        name: 'AES-GCM',
        iv: iv,
    };
    const encryptedData = await crypto.subtle.encrypt(
        encryptionParams,
        key,
        plaintextData
    );
    return {
        ciphertext: arrayBufferToBase64(encryptedData),
        iv: arrayBufferToBase64(iv)
    };
}
  
async function encryptDataCombineIv(data, text) {
    const key = await generateFixedKey(text);
    const plaintextData = new Uint8Array(data);
    console.log("before encrypt", plaintextData.length)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const params = {
        name: 'AES-GCM',
        iv: iv,
    };
    const encryptedData = await crypto.subtle.encrypt(
        params,
        key,
        plaintextData
    );
    console.log("after encrypt", encryptedData.byteLength)

    // if (first == 0) {
        const result = new Uint8Array(iv.length + encryptedData.byteLength);
        result.set(iv);
        result.set(new Uint8Array(encryptedData), iv.length);
        console.log("after add iv", result.length)
        return {
            cipher: result,
            ciphertext: result.slice(0, result.length - 16),
            tag: result.slice(result.length-16, result.length)
        };
    // } else {
    //     return {
    //         cipher: encryptedData,
    //         ciphertext: encryptedData.slice(0, encryptedData.byteLength -16),
    //         tag: encryptedData.slice(encryptedData.byteLength - 16, encryptedData.byteLength)
    //     };    
    // }  
}

async function decryptData(ciphertext, iv, text) {
    const key = await generateFixedKey(text);
    const decryptionParams = {
        name: 'AES-GCM',
        iv: base64ToArrayBuffer(iv),
    };
    const decryptedData = await crypto.subtle.decrypt(
        decryptionParams,
        key,
        base64ToArrayBuffer(ciphertext)
    );
    return new TextDecoder().decode(decryptedData);
}
  
async function decryptDataWithoutIv(encryptedData, text) {
  const key = await generateFixedKey(text);
  const iv = encryptedData.slice(0, 12);    
  const ciphertext = encryptedData.slice(12);
  const decryptedData = await window.crypto.subtle.decrypt(    
    {name: 'AES-GCM', iv },
    key,
    ciphertext)     
    return decryptedData;
}

export { encryptData, decryptData, computeFileSHA256, encryptDataCombineIv, decryptDataWithoutIv }