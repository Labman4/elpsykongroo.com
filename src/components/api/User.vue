<template>
  <el-dialog v-model="userTable" title="User" width="75%">
    <el-button type="" @click="loadUser()">update</el-button>
    <el-table :data="datas.users" @selection-change="handleUserSelectChange" >
      <el-table-column type="selection"/>
      <el-table-column property="username" label="username"/>
      <el-table-column property="nickName" label="nick"/>
      <el-table-column property="email" label="email" width="auto"/>
      <el-table-column property="password" label="password"/>
      <el-table-column property="createTime" label="createTime"/>
      <el-table-column property="updateTime" label="updateTime"/>
      <el-table-column label="userInfo">
        <template #default="scope">
          <el-button size="small" type="info" @click="loadUserInfo(scope.row)">detail</el-button>
        </template>
      </el-table-column>
      <el-table-column label="permissions">
        <template #default="scope">
          <el-button size="small" type="info" @click="loadAuthorities(scope.row)">authorities</el-button>    
        </template>
      </el-table-column>
      <el-table-column label="groups">
        <template #default="scope">
          <el-button size="small" type="info" @click="loadGroups(scope.row)">groups</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" type="danger" @click="lockUser(scope.row)"> 
         <span v-if="scope.row.locked == 'false'">lock</span>
         <span v-if="scope.row.locked == 'true'">unlock</span>
        </el-button>
        <el-button size="small" type="primary" @click="addAuthenticator(scope.row)"></el-button>

      </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next, sizes" :total="50" 
      :current-page="userPage.pageNumber"  
      :page-size="userPage.pageSize"
      @update:current-page="userPageChange"
      @update:page-size="userPageSizeChange"/>
  </el-dialog>

  <el-dialog v-model="userForm" title="user">
    <el-form :model="userFormData">
      <el-form-item label="email" :label-width=visible.userFormLabelWidth>
      <el-input v-model="userFormData.email" />
    </el-form-item>
    <el-form-item label="nickName" :label-width=visible.userFormLabelWidth>
      <el-input v-model="userFormData.nickName" />
    </el-form-item>
    <el-form-item label="password" :label-width=visible.userFormLabelWidth>
      <el-input v-model="userFormData.password" />
    </el-form-item>
    <!-- <el-form-item label="username" :label-width=visible.userFormLabelWidth>
      <el-input v-model="userFormData.username" />
    </el-form-item>  -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="userForm = false">Cancel</el-button>
        <el-button type="primary" @click="updateUser()" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>


  <el-dialog v-model="userInfoForm" title="userInfo">
    <el-button type="" @click="claimForm = true">Add</el-button>
    <el-form ref="userinfoRef" :model="dynamicClaimForm" >
      <el-form-item v-for="(value, key) in dynamicClaimForm"
        :key="key"
        :label="key"
        :label-width=visible.userFormLabelWidth> 
            <el-input v-model="dynamicClaimForm[key]" />
            <el-button size="small" type="danger" v-if='!(Object.keys(userInfoTableData).indexOf(key) >= 0)' @click="deleteClaim(key)">  
              delete
            </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="userInfoForm = false">Cancel</el-button>
        <el-button type="primary" @click="updateUserInfo()" >Confirm</el-button>
        <el-button type="primary" @click="resetUseInfo()" >Reset</el-button> 
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="claimForm" title="claim">
    <el-form>
      <el-form-item label="claimName" :label-width="visible.userFormLabelWidth">
        <el-input v-model="claimFormData.key" />
      </el-form-item>
      <el-form-item label="value" :label-width="visible.ipFormLabelWidth">
        <el-input v-model="claimFormData.value"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="claimForm = false">Cancel</el-button>
        <el-button type="primary" @click="addClaim()" >Confirm</el-button>
      </span>
    </template>
  </el-dialog>

  <Group ref="group"></Group>
  <Authority ref="authority"></Authority>

  <el-dialog v-model="authorityTable" title="authority" width="75%">
        <el-table :data="datas.authorities">
        <el-table-column property="authority" label="authority" width="auto"/>
        <el-table-column label="Operations">
        <template #default="scope">
            <!-- <el-button size="small" type="primary" @click=" openAuthority(scope.row)">alloacte authority</el-button> -->
            <el-button size="small" type="danger" @click="deleteAuthority(scope.index, scope.row)">delete</el-button>
        </template>
        </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next, sizes" :total="50" 
        :current-page="authorityPage.pageNumber"  
        :page-size="authorityPage.pageSize"
        @update:current-page="authorityPageChange"
        @update:page-size="authorityPageSizeChange"/>
    </el-dialog>

    <el-dialog v-model="groupTable" title="group" width="75%">
        <el-table :data="datas.groups">
        <el-table-column property="groupName" label="groupName" width="auto"/>
        <el-table-column label="Operations">
        <template #default="scope">
            <!-- <el-button size="small" type="primary" @click="openGroup(scope.row)">alloacte group</el-button> -->
            <el-button size="small" type="danger" @click="deleteGroup(scope.index, scope.row)">delete</el-button>
        </template>
        </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next, sizes" :total="50" 
        :current-page="groupPage.pageNumber"  
        :page-size="groupPage.pageSize"
        @update:current-page="groupPageChange"
        @update:page-size="groupPageSizeChange"/>
    </el-dialog>
