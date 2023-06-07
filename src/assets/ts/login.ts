import { access } from '~/assets/ts/access';
import { pkce } from '~/assets/ts/pkce';
import axios from "axios";
import { env } from "~/assets/ts/env";
// const attestation:AttestationConveyancePreference = "direct";
import * as webauthnJson from "@github/webauthn-json";
import { visible } from "~/assets/ts/visible";
import { ElMessage, ElNotification } from 'element-plus';
import { deleteCookie, handleCookie, getAccessToken } from './handleAuthCode';
import { toggleDark } from '~/composables';
import jwt_decode from "jwt-decode";

let checkId;

const qrcodeLogin = () => {
    clearInterval(checkId);
    visible.qrcode = true
    const option = {
        baseURL: env.authUrl,
        url: "/qrcode",
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },   
    }
    axios(option).then(async function(response){
      access.code_verifier = response.data.split("*")[0]
      access.qrcodeUrl = env.authUrl + "/login/qrcode?text=" + response.data
      check();
    });
}

const check = () => {
  var count = 0;
  checkId = window.setInterval(() => {
    count ++
    if(qrcodeCheck()) {
      clearInterval(checkId);
    }
    if(count == 30) {
      clearInterval(checkId);
    }
  }, 10000)
}

const qrcodeCheck = () => {
    const option = {
        baseURL: env.apiUrl,
        url: "/token/qrcode",
        method: "POST",
        data: {
          "text": access.code_verifier
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },   
    }
    axios(option).then(async function(response){
      if (response.data.length > 0) {
        var tokens = response.data.split("&&")
        access.access_token = tokens[0];
        access.id_token = tokens[1];
        const decoded = jwt_decode(access.id_token);
        const jwtString = (JSON.stringify(decoded));
        const jwt = JSON.parse(jwtString);
        access.permission = jwt["permission"]
        access.sub = jwt["sub"]
        access.email_verified = jwt["email_verified"]
        access.client_id = jwt["azp"]
        loginWithToken();
        visible.qrcode = false;
      }
    });
    if (access.sub != "") {
      return true
    }
}

