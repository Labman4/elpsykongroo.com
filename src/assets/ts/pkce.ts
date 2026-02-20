import { access } from "./access";
import { env } from "./env";
import { axios } from './axio';
import jsSHA from 'jssha';

async function generateCodeVerifier() {
    const codeVerifier = "841aa35355d86c55c1a948831ab90f23f80f71c65a08feb0dc4830a066fd55d36422c464bc58128edecf2f0bf5e0baadfda1168f8cb5883bd8ff6745454afe8b";
    // const codeVerifier = cryptoRandomString({ length: 128 });
    var base64Str = btoa(codeVerifier); // 编码为base64字符串
    // console.log(window.sessionStorage.getItem("code_verifier")    )
    // fs.writeFileSync('/codeVerifier.txt', codeVerifier);
    const sha256 = new jsSHA("SHA-256", "TEXT");
    sha256.update(base64Str);
    var codeChallenge = sha256.getHash("B64");
    codeChallenge = codeChallenge.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return codeChallenge;
}

async function pkce (code_challenge) {
    if (code_challenge == "" || code_challenge == null) {
       code_challenge = await generateCodeVerifier();
    }
    // if (document.domain == "localhost") {
    //   access.redirect_uri = env.redirectUrl
    // } else if (document.referrer != "" ) {
    //   access.redirect_uri = document.referrer
    // } else {
    //   access.redirect_uri = window.location.origin
    // } 
    const pkceOption = {
        baseURL: env.authUrl,
        url: "oauth2/authorize",
        method: "GET",
        params: {
          response_type: "code",
          code_challenge_method: "S256",
          code_challenge: code_challenge,
          redirect_uri: env.redirectAppUrl,
          scope: "openid permission",
          client_id: "app"
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
    
      axios(pkceOption).then(function (response){
        console.log(response.request.responseURL)
        // window.location.href = response.request.responseURL
      }).catch(function(error) {
        console.log(error)
    })
  }

  async function openaiPkce (code_challenge) {
    await generateCodeVerifier();
    const pkceOption = {
        baseURL: "https://auth0.openai.com",
        url: "authorize",
        method: "GET",
        params: {
          audience: "https://api.openai.com",
          response_type: "code",
          code_challenge_method: "S256",
          code_challenge: code_challenge,
          redirect_uri: "com.openai.chat://auth0.openai.com/ios/com.openai.chat/",
          scope: "openid email offline_access model.request model.read organization.read offline",
          client_id: "pdlLIX2Y72MIl2rhLhTE9VV9bN905kBh",
          prompt: "login"
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
      const loginUrl ="https://auth0.openai.com/authorize?client_id=pdlLIX2Y72MIl2rhLhTE9VV9bN905kBh\u0026audience=https%3A%2F%2Fapi.openai.com%2Fv1\u0026redirect_uri=com.openai.chat%3A%2F%2Fauth0.openai.com%2Fios%2Fcom.openai.chat%2Fcallback\u0026scope=openid%20email%20profile%20offline_access%20model.request%20model.read%20organization.read%20offline\u0026response_type=code\u0026code_challenge=" +  code_challenge + "\u0026code_challenge_method=S256\u0026prompt=login"

      const openaiLogin = "https://auth0.openai.com/authorize?client_id=pdlLIX2Y72MIl2rhLhTE9VV9bN905kBh" + 
      // "&audience=https%3A%2F%2Fapi.openai.com%2Fv1&redirect_uri=com.openai.chat%3A%2F%2Fauth0.openai.com%2Fios%2Fcom.openai.chat%2Fcallback" +
      // "&scope=openid%20email%20profile%20offline_access%20model.request%20model.read%20organization.read%20offline" +
      "&response_type=code&code_challenge_method=S256" + "&prompt=login"
      "&code_challenge=" + code_challenge 
       window.location.href = loginUrl
      // axios.get(loginUrl).then(function (response){
      //   const redirectUrl = window.location.href;
      //   console.log(redirectUrl)
      //   const code = new URL(redirectUrl).searchParams.get('code');
      //   openaiPkceCode(code);
      //   // window.location.href = response.request.responseURL
      // }).catch(function (error) {
      //   if (error.response.status === 404 && error.response.request.responseURL) {
      //     // handle redirect 404 error
      //     window.location.href = error.response.request.responseURL;       
      //   }
      // })
  }

  export { pkce, openaiPkce }