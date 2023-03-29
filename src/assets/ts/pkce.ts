import axios from 'axios';
import jsSHA from "jssha";
import { access } from "./access";
import { env } from "./env";

async function generateCodeVerifier() {
    var codeVerifier = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    var charLength = characters.length;
    for (var i = 0; i < 128; i++) {
      codeVerifier += characters.charAt(Math.floor(Math.random() * charLength));
    }
    window.localStorage.setItem("code_verifier", codeVerifier);
    
    console.log(codeVerifier);
    console.log(    window.localStorage.getItem("code_verifier")    )
    // fs.writeFileSync('/codeVerifier.txt', codeVerifier);
    const sha256 = new jsSHA("SHA-256", "TEXT");
    sha256.update(codeVerifier);
    access.code_challenge = sha256.getHash("B64");
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
    const pkceOption = {
        baseURL: env.authUrl,
        url: "oauth2/authorize",
        method: "POST",
        data: {
          response_type: "code",
          code_challenge_method: "S256",
          code_challenge: access.code_challenge,
          redirect_uri: document.referrer,
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