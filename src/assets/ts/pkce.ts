import { axios, countDown } from '~/assets/ts/axio';
import jsSHA from "jssha";
import { toggleDark } from "~/composables";
import { access } from "./access";
import { env } from "./env";
import { code } from "./handleAuthCode";

function generateCodeVerifier() {
    var codeVerifier = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    var charLength = characters.length;
    for (var i = 0; i < 128; i++) {
      codeVerifier += characters.charAt(Math.floor(Math.random() * charLength));
    }
    access.codeVerifier = codeVerifier;
  }
  
  function generateCodeChallenge(codeVerifier) {
    var sha256 = new jsSHA("SHA-256", "TEXT");
    sha256.update(access.codeVerifier);
    var codeChallenge = sha256.getHash("B64");
    return codeChallenge;
  }
  
  const pkce = () => {
    const pkceOption = {
        baseURL: env.authUrl,
        url: "oauth2/authorize",
        method: "POST",
        data: {
          response_type: "code",
          code_challenge_method: "S256",
          code_challenge: generateCodeChallenge(access.codeVerifier),
          redirect_uri: env.redirectUrl,
          scope: "openid",
          client_id: "spring"
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }, 
        withCredentials: true                     
      }
      axios(pkceOption).then(function (response) {
        if(response.data.access_token != "") {
          access.refresh_token = response.data.refresh_token;
          access.update(response.data.access_token, response.data.expires_in);
          toggleDark();
          // countDown();
        }
      }) 
  }


  export { pkce }