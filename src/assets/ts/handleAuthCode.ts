import { access } from "./access";
import { axios, countDown } from "./axio";
import { toggleDark } from "~/composables";
import { env } from "./env";
import { visible } from "./visible";

const callbackUrl = window.location.href;
const code = new URL(callbackUrl).searchParams.get('code');
const state = new URL(callbackUrl).searchParams.get('state');

if (code != null && state != null) {
    if (code.length > 20) {
       access.grant_type = 'code';
      //  pkceCode();
    } else {
      access.grant_type = 'github';
    }
    // dialogFormVisible.value = true
}

 function pkceCode() {
    // const code_verifier =  fs.readFileSync('/codeVerifier.txt', "utf8");
    const code_verifier = window.localStorage.getItem("code_verifier");
    console.log(code_verifier);
    const authOption = {
        baseURL: env.authUrl,
        url: "/oauth2/token",
        method: "POST",
        data: {
          code_verifier: code_verifier,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: env.redirectUrl,
          client_id: "spring"
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

  if (code != null && state == null) {
    visible.dialogFormVisible = true
    access.grant_type = 'pkce';

}
export { code, pkceCode }


