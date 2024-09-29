import { reactive }from 'vue'

export const env = reactive(
{      
    apiUrl: import.meta.env.VITE_API_URL,
    statusUrl: import.meta.env.VITE_STATUS_URL,
    authUrl: import.meta.env.VITE_AUTH_URL,
    storageUrl: import.meta.env.VITE_STORAGE_URL,
    redirectUrl: import.meta.env.VITE_CNAME,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    oauth2ProxyPkceUrl: import.meta.env.VITE_OAUTH2_PROXY_PKCE_URL,
    oauth2ProxyUrl: import.meta.env.VITE_OAUTH2_PROXY_URL,
    pwaMode: import.meta.env.VITE_PWA_MODE,
    messageUrl: import.meta.env.VITE_MESSAGE_URL,
    publicKey: import.meta.env.VITE_PUBLIC_KEY,
    clientId: import.meta.env.VITE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_CLIENT_SECRET,
    githubUrl: import.meta.env.VITE_GITHUB_URL,
    healthCheckDuration: import.meta.env.VITE_HEALTH_CHECK_DURATION,
    vaultUrl: import.meta.env.VITE_VAULT_URL,
    vaultUser: import.meta.env.VITE_VAULT_USER,
    vaultPublicUser: import.meta.env.VITE_VAULT_PUBLIC_USER,
    vaultPass: import.meta.env.VITE_VAULT_PASS,
    wakeMac: import.meta.env.VITE_WAKE_MAC,
    peerUrl: import.meta.env.VITE_PEER_URL,
    peerServerUrl: import.meta.env.VITE_PEER_SERVER_URL,

})