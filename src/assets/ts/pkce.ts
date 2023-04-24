import { access } from "./access";
import { env } from "./env";
import cryptoRandomString from 'crypto-random-string';
import jsSHA from 'jssha';
import { axios } from "./axio";

async function generateCodeVerifier() {
    // const codeVerifier = "841aa35355d86c55c1a948831ab90f23f80f71c65a08feb0dc4830a066fd55d36422c464bc58128edecf2f0bf5e0baadfda1168f8cb5883bd8ff6745454afe8b";
    const codeVerifier = cryptoRandomString({ length: 128 });
    window.sessionStorage.setItem("code_verifier", codeVerifier);
    var base64Str = btoa(codeVerifier); // 编码为base64字符串
    // console.log(window.sessionStorage.getItem("code_verifier")    )
    // fs.writeFileSync('/codeVerifier.txt', codeVerifier);
    const sha256 = new jsSHA("SHA-256", "TEXT");
    sha256.update(base64Str);
    var codeChallenge = sha256.getHash("B64");
    codeChallenge = codeChallenge.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    access.code_challenge = codeChallenge;
}

async function pkce () {
    await generateCodeVerifier();
    if (document.domain == "localhost") {
      access.redirect_uri = env.redirectUrl
    } else if (document.referrer != "" ) {
      access.redirect_uri = document.referrer
    } else {
      access.redirect_uri = window.location.origin
    } 
    const pkceOption = {
        baseURL: env.authUrl,
        url: "oauth2/authorize",
        method: "GET",
        params: {
          response_type: "code",
          code_challenge_method: "S256",
          code_challenge: access.code_challenge,
          redirect_uri: access.redirect_uri,
          scope: "openid permission",
          client_id: "pkce"
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }, 
        // withCredentials: true, 
        maxRedirects: 0    
        // validateStatus: function (status) {
        //   return status >= 200 && status < 500; // default
        // },                
      }
    
      axios(pkceOption).then(function (response){
        window.location.href = response.request.responseURL
      }).catch(function (error) {
        if (error.response.status === 404 && error.response.request.responseURL) {
          // handle redirect 404 error
          window.location.href = error.response.request.responseURL;       
        }
      })
  }


  export { pkce }