</template>

<script lang="ts" setup>

import { env } from '~/assets/ts/env';
import { access } from '~/assets/ts/access';
import { visible } from '~/assets/ts/visible';
import { axios } from '~/assets/ts/axio';
import { ElDialog, ElButton, ElTable, ElTableColumn, ElPagination, ElForm, ElFormItem, ElInput, FormInstance } from 'element-plus';
import bcrypt from 'bcryptjs';
import Group from '~/components/api/Group.vue';
import Authority from '~/components/api/Authority.vue';
import * as webauthnJson from "@github/webauthn-json";

const group = ref<InstanceType<typeof Group> | null>(null)
const authority = ref<InstanceType<typeof Authority> | null>(null)


const userPage = {
  "pageNumber": 1,
  "pageSize": 20,
};

const groupPage = {
  "pageNumber": 1,
  "pageSize": 20,
};

const authorityPage = {
  "pageNumber": 1,
  "pageSize": 20,
};

const claimForm = ref(false);
const userForm = ref(false);
const userInfoForm = ref(false);
const userTable = ref(false);
const authorityTable = ref(false);
const groupTable = ref(false);
const array = ref([])
const transfer = ref([{}])

let Ids = ref("")

const groups = ref([{}])
const authorities = ref([{}])

const users = [{}];
const datas = reactive({users, groups, authorities, transfer, array});

const claims = ref({});
let dynamicClaimForm = reactive(claims);

interface User {
  id: string
  email: string
  nickName: string
  username: string
  password: string
  createTime: string
  updateTime: string
  locked: string
}

const initclaimFormData = () => ({
  key: "",
  value: ""
})

let inituserFormData  = () => ({
  email: "",
  nickName: "",
  username: "",
  password: "",
  locked: false,
})

let inituserInfoTable  = () => ({
  sub: "",
  name: "",
  given_name: "",
  family_name: "",
  middle_name: "",
  nickname: "",
  preferred_username: "",
  profile: "",
  picture: "",
  website: "",
  email: "",
  email_verified: "",
  gender: "",
  birthdate: "",
  zoneinfo: "",
  locale: "",
  phone_number: "",
  phone_number_verified: "",
  address: "",
  updated_at: "",
  claims: "",
  username: ""
})

let userInfoTableData = reactive(inituserInfoTable());

let userFormData = reactive(inituserFormData());

let claimFormData = reactive(initclaimFormData());

const userinfoRef = ref<FormInstance>();

interface Group {
  groupName: string
  id: string
}

interface Authority {
    authority: string
    id: string
}

// const openGroup = (row: Group) => {
//   group.value?.GroupList(row.groupName, Ids.value);
// }

