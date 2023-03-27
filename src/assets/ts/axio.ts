import axios from 'axios';
import { toggleDark } from '~/composables';
import { access } from './access';
import { env } from './env';
const timeCount= ref(0);

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
      refreshToken();
    return Promise.reject(error);
  });

  const refreshToken = () => {
    if(access.refresh_token != "") {
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
        auth : { 
          username : access.client_id , 
          password : access.client_secret 
        } ,           
      }
      axios(refreshOption).then(function (response) {
        if(response.data.access_token != "") {
          access.update(response.data.access_token, response.data.expires_in);
        }
      }) 
    }
  }

  const countDown = () => {
    timeCount.value = window.setInterval(() => {
      access.expires_in--;
      if(access.expires_in == 10) {
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

  // const csrf = () => {
  //   const csrfhOption = {
  //     baseURL: env.authUrl,
  //     url: "/oauth2/token",
  //     method: "POST",
  //     data: {
  //       grant_type: 'refresh_token',
  //       refresh_token: access.refresh_token,
  //     },
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },  
  //     auth : { 
  //       username : access.client_id , 
  //       password : access.client_secret 
  //     } ,           
  //   }
  //   axios(csrfhOption).then(function (response) {
  //     if(response.data.access_token != "") {
  //       access.update(response.data.access_token, response.data.expires_in);
  //     }
  //   }) 
  // }
  
export { refreshToken, axios , countDown }