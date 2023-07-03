async function generateSHA256(text) {
    var keyData;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    keyData = hashBuffer.slice(0, 256 / 8); 
    return keyData;
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
    const encoder = new TextEncoder();
    const keyData = await generateSHA256(text);
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
    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decryptedData);
    return plaintext;
}
export { encryptData, decryptData }