const loginWithToken = () => {
    clearInterval(checkId);
    visible.qrcode = true
    const option = {
        baseURL: env.authUrl,
        url: "/login/token",
        method: "POST",
        data: {
          token: access.access_token,
          idToken: access.id_token
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        withCredentials: true                        
    }
    axios(option).then(async function(response){
        if (access.sub == "admin") {
            window.location.href = "https://pkce.elpsykongroo.com/oauth2/start?rd=https://elpsykongroo.com";
        } else {
            window.location.href = "https://oauth2-proxy.elpsykongroo.com/oauth2/start?rd=https://elpsykongroo.com";
        }
    });
}

const callbackUrl = window.location.href;
const redirect = new URL(callbackUrl).searchParams.get('redirect_uri');
const state = new URL(callbackUrl).searchParams.get('state');
const username = new URL(callbackUrl).searchParams.get('username');

const referrer = document.referrer;
var idp;

if (referrer != "" && referrer != undefined) {   
    idp = referrer.split(".")[0].split("//")[1];
    if (idp != "elpsykongroo" && idp != "auth" && document.domain != "localhost" && document.domain != "127.0.0.1") {
        visible.webauthnFormVisible = true
    }
}

if (redirect != null && state != null) {
    visible.webauthnFormVisible = true
}

if (username != null && username != undefined) {
    access.sub = ""
    access.username = username
    webauthnLogin()
}

const webauthnRegister = () => {
    if (access.username.length > 0) {
        visible.loading = true;
        const registerOption = {
            baseURL: env.authUrl,
            url: "/register",
            method: "POST",
            data: {
                username: access.username,
                display: access.username,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // "Access-Control-Allow-Origin": "*",
                // "Access-Control-Allow-Credentials": "true"
            },
            // withCredentials: true                        
        }
        axios(registerOption).then(async function (response) {
            if (response.data == 409) {
                ElMessageBox.alert("the user already exist")
                visible.loading = false; 
                return;
            }
            const publicKeyCredential = await webauthnJson.create(response.data);
            finishauth(publicKeyCredential)
        });
    }
}

const finishauth = (publicKeyCredential) => {
    const option = {
        baseURL: env.authUrl,
        url: "/finishAuth",
        method: "POST",
        data: {
            credname: access.username,
            username: access.username,
            credential: JSON.stringify(publicKeyCredential),
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Credentials": "true"
        }, 
        // withCredentials: true                        
    }
    axios(option).then(function (response) {
        visible.loading = false;
        if (response.data == 200) {
            ElNotification({
                title: 'Register success',
                message: 'have fun with login',
                duration: 5000,
            })
        } else {
          ElNotification({
                title: 'Register failed',
                message: 'this user already exist',
                duration: 5000,
          })
        }
    });
}

async function webauthnLogin() {
    if (access.username.length > 0) {
        visible.loading = true;
        const loginOption = {
            baseURL: env.authUrl,
            url: "/login",
            method: "POST",
            data: {
                username: access.username,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            withCredentials: true               
        }
        axios(loginOption).then(async function (response) {
            if(response.data == 200) {
                if(handleCookie().length == 0) {
                    refreshlogin();
                } else {
                    getAccessToken();
                    visible.loading = false;
                    visible.webauthnFormVisible = false;
                }
            } else if(response.data == 202) {
                ElMessageBox.alert("already login with other user")
                visible.loading = false;
            } else if(response.data == 400) {
                ElMessageBox.alert("you need a authenticator, please check your email to add")
                visible.loading = false;
            } else if(response.data == 401) {
                ElMessageBox.alert("your account may be locked")
                visible.loading = false;
            } else if(response.data == 404) {
                ElMessageBox.alert("the user is not exist")
                visible.loading = false;
            } else {    
                var publicKeyCredential;
                publicKeyCredential = await webauthnJson.get(response.data).catch((error) => {console.log(error)});
                if (publicKeyCredential != null) {
                    const indexOption = {
                        baseURL: env.authUrl,
                        url: "/welcome",
                        method: "POST",
                        data: {
                            username: access.username,
                            credential: JSON.stringify(publicKeyCredential),
                        },
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },   
                        withCredentials: true      
                    }
                    axios(indexOption).then(function (response) {
                        if(response.data == 200) {
                            visible.loading = false;
                            visible.webauthnFormVisible = false
                            console.log(idp)
                            if (idp == undefined || idp == "elpsykongroo" || idp == "labroom") {
                                if (document.domain != "localhost") {
                                    if (access.username == "admin") {
                                        window.location.href = "https://pkce.elpsykongroo.com/oauth2/start?rd=https://elpsykongroo.com";
                                    } else {
                                        window.location.href = "https://oauth2-proxy.elpsykongroo.com/oauth2/start?rd=https://elpsykongroo.com";
                                    }
                                } else {
                                    pkce();
                                }                          
                            } else if (redirect != null && state != null) {
                                window.location.href = env.authUrl + "/oauth2/authorize" + window.location.search;
                            }
                            // else if (idp != "") {
                            //     window.location.href=env.authUrl+"/oauth2/authorization/" + idp;
                            // } 
                        } else if(response.data == 401) { 
                            ElMessageBox.alert("authentication failed")
                        } else {
                            window.location.href = response.data;
                        }
                    });
                } else {
                    visible.tmpLogin = true
                }
            }
        })
    }
}

const refreshlogin = () => {
    if (document.domain != "localhost") {
        window.location.href = "https://oauth2-proxy.elpsykongroo.com/oauth2/start?rd=https://elpsykongroo.com";
    } else {
        pkce();
    }
}

const tmpLogin = () => {
    visible.tmpLogin = false
    const option = {
        baseURL: env.authUrl,
        url: "/email/tmp",
        method: "POST",
        data: {
            username: access.username,
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },   
    }
    axios(option);
}

 function logout() {
    ElMessage('you will logout in 3s');
    toggleDark();
    access.grant_type = "";
    access.expires_in = 5;
    access.sub = "";
    oidclogout();
    revoke();
    access.id_token = "";
    access.access_token = "";
    access.refresh_token = "";
    window.location.href = env.redirectUrl
}

 function revoke() {
    const option = {
        baseURL: env.authUrl,
        url: "/oauth2/revoke",
        method: "POST",
        data: {
            token: access.access_token,
            client_id: access.client_id
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }, 
        // withCredentials: true                
        // auth : { 
        //     username : "pkce", 
        //     password : "" 
        // } ,      
    }
    axios(option);
}

 function oidclogout() {
    const option = {
        baseURL: env.authUrl,
        url: "/connect/logout",
        method: "POST",
        data: {
          id_token_hint: access.id_token,
            // client_id:
          post_logout_redirect_uri: env.redirectUrl
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }, 
        withCredentials: true                
    }
    axios(option);
 }

const sessionlogout = () => {
    const option = {
        baseURL: env.authUrl,
        url: "/logout",
        method: "POST", 
        withCredentials: true                
    }
    axios(option).then(function (response) {
        access.grant_type = "";
        access.expires_in = 5;
        access.access_token = "";
        access.refresh_token = "";
        access.id_token = "";
        deleteCookie("_oauth2_proxy");
    })    
}
export { webauthnLogin, webauthnRegister, refreshlogin, logout, tmpLogin, qrcodeLogin, qrcodeCheck }