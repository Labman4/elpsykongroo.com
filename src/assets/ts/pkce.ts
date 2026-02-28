import { access } from "./access";
import { env } from "./env";
import jsSHA from 'jssha';

function generateCodeVerifier(length = 64) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  let verifier = ''
  for (let i = 0; i < length; i++) {
    verifier += charset[randomValues[i] % charset.length]
  }
  return verifier
}

async function generateCodeChallenge() {
    const codeVerifier = generateCodeVerifier(64);
    window.sessionStorage.setItem("code_verifier", codeVerifier);
    const sha256 = new jsSHA("SHA-256", "TEXT");
    sha256.update(codeVerifier);
    var codeChallenge = sha256.getHash("B64");
    codeChallenge = codeChallenge.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return codeChallenge;
}

async function pkce () {
    const code_challenge = await generateCodeChallenge();
    if (document.domain == "localhost" || document.domain == "127.0.0.1") {
      access.redirect_uri = env.redirectUrl
    } else if (document.referrer != "" ) {
      access.redirect_uri = document.referrer
    } else {
      access.redirect_uri = window.location.origin;
    } 
    const params = new URLSearchParams({
      response_type: "code",
      client_id: "pkce",
      redirect_uri: access.redirect_uri,
      scope: "openid permission",
      code_challenge_method: "S256",
      code_challenge: code_challenge,
    })
    const authorizeUrl = `${env.authUrl}/oauth2/authorize?${params.toString()}`
    window.location.href = authorizeUrl;
  }

  async function pkceApp () {
    const code_challenge = window.sessionStorage.getItem("code_challenge");
    if (code_challenge != null) {
      const params = new URLSearchParams({
        response_type: "code",
        client_id: "app",
        redirect_uri: env.redirectAppUrl,
        scope: "openid permission offline_access",
        code_challenge_method: "S256",
        code_challenge: code_challenge,
      })
      const authorizeUrl = `${env.authUrl}/oauth2/authorize?${params.toString()}`
      window.location.href = authorizeUrl;
    }
  }

  async function openaiPkce () {
      const code_challenge = await generateCodeChallenge();
      const openaiLogin = "https://auth0.openai.com/authorize?client_id=pdlLIX2Y72MIl2rhLhTE9VV9bN905kBh" + 
      "&audience=https%3A%2F%2Fapi.openai.com%2Fv1&redirect_uri=com.openai.chat%3A%2F%2Fauth0.openai.com%2Fios%2Fcom.openai.chat%2Fcallback" +
      "&scope=openid%20email%20profile%20offline_access%20model.request%20model.read%20organization.read%20offline" +
      "&response_type=code&code_challenge_method=S256" + "&prompt=login"
      "&code_challenge=" + code_challenge 
       window.location.href = openaiLogin
  }

  export { pkce, pkceApp, openaiPkce }