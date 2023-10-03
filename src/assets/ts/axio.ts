import axios from 'axios';
import { ElMessageBox } from 'element-plus';
import { toggleDark } from '~/composables';
import { access } from './access';
import { env } from './env';
import { handleCookie, handleCsrf } from './handleAuthCode';
import { visible } from './visible';
const timeCount= ref(0);
let csrfToken
let retry = 0;
// const source = axios.CancelToken.source();

axios.interceptors.request.use(config => {
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  config.validateStatus = function (status) {
    return status >= 200 && status < 504 && status != 401; // default
  }       
  return config;
});

axios.interceptors.response.use(async function (response) {
    // if (response.status === 302) {
    //   console.log(response)
    //   return axios.get(response.headers.location)
    // }
    csrfToken = response.headers['x-csrf-token'];
 
    if (response.status == 403 && retry == 0) {
      retry ++
    } else {
      retry = 0
    }
    if (retry != 0) {
      response = await axios(response.config)
    }
    return response;
  }, function (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    } 
    if (error.message === 'Network Error' && error.request.status === 0 && error.request.responseURL === '') {
        ElMessageBox.alert("service error, please try again later")
    }
    if (error.response != undefined && error.response.status === 401) {
      if (error.response.data === 'no access') {
        ElMessageBox.alert("no access, please ensure and retry")
      } else if (handleCookie().length != 0 && access.sub != "" && access.sub != undefined) {
          visible.refreshlogin = true
      } else {
        refreshToken(); 
        return  
      }
    }
     
    return error
  });

  const refreshToken = () => {
    if(access.refresh_token != "" && access.refresh_token != undefined) {
      refresh()
    }
  }
  
  const refresh = () => {
    const refreshOption = {
      baseURL: env.authUrl,
      url: "/oauth2/token",
      method: "POST",
      data: {
        grant_type: 'refresh_token',
        refresh_token: access.refresh_token,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }, 
      //not work, need client_credentials 
      withCredentials: true,
      auth : { 
        username : env.clientId,
        password : env.clientSecret 
    } ,          
    }
    axios(refreshOption).then(function (response) {
      if(response.data.access_token != "") {
        access.update(response.data.access_token, response.data.expires_in);
      } 
    }).catch(function(error){
        if(handleCookie().length == 0) {
          ElMessageBox.alert("session expired, please login agian");
        } else {
          visible.refreshlogin = true
        }
      })
  }

  const countDown = () => {
    timeCount.value = window.setInterval(() => {
      access.expires_in--;
      if(access.expires_in == 10 && handleCookie().length == 0) {
        refreshToken();
      } else if(access.expires_in == 0) {
        clearAcess();
        toggleDark();
        clearInterval(timeCount.value);
      }
    }, 1000)
  }
  
  const clearAcess = () => {
      access.refresh_token = "";
      access.access_token = "";
  }
  
export { refreshToken, axios, countDown }