import { reactive, ref} from 'vue'

// const access_token = ref('');

export const access = reactive(
{
    access_token: "",
    expires_in: 0,
    update(token:string, expires_in:number) {
      this.access_token = token;
      this.expires_in = expires_in;
    }
})