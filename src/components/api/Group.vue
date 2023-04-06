<template>
    <el-dialog v-model="groupTable" title="group" width="75%">
        <el-button type="" @click="groupForm = true">add</el-button>
        <el-table :data="datas.groups">
        <el-table-column property="groupName" label="groupName" width="auto"/>
        <el-table-column label="Operations">
        <template #default="scope">
            <el-button size="small" type="primary" @click=" openUser(scope.row)">alloacte user</el-button>
            <el-button size="small" type="primary" @click=" openAuthority(scope.row)">alloacte authority</el-button>
            <el-button size="small" type="danger" @click="deleteGroup(scope.$index, scope.row)">delete</el-button>
        </template>
        </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next, sizes" :total="50" 
        :current-page="groupPage.pageNumber"  
        :page-size="groupPage.pageSize"
        @update:current-page="groupPageChange"
        @update:page-size="groupPageSizeChange"/>
    </el-dialog>
    <el-dialog v-model="groupForm" title="group">
        <el-form :model="groupFormData">
            <el-form-item label="name" :label-width=visible.groupFormLabelWidth>
                <el-input v-model="groupFormData.name" />
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="groupForm = false">Cancel</el-button>
            <el-button type="primary" @click="addGroup()">Confirm</el-button>
        </span>
        </template>
    </el-dialog>


    <el-dialog v-model="groupTransfer">
        <el-transfer
            v-model="datas.array"
            style="text-align: left; display: inline-block"
            :filterable=true
            :button-texts="['remove', 'add']"
            :left-default-checked="datas.left"
            :data="datas.transfer"
            @change="handleChange"
            >
            <!-- <template v-slot:render-content="{ option }">
                <el-checkbox v-model="option.checked">{{ option.label }}</el-checkbox>
            </template> -->
      
            <template #scoped-slot="{ option }">
                <el-checkbox v-model="option.checked">{{ option.label }}</el-checkbox>
            </template> 

            <!-- <template #default="{ option }">
                <span>{{ option.label }}</span>
            </template> -->
            <template #left-footer>
            <el-button class="transfer-footer" size="small">unlock</el-button>
            <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="isAllSelected" @change="handleAllSelectedChange">全选</el-checkbox> -->
            </template>
            <template #right-footer>
                <el-button class="transfer-footer" size="small" @click="UpdateGroup()">update</el-button>
            </template>
        </el-transfer>                          
    </el-dialog>
    <!-- <User ref="user"></User> -->
</template>

<script lang="ts" setup>

import { access } from '~/assets/ts/access';
import { axios } from '~/assets/ts/axio';
import { env } from '~/assets/ts/env';
import { visible } from '~/assets/ts/visible';
// import User from '~/components/api/User.vue';

// const user = ref<InstanceType<typeof User> | null>(null)

// const renderFunc = (
//   h: (type: string, props: VNodeProps | null, children?: string) => VNode,
//   option: Option
// ) => {
//   return h('span', null, option.label)
// }

interface Group {
    groupName: string
    id: string
} 

interface Authority {
    authority: string
    id: string
}

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

const array = ref([""])
const initTransfer = () => ([{
    key: "",
    label: "",
    disabled: false,
    checked: false
}])

const transfer = reactive(initTransfer());

const groups = ref([{}])
const left = ref([""])
const right = ref([""])
const datas = reactive({array, groups, transfer, left, right})
const groupForm = ref(false);
const groupTable = ref(false);
const groupTransfer = ref(false);
const userOrAuth = ref(false)
const isAllSelected = ref(false)

const groupFormData = reactive({
    name: ""
});

const groupPage = {
  "pageNumber": 1,
  "pageSize": 20,
};


const  isIndeterminate = computed(() => {
      const selectedCount = datas.transfer.filter(item => item.checked).length;
      return selectedCount > 0 && selectedCount < datas.transfer.length;
    })

let groupsIds = ref("")
let Ids = ref("")

