
const generateSHA256ByInput = async(text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return await crypto.subtle.digest('SHA-256', data);
}

async function computeFileSHA256(file:ArrayBuffer) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', file);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function arrayBufferToBase64(arrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}
  
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray.buffer;
}

async function generateFixedKey(text, algorithm) {
    let keyData
    if (typeof text == "string") {
        keyData = await generateSHA256ByInput(text)
    } else {
        keyData = text
    }
    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: algorithm },
        false,
        ['encrypt', 'decrypt']
    );
    return key;
}
 
async function encryptData(data, text, iv, algorithm) {
    let key = await generateFixedKey(text, algorithm);
    let plaintextData
    if (typeof data != "string") {
        plaintextData = data
    } else {
        const encoder = new TextEncoder();
        plaintextData = encoder.encode(data);
    }
    if (iv == null || iv == "") {
        if (algorithm == "AES-GCM") {
            iv = crypto.getRandomValues(new Uint8Array(12));
        } else {
            iv = crypto.getRandomValues(new Uint8Array(16));
        }
    }    
    let encryptionParams
    if (algorithm == "AES-CTR") {
        encryptionParams = {
            counter: iv,
            name: algorithm,
            length: 128,
        };
    } else {
        encryptionParams = {
            name: algorithm,
            iv: iv,
        };
    }
    const encryptedData = await crypto.subtle.encrypt(
        encryptionParams,
        key,
        plaintextData
    );
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);
    return {
        cipher: result.buffer,
        ciphertext: encryptedData,
        iv: iv,
        ciphertextWithoutTag: result.slice(0, result.length - 16),
        tag: result.slice(result.length-16, result.length)
    };
}

async function decryptData(ciphertext, iv, text, algorithm) {
    const key = await generateFixedKey(text, algorithm);
    if (iv == null || iv == "") {
        if (algorithm != "AES-GCM") {
            return
        } else {
            iv = ciphertext.slice(0, 12);
            ciphertext = ciphertext.slice(12, ciphertext.length)
        }
    }
    let decryptionParams = {
        name: algorithm,
        iv: iv,
    };
    return await crypto.subtle.decrypt(
        decryptionParams,
        key,
        ciphertext
    )
}


export { encryptData, decryptData, computeFileSHA256, arrayBufferToBase64, base64ToArrayBuffer, generateFixedKey }