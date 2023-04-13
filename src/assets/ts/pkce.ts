import axios from 'axios';
import { access } from "./access";
import { env } from "./env";
import cryptoRandomString from 'crypto-random-string';
import { sha256 } from 'crypto-hash';
import { base64url } from 'rfc4648';



async function generateCodeVerifier() {
    const codeVerifier = cryptoRandomString({ length: 128 });
    const codeChallenge = base64url(await sha256(codeVerifier));
    window.localStorage.setItem("code_verifier", codeVerifier);
    
    console.log(codeVerifier);
    console.log(    window.localStorage.getItem("code_verifier")    )
    // fs.writeFileSync('/codeVerifier.txt', codeVerifier);
    access.code_challenge = codeChallenge;
}
 
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.message === 'Network Error' && error.request.status === 0 && error.request.responseURL === '') {
    console.log(error);
    // window.location.href = error.response.request.responseURL;       
  } 
  return Promise.reject(error);
});

  
  const pkce = () => {
    generateCodeVerifier();
    if (document.referrer != "" ) {
      access.redirect_uri = document.referrer
    } else if (document.domain = "localhost") {
      access.redirect_uri = env.redirectUrl
    } else {
      access.redirect_uri = window.location.origin
    } 
    
    const pkceOption = {
        baseURL: env.authUrl,
        url: "oauth2/authorize",
        method: "POST",
        data: {
          response_type: "code",
          code_challenge_method: "S256",
          code_challenge: access.code_challenge,
          redirect_uri: access.redirect_uri,
          scope: "openid",
          client_id: "spring"
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }, 
        withCredentials: true, 
        maxRedirects: 0    
        // validateStatus: function (status) {
        //   return status >= 200 && status < 500; // default
        // },                
      }
      axios(pkceOption).catch(function (error) {
        if (error.response.status === 404 && error.response.request.responseURL) {
          // handle redirect 404 error
          window.location.href = error.response.request.responseURL;       
        } else {
          // handle other errors
          console.error(error);
        }
      })
  }


  export { pkce }