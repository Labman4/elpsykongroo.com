
import { env } from '~/assets/ts/env';
import { access } from '~/assets/ts/access';
import { axios } from '~/assets/ts/axio';
import { dayjs, ElLoading } from 'element-plus';
import { visible } from '~/assets/ts/visible';
import bcrypt from 'bcryptjs';
import { userInfoTableData, dynamicClaimForm, inituserInfoTable, data } from '~/assets/ts/dataInterface'

const loadUser = async() => {
  let user
  const option = {
    baseURL: env.authUrl,
    url: "auth/user/" + access.sub,
    method: "GET",
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  await axios(option).then(function(response) {
    if (response != undefined) {
      user = response.data
    }
   })
  return user
}

const findUser = async(name) => {
  let user
  const option = {
      baseURL: env.authUrl,
      url: "/auth/user/" + name,
      method: "GET",
      headers: {
        'Authorization': 'Bearer '+ access.access_token
      }
    }
    await axios(option).then(function (response) {
      user = response.data
    })
    return user
}

const listUser = async(pageNumber, pageSize, order) => {
    let user
    const option = {
      baseURL: env.authUrl,
      url: "/auth/user",
      method: "GET",
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        order: order
      },
      headers: {
        'Authorization': 'Bearer '+ access.access_token
      }
    }
    await axios(option).then(function (response) {
        user = response.data
        data.users = user
    })
    return user
}

const noticeListByUser = async(user, draft) => {
  let option, notices
  option = {
    baseURL: env.messageUrl,
    url: "notice/user",
    method: "GET",
    params: {
      user: user,
      draft: draft
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  if (user == "") {
      option = {
          baseURL: env.messageUrl,
          url: "notice/user",
          method: "GET",
          params: {
              user: user,
              draft: draft
          },
      }
  }
  await axios(option).then(function(response){
    notices = response.data
    notices.forEach( obj => {
        obj.timestamp = dayjs(obj.timestamp).format("YYYY-MM-DD HH:mm:ss")
    })
    data.notification = notices 
  })
  return notices
}

const noticeList = async(topic:string[], draft:boolean) => {
  let notices
  const option = {
    baseURL: env.messageUrl,
    url: "notice",
    method: "POST",
    data: {
      topic: topic,
      draft: draft
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  await axios(option).then(function(response){
    notices = response.data
    notices.forEach( obj => {
        obj.timestamp = dayjs(obj.timestamp).format("YYYY-MM-DD HH:mm:ss")
    })
    data.notification = notices 
  //      window.Notification.requestPermission().then(function(permssion) {
  //     console.log(permssion)
  //     const notification = new Notification("标题", {
  //         body: "通知内容"
  //       });
  //       notification.onclick = () => {
  //         console.log("通知被点击了");
  //       };
  //   })
  })
  return notices
}

const topicList = async() => {
  let topics
  const option = {
    baseURL: env.messageUrl,
    url: "notice/topic",
    method: "GET",
    params: {
      topic: "",
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  await axios(option).then(function(response){
    topics = response.data
    visible.topicLoad = false
    data.topic = topics
  })
  return topics
}

const updateUser = (userFormData, username) => {
  userFormData.username = username;
  const option = {
    baseURL: env.authUrl,
    url: "auth/user",
    method: "POST",
    data: userFormData,
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  if (userFormData.password == "" || userFormData.password == undefined){
      axios(option).then(function (response) {
        if(response.status == 200) {
          visible.userForm = false;
        }
      })
  } else if (userFormData.password.startsWith("{bcrypt}")) {
      axios(option).then(function (response) {
        if(response.status == 200) {
          visible.userForm = false;       
        }
      })
  } else {
      bcrypt.hash(userFormData.password, 10).then(function(hash) {
        userFormData.password = '{bcrypt}' + hash ;
        axios(option).then(function (response) {
          if(response.status == 200) {
            visible.userForm = false;
          }
        })
      });
  }
}

async function loadUserInfo (username:string) {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  Object.assign(dynamicClaimForm, inituserInfoTable())
  userInfoTableData.username = username
  const option = {
    baseURL: env.authUrl,
    url: "auth/user/info/" + username,
    method: "GET",
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    nextTick(() => {
      // Loading should be closed asynchronously
      loadingInstance.close()
    })
    if (response.data == null) {
        dynamicClaimForm.value = inituserInfoTable();
    } else {
      const userinfo = response.data
      for (var key in userinfo) {
        // if(key == "claim") {
        //   const claims = JSON.parse(userinfo[key]);
        //   for (var key in claims) {
        //     if(true === claims[key]) {
        //       claims[key] = "true"
        //     } else if (false === claims[key]) {
        //       claims[key] = "false"
        //     } 
        //   }
        // }
        if(true === userinfo[key]) {
            userinfo[key] = "true"
        } else if (false === userinfo[key]) {
            userinfo[key] = "false"
        } 
      }
      dynamicClaimForm.value = userinfo;
    }
    visible.userInfoForm = true
  })
  return dynamicClaimForm.value
}

export { listUser, findUser, loadUser, updateUser, loadUserInfo, noticeListByUser, noticeList, topicList};
