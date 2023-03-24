import axios from "axios";
import { env } from "./env";
import { access } from '~/assets/ts/access';
// const attestation:AttestationConveyancePreference = "direct";
import * as webauthnJson from "@github/webauthn-json";
import { visible } from "./visible";
import { ElNotification } from 'element-plus';

// import base64js from '~/assets/js/base64js.min';

const webauthnRegister = () => {
    if (access.username.length > 0) {
        const registerOption = {
            baseURL: env.authUrl,
            url: "/register",
            method: "POST",
            data: {
                username: access.username,
                display: access.username,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            withCredentials: true                        
        }
        axios(registerOption).then(async function (response) {
            const publicKeyCredential = await webauthnJson.create(response.data);
            const option = {
                baseURL: env.authUrl,
                url: "/finishauth",
                method: "POST",
                data: {
                    credname: access.username,
                    username: access.username,
                    credential: JSON.stringify(publicKeyCredential),
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }, 
                withCredentials: true                        
            
            }
            axios(option).then(function (response) {
                if(response.data = 200) {
                    ElNotification({
                        title: 'Register success',
                        message: 'have fun with login',
                        duration: 5000,
                      })
                }
            });
        });
    }
}
async function  webauthnLogin() {
    if (access.username.length > 0) {
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
            const publicKeyCredential = await webauthnJson.get(response.data);
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
               visible.webauthnFormVisible = false
               window.location.href=env.authUrl+"/oauth2/authorization/spring";
            });
        })
    }
}

export { webauthnLogin, webauthnRegister}


