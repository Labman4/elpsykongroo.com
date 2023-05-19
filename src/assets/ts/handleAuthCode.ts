import { access } from "./access";
import { axios, countDown } from "./axio";
import { toggleDark } from "~/composables";
import { env } from "./env";
import jwt_decode from "jwt-decode";

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
          access.id_token = response.data.id_token;
          access.update(response.data.access_token, response.data.expires_in);
          const decoded = jwt_decode(access.id_token);
          const jwtString = (JSON.stringify(decoded));
          const jwt = JSON.parse(jwtString);
          access.permission = jwt["permission"]
          access.sub = jwt["sub"]
          access.email_verified = jwt["email_verified"]
          toggleDark();
          countDown();
        }
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

async function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

  (function access () {
    getAccessToken ()
  })()

  function getAccessToken () {
    var key = handleCookie();
    if (key.length > 0) {
      key = atob(key.split("|")[0]);
      const tokenOption = {
        baseURL: env.authUrl,
        url: "/access",
        method: "GET",
        params: {
          key: key
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },   
        withCredentials: true                  
      }
      axios(tokenOption).then(function (response) {
        if(response.data.at != "") {
          access.update(response.data.at, 1200);
          access.refresh_token = response.data.rt;
          access.id_token = response.data.it;
          access.sub = response.data.u;
          const decoded = jwt_decode(access.id_token);
          const jwtString = (JSON.stringify(decoded));
          const jwt = JSON.parse(jwtString);
          access.permission = jwt["permission"]
          access.email_verified = jwt["email_verified"]
          toggleDark();
          countDown();
        }
      }).catch()
    }
  }

  if (code != null && state == null) {
    pkceCode();
    // window.location.href = env.redirectUrl;
  }
 

export { code, pkceCode, handleCookie, deleteCookie, getAccessToken }