const openUser = (row: Group) => {
    groupTransfer.value = true
    datas.transfer = initTransfer()
    datas.transfer.splice(0,1);
    groupsIds.value = row.groupName
    userOrAuth.value = true
    Ids.value = ""
    userList(row)
}

const openAuthority = (row: Group) => {
    datas.transfer = initTransfer()
    datas.transfer.splice(0,1);
    datas.array.splice(0,1);
    groupsIds.value = row.id
    Ids.value = ""
    userOrAuth.value = false
    authorityList(row)
}

const addGroup = () => {
    const option = {
        baseURL: env.apiUrl,
        url: "auth/group/add",
        method: "PUT",
        data: {
            name: groupFormData.name
        },
        headers: {
        'Authorization': 'Bearer '+ access.access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
    }
    axios(option).then(function (response) {
        if (response.data == "done") {
            groupList()
            groupForm.value = false
        }
    }) 
}

const deleteGroup = (index: number, row: Group) => {
    const option = {
        baseURL: env.apiUrl,
        url: "auth/group/delete",
        method: "DELETE",
        params: {
            "name": row.groupName
        },
        headers: {
        'Authorization': 'Bearer '+ access.access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
    }
    axios(option).then(function (response) {
        if (response.data == "done") {
            datas.groups.splice(index, 1);
        }
    }) 
}

const userList = async (row: Group) => {
    const option = {
        baseURL: env.apiUrl,
        url: "/auth/user/list",
        method: "GET",
        params: {
        pageNumber: 0,
        pageSize: 100,
        order: 0
        },
        headers: {
        'Authorization': 'Bearer '+ access.access_token
        }
    }
    let checked: number[] = []
    let users
    await axios(option).then(async function (response) {
        if (response.data.length > 0) {
            users = response.data;
            for (let i = 0; i <users.length; i++) {
                const checkOption = {
                    baseURL: env.apiUrl,
                    url: "auth/group/user/list",
                    method: "GET",
                    params: {
                        id: users[i].id
                    },
                    headers: {
                    'Authorization': 'Bearer '+ access.access_token
                    },
                }
                await axios(checkOption).then(function(response){
                    const groups = response.data
                    if (groups.length > 0) {
                        for (let group of groups) {
                            if (group.groupName == row.groupName) {
                                checked.push(i)
                                datas.transfer.push({
                                    key: users[i].id,
                                    label: users[i].username,
                                    disabled: true,
                                    checked: true
                                })
                            }
                        }
                    } 
                })
            }
        }
    })
    pushUser(users, checked) 
}

const pushUser = (users: User[], checked: number[]) => {
    for (let i = 0; i <users.length; i++) {
        if (checked.indexOf(i) == -1) {
            datas.transfer.push({
                key: users[i].id,
                label: users[i].username,
                disabled: false,
                checked: false
            })
        }
    }
}

// const GroupList = (groupName: string, ids: string) => {
//     datas.transfer = initTransfer();
//     datas.transfer.splice(0,1);
//     groupTransfer.value = true
//     // groupsIds.value = groupName + ","
//     // datas.array.push(groupName)
//     Ids.value = ids
//     userOrAuth.value = true
//     const option = {
//         baseURL: env.apiUrl,
//         url: "auth/group/list",
//         method: "GET",
//         headers: {
//         'Authorization': 'Bearer '+ access.access_token
//         },
//     }
//     axios(option).then(function (response) {
//         if (response.data.length > 0) {
//             const groups = response.data;
//             datas.transfer.push({
//                 key: groupName,
//                 label: groupName,
//                 disabled: true,
//                 checked: false
//             })
//             for (let i = 0; i <groups.length; i++) {
//                 if (groups[i].groupName != groupName) {
//                     datas.transfer.push({
//                         key: groups[i].groupName,
//                         label: groups[i].groupName,
//                         disabled: false,
//                         checked: false
//                     })
//                 }
//             }     
//         }
//     }) 
// }

const authorityList = (row: Group) => {
    const checkOption = {
        baseURL: env.apiUrl,
        url: "auth/authority/group/list",
        method: "GET",
        params: {
            name: row.groupName
        },
        headers: {
        'Authorization': 'Bearer '+ access.access_token
        },
    } 
    let checked: number[] = []
    let checkedAuthority: Authority[] 
    axios(checkOption).then(function (response) {
        checkedAuthority = response.data        
    }).then(function(response) {
            const option = {
                baseURL: env.apiUrl,
                url: "/auth/authority/list",
                method: "GET",
                headers: {
                'Authorization': 'Bearer '+ access.access_token
                }
            }
            axios(option).then(function (response) {
                if (response.data.length > 0) {
                        const authorities = response.data;
                        for (let i = 0; i <authorities.length; i++) {
                            for (let j = 0; j <checkedAuthority.length; j++) {
                                if (checkedAuthority[j].authority == authorities[i].authority) {
                                    checked.push(i)
                                    datas.transfer.push({
                                        key: authorities[i].authority,
                                        label: authorities[i].authority,
                                        disabled: true,
                                        checked: true
                                    })
                                    datas.left.push(authorities[i].authority)
                                    // datas.array.push(authorities[i].authority)
                                } 
                            }
                        }  
                        for (let i = 0; i < authorities.length; i++) {
                            if (checked.indexOf(i) == -1) {
                                datas.transfer.push({
                                    key: authorities[i].authority,
                                    label: authorities[i].authority,
                                    disabled: false,
                                    checked: false
                                })
                            }
                        } 
                }
               
                // for(let i = 0; i< datas.array.length; i++) {
                //         // datas.right.push(i)

                // }
                    groupTransfer.value = true
          
            })
   
    })
 
}

const groupList = () => {
    groupTable.value = true
    const option = {
        baseURL: env.apiUrl,
        url: "auth/group/list",
        method: "GET",
        headers: {
        'Authorization': 'Bearer '+ access.access_token
        },
    }
    axios(option).then(function (response) {
        datas.groups = response.data
    }) 
}

const UpdateGroup = () => {
    if (groupsIds.value.length == 0 || Ids.value.length == 0 ) {
        ElMessageBox.alert("please select some")
        return
    }
    updateGroup(groupsIds.value, Ids.value, userOrAuth.value);
}

const updateGroup = (groupsIds: string, Ids: string, userOrAuth: boolean) => {
    if (groupsIds.endsWith(",")) {
        groupsIds = groupsIds.slice(0,-1)
    }
    if (Ids.endsWith(",")) {
        Ids = Ids.slice(0,-1)
    }
    const userOption = {
        baseURL: env.apiUrl,
        url: "auth/group/user/patch",
        method: "PATCH",
        params: {
            groups: groupsIds,
            ids: Ids
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "application/x-www-form-urlencoded"
        },
    }
    if (userOrAuth) {
        axios(userOption).then(function (response) {
            if(response.data == "done") {
                groupTransfer.value = false
            }
        }) 
    } else {
        updateGroupAuthority()
    }
}

const updateGroupAuthority = () => {
    const Authorityoption = {
        baseURL: env.apiUrl,
        url: "auth/authority/group/patch",
        method: "PATCH",
        params: {
            authorities: Ids.value.slice(0,-1),
            ids: groupsIds.value
        },
        headers: {
        'Authorization': 'Bearer '+ access.access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
    }
    axios(Authorityoption).then(function (response) {
        if(response.data == "done") {
                groupTransfer.value = false
        }
    }) 
}

const handleChange = (
  value: number | string,
  direction: 'left' | 'right',
  movedKeys: string[] | number[]
) => {
    if (Ids.value.length == 36) {
        groupsIds.value += value + ","
    } else {
        Ids.value += value + ','
    }
}

const handleAllSelectedChange = (value) => {
    datas.transfer.forEach(item => {
        item.checked = value;
      });
      value = datas.transfer.filter(item => item.checked).map(item => item.key);
}

const groupPageChange = (newPage: number) => {
  groupPage.pageNumber = newPage;
  groupList();
}

const groupPageSizeChange = (newPage: number) => {
  groupPage.pageSize = newPage;
  groupList();
}

defineExpose({
  groupList, updateGroup
})

</script>