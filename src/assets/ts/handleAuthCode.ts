import { access } from "./access";
import { axios, countDown } from "./axio";
import { toggleDark } from "~/composables";
import { env } from "./env";

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
    // const code_verifier =  fs.readFileSync('/codeVerifier.txt', "utf8");
    var codeVerifier;
    codeVerifier = "841aa35355d86c55c1a948831ab90f23f80f71c65a08feb0dc4830a066fd55d36422c464bc58128edecf2f0bf5e0baadfda1168f8cb5883bd8ff6745454afe8b";
    if ( window.localStorage.getItem("code_verifier") != null) {
        codeVerifier =  window.localStorage.getItem("code_verifier");
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
          redirect_uri: env.redirectUrl,
          client_id: "pkce"
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },   
        withCredentials: true                  
    }
      axios(authOption).then(function (response) {
        if(response.data.access_token != "") {
          access.refresh_token = response.data.refresh_token;
          access.grant_type = "authorization_code";
          access.update(response.data.access_token, response.data.expires_in);
          // userInfo();
          toggleDark();
          countDown();
        }
      }) 
  }

  (function getAccessToken() {
    var key = "";
    console.log(document.cookie);
    var cookies = document.cookie.split(';');
    console.log(cookies);
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf("_oauth2_proxy=") == 0) {
            key = cookie.substring("_oauth2_proxy=".length, cookie.length);
            break;
        }
    }
    console.log(key);
    key = atob(key.split("|")[0])
    console.log(key);
    key = key.split(".")[0]
    console.log(key);

    const tokenOption = {
      baseURL: env.apiUrl,
      url: "/redis/get",
      method: "GET",
      params: {
        key: key
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },   
      // withCredentials: true                  
    }
    axios(tokenOption).then(function (response) {
      console.log(response);
      if(response.data.access_token != "") {
        access.update(response.data.access_token, response.data.expires_in);
        toggleDark();
        countDown();
      }
    })
  })()

  if (code != null && state == null) {
    pkceCode();
    // window.location.href = env.redirectUrl;
  }
export { code, pkceCode }


