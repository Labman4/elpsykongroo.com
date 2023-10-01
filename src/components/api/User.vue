<template>
  <el-dialog v-model="visible.userTable" :width=visible.dialogWidth>
    <el-button type="" @click="loadUser()">update</el-button>
    <el-table :data="data.users" @selection-change="handleUserSelectChange" >
      <el-table-column type="selection"/>
      <el-table-column property="username" label="username"/>
      <el-table-column property="nickName" label="nick"/>
      <el-table-column property="email" label="email" width="auto"/>
      <el-table-column property="password" label="password"/>
      <el-table-column property="createTime" label="createTime"/>
      <el-table-column property="updateTime" label="updateTime"/>
      <el-table-column label="userInfo">
        <template #default="scope">
          <el-button size="small" type="info" @click="loadUserInfo(scope.row.username)">detail</el-button>
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
      </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next, sizes" :total="50" 
      :current-page="userPage.pageNumber"  
      :page-size="userPage.pageSize"
      @update:current-page="userPageChange"
      @update:page-size="userPageSizeChange"/>
  </el-dialog>

  <el-dialog v-model="userForm" :width=visible.dialogWidth>
    <el-form :model="userFormData">
      <el-form-item label="email" :label-width=visible.labelWidth>
      <el-input v-model="userFormData.email" />
    </el-form-item>
    <el-form-item label="nickName" :label-width=visible.labelWidth>
      <el-input v-model="userFormData.nickName" />
    </el-form-item>
    <el-form-item label="password" :label-width=visible.labelWidth>
      <el-input v-model="userFormData.password" />
    </el-form-item>
    <!-- <el-form-item label="username" :label-width=visible.userFormLabelWidth>
      <el-input v-model="userFormData.username" />
    </el-form-item>  -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="userForm = false">Cancel</el-button>
        <el-button type="primary" @click="updateUser(userFormData, selectUserName[0].username)" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="visible.userInfoForm" :width=visible.dialogWidth>
    <el-button type="" @click="claimForm = true">Add</el-button>
    <el-form :model="dynamicClaimForm" >
      <el-form-item v-for="(value, key) in dynamicClaimForm"
        :key="key"
        :label="key"
        :label-width=visible.labelWidth> 
            <el-input v-model="dynamicClaimForm[key]" />
            <el-button size="small" type="danger" v-if='!(Object.keys(userInfoTableData).indexOf(key) >= 0)' @click="deleteClaim(key)">  
              delete
            </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible.userInfoForm = false">Cancel</el-button>
        <el-button type="primary" @click="updateUserInfo()" >Confirm</el-button>
        <el-button type="primary" @click="resetUseInfo(userInfoTableData.username)" >Reset</el-button> 
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="claimForm" :width=visible.dialogWidth>
    <el-form>
      <el-form-item label="claimName" :label-width="visible.labelWidth">
        <el-input v-model="claimFormData.key" />
      </el-form-item>
      <el-form-item label="value" :label-width="visible.labelWidth">
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

  <el-dialog v-model="authorityTable" :width=visible.dialogWidth>
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

  <el-dialog v-model="groupTable" :width=visible.dialogWidth>
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
import { listUser, updateUser,loadUserInfo } from '~/assets/ts/commonApi';
import { ElDialog, ElButton, ElTable, ElTableColumn, ElPagination, ElForm, ElFormItem, ElInput } from 'element-plus';
import Group from '~/components/api/Group.vue';
import Authority from '~/components/api/Authority.vue';
import { user, group, authority } from '~/assets/ts/interface';
import { data, userInfoTableData, dynamicClaimForm, userFormData, inituserInfoTable } from '~/assets/ts/dataInterface'

const group = ref<InstanceType<typeof Group> | null>(null)
const authority = ref<InstanceType<typeof Authority> | null>(null)

const userPage = {
  "pageNumber": 1,
  "pageSize": 20,
  "order": 0
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
const authorityTable = ref(false);
const groupTable = ref(false);
const array = ref([])
const transfer = ref([{}])

let Ids = ref("")

const groups = ref([{}])
const authorities = ref([{}])

const datas = reactive({groups, authorities, transfer, array});

const initclaimFormData = () => ({
  key: "",
  value: ""
})

let claimFormData = reactive(initclaimFormData());


const deleteGroup = (index: number, row: group) => {
  group.value?.updateGroup(row.groupName, Ids.value, true);
  datas.groups.splice(index, 1)
}

const deleteAuthority = (index: number, row: authority) => {
  authority.value?.updateAuthority(row.authority, Ids.value, true);
  datas.authorities.splice(index, 1)
}

const loadGroups = (row: user) => {
  groupTable.value = true
  Ids.value = row.id
  const option = {
    baseURL: env.authUrl,
    url: "auth/group/user/" + row.id,
    method: "GET",
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    datas.groups = response.data
  })
}

const loadAuthorities = (row: user) => {
  authorityTable.value = true
  Ids.value = row.id
  const option = {
    baseURL: env.authUrl,
    url: "auth/user/authority/" + row.username,
    method: "GET",
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    datas.authorities = response.data
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
    baseURL: env.authUrl,
    url: "auth/user/info",
    method: "POST",
    data: userInfoTableData,
    headers: {
      'Authorization': 'Bearer '+ access.access_token,
      'Content-Type': 'application/json'
    },
  }
  axios(option).then(function(response){
    if(response.status == 200) {
      visible.userInfoForm = false;
    }
  })

}

const addClaim = () => {
  dynamicClaimForm.value[claimFormData.key] = claimFormData.value;
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
      baseURL: env.authUrl,
      url: "auth/user/info",
      method: "POST",
      data: userInfoTableData,
      headers: {
        'Authorization': 'Bearer '+ access.access_token,
        'Content-Type': 'application/json'
      },
    }
    axios(option).then(function(response){
      if (response.status == 200) {
        ElMessageBox.alert("delete success")
      }
    })
  }
}

const resetUseInfo = (username:string) => {
  dynamicClaimForm.value = inituserInfoTable()
  Object.assign(dynamicClaimForm, inituserInfoTable());
  Object.assign(userInfoTableData, inituserInfoTable());
  userInfoTableData.username = username;
}

const lockUser = (row: user) => {
  if(row.locked == "true") {
    row.locked = "false"
  } else {
    row.locked = "true"
  }
  const option = {
    baseURL: env.authUrl,
    url: "auth/user",
    method: "POST",
    data: row,
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    if (response.status == 200) {
      userList()
    }
  }) 
}

const loadUser = () => {
  if (selectUserName.length < 1) {
      ElMessageBox.alert("please select someone to update") 
  } else if (selectUserName.length > 1) {
      ElMessageBox.alert("dont support batch update")
  } else {
      userFormData.email = selectUserName[0].email
      userFormData.nickName = selectUserName[0].nickName
      userFormData.password = selectUserName[0].password
      userForm.value = true
  }
}

const userList = async() => {
    visible.userTable = true;
    data.users = await listUser(userPage.pageNumber-1, userPage.pageSize, userPage.order)
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

const selectUserName:user[] = [];

const multipleUserSelect = ref<user[]>([])

const handleUserSelectChange = (val: user[]) => {
  multipleUserSelect.value = val ;
  selectUserName.splice(0, selectUserName.length);
  for(let i of multipleUserSelect.value) {
    selectUserName.push(i);
  }
}

</script> 