// const openAuthority = (row: Authority) => {
//   authority.value?.AuthorityList(row.authority, Ids.value);
// }

const deleteGroup = (index: number, row: Group) => {
  group.value?.updateGroup(row.groupName, Ids.value, true);
  datas.groups.splice(index, 1)
}

const deleteAuthority = (index: number, row: Authority) => {
  authority.value?.updateAuthority(row.authority, Ids.value, true);
  datas.authorities.splice(index, 1)
}

const loadGroups = (row: User) => {
  groupTable.value = true
  Ids.value = row.id
  const option = {
    baseURL: env.apiUrl,
    url: "auth/group/user/list",
    method: "GET",
    params: {
      id: row.id
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    datas.groups = response.data
  })
}


const loadAuthorities = (row: User) => {
  authorityTable.value = true
  Ids.value = row.id
  const option = {
    baseURL: env.apiUrl,
    url: "auth/authority/user/list",
    method: "GET",
    params: {
      id: row.id
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    datas.authorities = response.data
  })
}

const loadUserInfo = (row: User) => {
  Object.assign(dynamicClaimForm, inituserInfoTable())
  userInfoTableData.username = row.username
  const option = {
    baseURL: env.apiUrl,
    url: "auth/user/info",
    method: "GET",
    params: {
      username: row.username
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    if (response.data == null) {
        dynamicClaimForm.value = inituserInfoTable();
        userInfoForm.value = true;
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
      userInfoForm.value = true;
    }
  })
}

const updateUserInfo = () => {
  const newclaimMap = new Map<string, object>();
  for (let key in dynamicClaimForm.value) { 
    if(Object.keys(userInfoTableData).indexOf(key) >= 0 && key != "claim" && key != "username") {
      userInfoTableData[key] = dynamicClaimForm.value[key]
    } else if (key != "claims" && dynamicClaimForm.value.hasOwnProperty(key)) {
      newclaimMap.set(key, dynamicClaimForm.value[key])
    }
  }
  userInfoTableData.claims = JSON.stringify(Object.fromEntries(newclaimMap));
  const option = {
    baseURL: env.apiUrl,
    url: "auth/user/info/patch",
    method: "PATCH",
    data: userInfoTableData,
    headers: {
    'Authorization': 'Bearer '+ access.access_token,
    'Content-Type': 'application/json'
    },
  }
  axios(option).then(function(response){
    if(response.data == "done") {
      userInfoForm.value = false;
    }
  })

}

const addClaim = () => {
  dynamicClaimForm.value[claimFormData.key] = claimFormData.value;

  // userinfoRef.value?.$forceUpdate();
  claimForm.value = false;
}

const deleteClaim = (rmkey:string) => {
  const claimMap = new Map<string, object>();
  if(Object.keys(userInfoTableData).indexOf(rmkey) >= 0) {
      ElMessageBox.alert("unable to delete default claim")
  } else { 
    for (var key in dynamicClaimForm.value) { 
      if (key == rmkey) {
        delete dynamicClaimForm.value[rmkey];
      }
      if(Object.keys(userInfoTableData).indexOf(key) >= 0 && key != "claim") {
        userInfoTableData[key] = dynamicClaimForm.value[key]
        // if("true" == dynamicClaimForm.value[key]) {
        //   userInfoTableData[key] = true
        // } else if ("false" == dynamicClaimForm.value[key]) {
        //   userInfoTableData[key] = false
        // } 
      } else if (key != "claims" && dynamicClaimForm.value.hasOwnProperty(key) ) {
        claimMap.set(key, dynamicClaimForm.value[key])
      }
    }
    userInfoTableData.claims  = JSON.stringify(Object.fromEntries(claimMap));
    // for (var key in claimMapJson) {
    //   if (key = "_rawValue") {
    //     userInfoFormData.claims = claimMapJson[key]
    //   }
    //}
    const option = {
      baseURL: env.apiUrl,
      url: "auth/user/info/patch",
      method: "PATCH",
      data: userInfoTableData,
      headers: {
      'Authorization': 'Bearer '+ access.access_token,
      'Content-Type': 'application/json'
      },
    }
    axios(option).then(function(response){
      if (response.data == "done") {
        ElMessageBox.alert("delete success")
      }
    })
  }
}

