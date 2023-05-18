import { reactive } from 'vue'

export const access = reactive(
{
    access_token: "",
    refresh_token: "",
    id_token: "",
    expires_in: 0,
    grant_type: "",
    client_id: "",
    client_secret: "",
    username: "",
    nickname: "",
    code_verifier: "",
    code_challenge: "",
    permission: "",
    email_verified: false,
    sub: "",
    redirect_uri: "",
    update(token:string, expires_in:number) {
      this.access_token = token;
      this.expires_in = expires_in;
    }
})