<template>
    <el-dialog v-model="authorityTable" title="authority" width="75%">
        <el-button type="" @click="authorityForm = true">add</el-button>
        <el-table :data="datas.authorities">
        <el-table-column property="authority" label="authority" width="auto"/>
        <el-table-column label="Operations">
        <template #default="scope">
            <el-button size="small" type="primary" @click=" openUser(scope.row)">alloacte user</el-button>
            <el-button size="small" type="primary" @click=" openGroup(scope.row)">alloacte group</el-button>
            <el-button size="small" type="danger" @click="deleteAuthority(scope.$index, scope.row)">delete</el-button>
        </template>
        </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next, sizes" :total="50" 
        :current-page="authorityPage.pageNumber"  
        :page-size="authorityPage.pageSize"
        @update:current-page="authorityPageChange"
        @update:page-size="authorityPageSizeChange"/>
    </el-dialog>
    <el-dialog v-model="authorityForm" title="authority" width="75%">
        <el-form :model="authorityFormData">
            <el-form-item label="name" :label-width=visible.authorityFormLabelWidth>
                <el-input v-model="authorityFormData.name" />
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="authorityForm = false">Cancel</el-button>
            <el-button type="primary" @click="addAuthority()" >
            Confirm
            </el-button>
        </span>
        </template>
    </el-dialog>
    <el-dialog v-model="authorityTransfer" width="75%">
        <el-transfer
            style="text-align: left; display: inline-block"
            v-model="datas.array"
            filterable
            :left-default-checked="datas.left"
            :button-texts="['remove', 'add']"
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
            <el-button class="transfer-footer" size="small" @click="resetSelect()">reset</el-button>
            </template>
            <template #right-footer>
            <el-button class="transfer-footer" size="small" @click="UpdateAuthority()">update</el-button>
            </template>
        </el-transfer>                          
    </el-dialog>
</template>

<script lang="ts" setup>

import { access } from '~/assets/ts/access';
import { axios } from '~/assets/ts/axio';
import { env } from '~/assets/ts/env';
import { visible } from '~/assets/ts/visible';

interface Authority {
    authority: string
    id: string
}