const resetUseInfo = () => {
  dynamicClaimForm.value = inituserInfoTable()
  Object.assign(dynamicClaimForm, inituserInfoTable());
  Object.assign(userInfoTableData, inituserInfoTable());
}

const lockUser = (row: User) => {
  if(row.locked == "true") {
    row.locked = "false"
  } else {
    row.locked = "true"
  }
  const option = {
    baseURL: env.apiUrl,
    url: "auth/user/patch",
    method: "PATCH",
    data: row,
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    if (response.data == "done") {
      userList()
    }
  }) 
}

const addAuthenticator = (row: User) => {
  const option = {
    baseURL: env.authUrl,
    url: "auth/user/authenticator/add",
    method: "POST",
    data: {
      username: row.username
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(async function (response) {
    const publicKeyCredential = await webauthnJson.create(response.data);
    const finishOption = {
        baseURL: env.authUrl,
        url: "/finishauth",
        method: "POST",
        data: {
            credname: access.username,
            username: access.username,
            credential: JSON.stringify(publicKeyCredential),
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Credentials": "true"
        }, 
        // withCredentials: true                        
    }
    axios(finishOption).then(function (response) { 
      console.log(response.data);
    })

  })
}

const loadUser = () => {
  if (selectUserName.length < 1) {
      ElMessageBox.alert("please select someone to update") 
  } else if (selectUserName.length > 1) {
      ElMessageBox.alert("dont support batch update")
  } else {
      userForm.value = true
  }
}

const updateUser = () =>{
    userFormData.username = selectUserName[0];
    const option = {
      baseURL: env.apiUrl,
      url: "auth/user/patch",
      method: "PATCH",
      data: userFormData,
      headers: {
      'Authorization': 'Bearer '+ access.access_token
      },
    }
    if (!userFormData.password.startsWith("{bcrypt}")){
        bcrypt.hash(userFormData.password, 10).then(function(hash) {
          userFormData.password = '{bcrypt}' + hash ;
          axios(option).then(function (response) {
            if(response.data == "done") {
              userForm.value = false;
              userList();
            }
          })
        });
    } else {
        axios(option).then(function (response) {
          if(response.data == "done") {
            userForm.value = false;
            userList();
          }
        })
    }
}

const userList = () => {
    userTable.value = true;
    const option = {
      baseURL: env.apiUrl,
      url: "/auth/user/list",
      method: "GET",
      params: {
        pageNumber: userPage.pageNumber-1,
        pageSize: userPage.pageSize,
        order: 0
      },
      headers: {
      'Authorization': 'Bearer '+ access.access_token
      }
    }
    axios(option).then(function (response) {
      datas.users=response.data;
    })
}

const userPageChange = (newPage: number) => {
  userPage.pageNumber = newPage;
  userList();
}

const userPageSizeChange = (newPage: number) => {
  userPage.pageSize = newPage;
  userList();
}

const groupPageChange = (newPage: number) => {
  groupPage.pageNumber = newPage;
}

const groupPageSizeChange = (newPage: number) => {
  groupPage.pageSize = newPage;
}

const authorityPageChange = (newPage: number) => {
  authorityPage.pageNumber = newPage;
}

const authorityPageSizeChange = (newPage: number) => {
  authorityPage.pageSize = newPage;
}

const selectUserName:string[] = [];

const multipleUserSelect = ref<User[]>([])

const handleUserSelectChange = (val: User[]) => {
  multipleUserSelect.value = val ;
  selectUserName.splice(0, selectUserName.length);
  for(let i of multipleUserSelect.value) {
    selectUserName.push(i.username);
  }
}

defineExpose({
  userList
})

</script> 
