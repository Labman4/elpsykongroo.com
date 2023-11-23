import { access } from "./access";
import { axios, countDown } from "./axio";
import { toggleDark } from "~/composables";
import { env } from "./env";
import jwt_decode from "jwt-decode";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { visible } from "./visible";
import { ElNotification } from "element-plus";

// import { registerSW } from 'virtual:pwa-register';

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


const register = async(username) => {
  if ("serviceWorker" in navigator) {
    registerSw(username);
  }
} 

const registerSw = async(username) => {
  console.log("start register")
  navigator.serviceWorker
    .register(    
      import.meta.env.VITE_PWA_MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
      { type: import.meta.env.VITE_PWA_MODE  === 'production' ? 'classic' : 'module', updateViaCache: 'none'  })
    .then((registration) => {
        if ("Notification" in window ) {
            window.Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log("notice enable")
            // navigator.serviceWorker.ready.then((registration) => {
            //   registration.showNotification("register ready");
            // });
              if ('PushManager' in window) {
                console.log("push enable")
                  getToken(messaging, {
                      vapidKey: env.publicKey,
                      serviceWorkerRegistration : registration 
                  })
                  .then((currentToken) => {
                      access.registerToken = currentToken
                      const option = {
                        baseURL: env.messageUrl,
                        url: "notice/register",
                        method: "PUT",
                        params: {
                            token: currentToken,
                            timestamp: Date.now(),
                            user: username
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,             
                      }                
                      axios(option)
                  })
              }
          }
      });
    }})
    .catch(function(error){
        console.log("register failed");
    }) 
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
  console.log(event.origin)
  console.log(event.data)

  if (typeof event.data === 'object' && event.data) {
    const message = event.data.message;
    console.log(message)
    visible.isDot = true;
  }
});

const callbackUrl = window.location.href;
const code = new URL(callbackUrl).searchParams.get('code');
const state = new URL(callbackUrl).searchParams.get('state');

if (code != null && state != null) {
    if (code.length > 20) {
       access.grant_type = 'code';
    } else {
      access.grant_type = 'github';
    }
    // dialogFormVisible.value = true
}

 function pkceCode() {
    var codeVerifier;
    codeVerifier = "841aa35355d86c55c1a948831ab90f23f80f71c65a08feb0dc4830a066fd55d36422c464bc58128edecf2f0bf5e0baadfda1168f8cb5883bd8ff6745454afe8b";
    // if (window.sessionStorage.getItem("code_verifier") != null) {
    //     codeVerifier =  window.sessionStorage.getItem("code_verifier");
    // }
    const code_verifier = btoa(codeVerifier);
    const authOption = {
        baseURL: env.authUrl,
        url: "/oauth2/token",
        method: "POST",
        data: {
          code_verifier: code_verifier,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: env.redirectUrl,
          client_id: "pkce"
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },   
        withCredentials: true                  
    }
    handleAccess(authOption)
  }

  function openaiPkceCode(code) {
    var codeVerifier;
    codeVerifier = "841aa35355d86c55c1a948831ab90f23f80f71c65a08feb0dc4830a066fd55d36422c464bc58128edecf2f0bf5e0baadfda1168f8cb5883bd8ff6745454afe8b";
    if (window.sessionStorage.getItem("code_verifier") != null) {
        codeVerifier =  window.sessionStorage.getItem("code_verifier");
    }
    const code_verifier = btoa(codeVerifier);
    const authOption = {
        baseURL: env.authUrl,
        url: "/oauth2/token",
        method: "POST",
        data: {
          code_verifier: code_verifier,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: "com.openai.chat://auth0.openai.com/ios/com.openai.chat/callback",
          client_id: "pdlLIX2Y72MIl2rhLhTE9VV9bN905kBh"
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },   
        withCredentials: true                  
    }
      axios(authOption).then(function (response) {
      }) 
  }

  const handleCookie = () => {
    var cookies = document.cookie.split(';');
    var key = "";
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf("_oauth2_proxy=") == 0) {
            key = cookie.substring("_oauth2_proxy=".length, cookie.length);
            break;
        }
    }
    return key;
  }

  const handleCsrf = () => {
    const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    return csrfToken
  }
  

  async function deleteCookie(cookieName) {
    return new Promise((resolve, reject) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      const deletedCookie = getCookie(cookieName);
      if (!deletedCookie) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }

  function getCookie(cookieName) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  }

document.addEventListener('DOMContentLoaded', async function() {
      await getAccessToken()
      await register("")
}); 
 
  async function getAccessToken () {
    var key = handleCookie();
    if (key.length > 0) {
      key = atob(key.split("|")[0]);
      const tokenOption = {
        baseURL: env.authUrl,
        url: "/access",
        method: "POST",
        data: {
          key: key
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },   
        withCredentials: true                  
      }
      return await handleAccess(tokenOption)
    } else {
      return ""
    }
  }

  const handleAccess = async(option) => {
    const jwtString = await axios(option).then(function (response) {
      let decoded
      if (response.data == undefined && response.data == "") {
          return ""
      } else if (response.data.id_token != "" && response.data.id_token != undefined ) {
        access.update(response.data.access_token, response.data.expires_in);
        decoded = jwt_decode(response.data.id_token);
        return JSON.stringify(decoded);
      } else if (response.data.at != "" && response.data.at != undefined) {
        access.refresh_token = response.data.rt;
        access.id_token = response.data.it;
        access.update(response.data.at, 1200);
        decoded = jwt_decode(access.id_token);
        return JSON.stringify(decoded)
      } else {
        return ""
      } 
    }).catch(function(error) { 
      return ""
    })
    if (jwtString != "" && jwtString != undefined) {
      const jwt = JSON.parse(jwtString);
      access.sub = jwt["sub"]
      access.permission = jwt["permission"]
      access.email_verified = jwt["email_verified"]
      access.client_id = jwt["azp"]
      access.expires_in = jwt["exp"] - jwt["iat"]
      access.update(access.access_token, access.expires_in);
      access.avatarUrl = env.storageUrl + "/storage/object?bucket=" + access.sub + "&key=" + jwt['picture'] + "&idToken=" + access.id_token;
      await register(access.sub)
      toggleDark();
      countDown();
    }
    return jwtString
  }

  if (code != null && state == null) {
    pkceCode();
    // window.location.href = env.redirectUrl;
  }
 

export { code, pkceCode, handleCookie, deleteCookie, getAccessToken, handleCsrf, register }