interface Group {
    groupName: string
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

let authorityIds = ref("")
let Ids = ref("")

const initTransfer = () => ([{
    key: "",
    label: "",
    disabled: false,
    checked: false
}])

const transfer = reactive(initTransfer());
const array = ref([])
const authorities = ref([{}])
const left = ref([""])

const datas = reactive({left, array, authorities, transfer})
const authorityForm = ref(false);
const authorityTable = ref(false);
const authorityTransfer = ref(false);
const userOrGroup = ref(false)

const authorityFormData = reactive({
    name: ""
});

const authorityPage = {
  "pageNumber": 1,
  "pageSize": 20,
};

const openUser = (row: Authority) => {
    authorityTransfer.value = true
    datas.transfer = initTransfer()
    datas.transfer.splice(0,1);
    datas.left = []
    datas.array = []
    authorityIds.value = row.authority
    userOrGroup.value = true
    Ids.value = ""
    userList(row)
}

const openGroup = (row: Authority) => {
    datas.transfer = initTransfer()
    datas.transfer.splice(0,1);
    datas.left = []
    datas.array = []
    authorityIds.value = row.authority
    Ids.value = ""
    userOrGroup.value = false
    groupList(row)
}

const authorityList = () => {
    authorityTable.value = true
    const option = {
        baseURL: env.apiUrl,
        url: "/auth/authority",
        method: "GET",
        headers: {
        'Authorization': 'Bearer '+ access.access_token
        }
    }
    axios(option).then(function (response) {
        datas.authorities = response.data
    })
}

// const AuthorityList = (authority: string, ids: string) => {
//     datas.transfer = initTransfer();
//     datas.transfer.splice(0,1);
//     authorityTransfer.value = true
//     authorityIds.value = authority + ','
//     Ids.value = ids
//     userOrGroup.value = true
//     const option = {
//         baseURL: env.apiUrl,
//         url: "/auth/authority/list",
//         method: "GET",
//         headers: {
//         'Authorization': 'Bearer '+ access.access_token
//         }
//     }
//     axios(option).then(function (response) {
//         if (response.data.length > 0) {
//             const authority = response.data;

            
//             for (let i = 0; i <authority.length; i++) {
//                 datas.transfer.push({
//                     key: authority[i].authority,
//                     label: authority[i].authority,
//                     disabled: false,
//                     checked: false
//                 })
//             }     
//         }
//     })
// }

const addAuthority = () => {
    const option = {
        baseURL: env.apiUrl,
        url: "auth/authority",
        method: "PUT",
        params: {
            name: authorityFormData.name
        },
        headers: {
        'Authorization': 'Bearer '+ access.access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
    }
    axios(option).then(function (response) {
        if (response.status = 200) {
            authorityList()
            authorityForm.value = false
        }
    }) 
}

const deleteAuthority = (index: number, row: Authority) => {
    const option = {
        baseURL: env.apiUrl,
        url: "auth/authority/" + row.authority,
        method: "DELETE",
        headers: {
        'Authorization': 'Bearer '+ access.access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
    }
    axios(option).then(function (response) {
        if (response.status == 200) {
            datas.authorities.splice(index, 1);
        }
    }) 
}

const UpdateAuthority = () => {
    updateAuthority(authorityIds.value, Ids.value, userOrGroup.value)
}

const updateAuthority = (authorities: string, ids: string, userOrGroup: boolean) => {
    if (authorities.endsWith(",")) {
        authorities = authorities.slice(0,-1)
    }
    if (ids.endsWith(",")) {
        ids = ids.slice(0,-1)
    }
    const userOption = {
        baseURL: env.apiUrl,
        url: "auth/authority/user",
        method: "POST",
        params: {
            authorities: authorities,
            ids: ids
        },
        headers: {
        'Authorization': 'Bearer '+ access.access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
    }
    if (userOrGroup) {
        axios(userOption).then(function (response) {
            if (response.status == 200) {
                authorityTransfer.value = false
            }
        }) 
    } else {
        updateGroupAuthority(authorities, ids)
    }
}

const updateGroupAuthority = (authorities: string, ids: string) => {
    const Authorityoption = {
        baseURL: env.apiUrl,
        url: "auth/authority/group",
        method: "POST",
        params: {
            authorities: authorities,
            ids: ids
        },
        headers: {
        'Authorization': 'Bearer '+ access.access_token,
        "Content-Type": "application/x-www-form-urlencoded"
        },
    }
    axios(Authorityoption).then(function (response) {
        if (response.status == 200) {
            authorityTransfer.value = false
        }
    }) 
}

const userList = async (row: Authority) => {
  const option = {
    baseURL: env.apiUrl,
    url: "/auth/user",
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
                    url: "auth/authority/user/" + users[i].id,
                    method: "GET",
                    headers: {
                    'Authorization': 'Bearer '+ access.access_token
                    },
                }
                await axios(checkOption).then(function(response){
                    const groups = response.data
                    if (groups.length > 0) {
                        for (let group of groups) {
                            if (group.authority == row.authority) {
                                checked.push(i)
                                datas.transfer.push({
                                    key: users[i].id,
                                    label: users[i].username,
                                    disabled: true,
                                    checked: false
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

const groupList = (row: Authority) => {
    const checkOption = {
        baseURL: env.apiUrl,
        url: "auth/group/authority/" + row.authority,
        method: "GET",
        headers: {
        'Authorization': 'Bearer '+ access.access_token
        },
    } 
    let checkedGroup: Group[] 
    axios(checkOption).then(function (response) {
        checkedGroup = response.data
    }).then(function(response) {
        const option = {
            baseURL: env.apiUrl,
            url: "auth/group",
            method: "GET",
            headers: {
            'Authorization': 'Bearer '+ access.access_token
            },
        }
        axios(option).then(function (response) {
            const group = response.data;
            let checked: number[] = []
            for (let i = 0; i < group.length; i++) {
                for (let j = 0; j < checkedGroup.length; j++) {
                    if (checkedGroup[j].groupName == group[i].groupName) {
                        checked.push(i)
                        datas.transfer.push({
                            key: group[i].id,
                            label: group[i].groupName,
                            disabled: true,
                            checked: true
                        })
                        // datas.left.push(group[i].groupName)
                        // datas.array.push(authorities[i].authority)
                    } 
                }
            }  
            for (let i = 0; i <group.length; i++) {
                if (checked.indexOf(i) == -1) {
                    datas.transfer.push({
                        key: group[i].id,
                        label: group[i].groupName,
                        disabled: false,
                        checked: false
                    })
                }
            } 
            authorityTransfer.value = true
        }) 
    })
}

const resetSelect = () => {
    const transfer = datas.transfer
    for (let key in transfer) {
        if(transfer[key].disabled) {
            transfer[key].disabled = false
            // transfer[key].checked = true
        }
    }

}
const handleChange = (
  value: number | string,
  direction: 'left' | 'right',
  movedKeys: string[] | number[]
) => {
    if (Ids.value.length == 36) {
        authorityIds.value += value + ","
    } else {
        Ids.value += value + ','
    }
}

const authorityPageChange = (newPage: number) => {
  authorityPage.pageNumber = newPage;
  authorityList();
}

const authorityPageSizeChange = (newPage: number) => {
  authorityPage.pageSize = newPage;
  authorityList();
}

defineExpose({
  authorityList, updateAuthority
})

</script>