<template>
    <el-dialog v-model="visible.authClientForm" title="">
    <el-form :model="clientForm">
        <el-form-item label="GrantTypes" :label-width=visible.authClientFormWidth>
          <el-checkbox-group v-model=authorizationGrantTypes>
            <el-checkbox label="client_credentials" />
            <el-checkbox label="authorization_code" />
            <el-checkbox label="refresh_token" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Methods" :label-width=visible.authClientFormWidth>
        <el-select v-model="clientForm.clientAuthenticationMethods" placeholder="">
          <el-option label="client_secret_basic" value="client_secret_basic" />
          <el-option label="client_secret_post" value="client_secret_post" />
          <el-option label="private_key_jwt" value="private_key_jwt" />
          <el-option label="client_secret_jwt" value="client_secret_jwt" />
          <el-option label="none" value="none" />
        </el-select>
        </el-form-item>
      <el-form-item label="redirectUris" :label-width=visible.authClientFormWidth>
        <el-input v-model="clientForm.redirectUris" />
      </el-form-item>
      <el-form-item label="clientName" :label-width=visible.authClientFormWidth>
        <el-input v-model="clientForm.clientName" />
      </el-form-item>
      <el-form-item label="scopes" :label-width=visible.authClientFormWidth>
        <el-input v-model="clientForm.scopes" />
      </el-form-item>
      <el-form-item label="clientId" :label-width=visible.authClientFormWidth>
        <el-input v-model="clientForm.clientId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="clientSecret" :label-width=visible.authClientFormWidth>
        <el-input v-model="clientForm.clientSecret" type="password" :show-password="true" autocomplete="off" @keyup.enter="" />
      </el-form-item>
      <el-form-item label="clientSettings" :label-width=visible.authClientFormWidth>
        <el-cascader ref="clientSet" v-model="clientSettingList" :options=clientSettings :props="props" @change="handleClientSetting"  clearable />
      </el-form-item>
      <el-form-item label="tokenSettings" :label-width=visible.authClientFormWidth>
        <el-cascader ref="tokenSet" v-model="tokenSettingList" :options=tokenSettings :props="props" @change="handleTokenSetting" clearable />
      </el-form-item>
      <el-form-item label="SecretExpires">
        <el-col :span="9">
          <el-date-picker
          ref="datePicker"
          v-model="clientForm.clientSecretExpiresAt"
          type="datetime"
          v-bind:placeholder="clientSecretExpiresString"
          value-format="YYYY-MM-DDTHH:mm:ss[Z]"
          format="YYYY-MM-DDTHH:mm:ss[Z]"
          />
        </el-col>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible.authClientForm = false">Cancel</el-button>
        <el-button type="primary" @click="clientAdd()" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
      <el-dialog v-model="visible.authClientTable" title="client" width="95%">
    <el-button type="" @click="openClientAdd">Add</el-button>
    <!-- <el-button type="danger" click="DeleteSelect">DeleteSelect</el-button> -->
    <el-table :data="data.authclient" @selection-change="handleAuthSelectChange">
      <el-table-column type="selection"/>
      <el-table-column property="clientId" label="Id" width="60px"/>
      <el-table-column property="clientSecret" label="Secret" />
      <el-table-column property="clientName" label="name" />
      <el-table-column property="redirectUris" label="redirectUris" width="100px" />
      <el-table-column property="scopes" label="scopes" width="70px"/>
      <el-table-column property="clientAuthenticationMethods" label="Methods" width="60px"/>
      <el-table-column property="authorizationGrantTypes" label="type" width="70px"/>
      <el-table-column property="clientIdIssuedAt" label="issused" :formatter="issusedTimestamp" sortable/>
      <el-table-column property="clientSecretExpiresAt" label="expire" :formatter="expiredTimestamp" sortable/>
      <el-table-column property="clientSettings" label="clientSettings" width="150px" />
      <el-table-column property="tokenSettings" label="tokenSettings" width="300px" />

      <el-table-column>
      <!-- <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search"  @keyup.enter="" />
      </template> -->
      <template #default="scope">
        <el-button
          size="small"
          type="danger"
          @click="DeleteClient(scope.$index, scope.row)"
          >Delete</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next, sizes" :total="50" 
      :current-page="authPage.pageNumber"  
      :page-size="authPage.pageSize"
      @update:current-page="authClientPageChange"
      @update:page-size="authClientPageSizeChange"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import { axios } from '~/assets/js/axio';
import { access }  from '~/assets/js/access';
import { env } from '~/assets/js/env';
import { reactive, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { dayjs, ElMessageBox } from 'element-plus';
import bcrypt from 'bcryptjs'
import { visible } from '~/assets/js/visible';

const authclient = [{}];
const data = reactive({authclient});

const authPage = {
  "pageNumber": 1,
  "pageSize": 10,
};

const props = {
  multiple: true,
  expandTrigger: 'hover' as const,
  // checkStrictly: true,
}

let clientForm =  reactive({
  id: uuidv4(),
  clientId: "",
  clientSecret: "",
  clientSecretExpiresAt: "",
  scopes: "",
  redirectUris: "",
  clientName: "",
  clientSettings: "",
  tokenSettings: "",
  authorizationGrantTypes: "",
  clientAuthenticationMethods: ""
})

interface AuthClient {
  id: string
  clientId: string
  clientSecret: string
  clientIdIssuedAt: string
  clientSecretExpiresAt: string
  scopes: string
  redirectUris: string
  clientName: string
  clientSettings: string
  tokenSettings: string
  authorizationGrantTypes: string
  clientAuthenticationMethods: string
}

const tokenSettings = [
    {
      value: "@class",
      label: "@class",
      children: [
            {
              value: "java.util.Collections$UnmodifiableMap",
              label: "java.util.Collections$UnmodifiableMap"
            }
          ]
    },
    {
      value: "settings.token.authorization-code-time-to-live",
      label: "authorizationCodeTimeToLive",
      children: [
        {
          value: "java.time.Duration",
          label: "Duration",
          children: [
            {
              value: 1800,
              label: "30min"
            },
            {
              value: 7200,
              label: "2h"
            },
            {
              value: 86400,
              label: "1day"
            }
          ]
        }
      ]
    },
    {
      value: "settings.token.access-token-time-to-live",
      label: "accessTokenTimeToLive",
      children: [
        {
          value: "java.time.Duration",
          label: "Duration",
          children: [
            {
              value: 30,
              label: "30s"
            },
            {
              value: 300,
              label: "5min"
            },
            {
              value: 1200,
              label: "20min"
            }
          ]
        }
      ]
    },
    {
      value: "settings.token.refresh-token-time-to-live",
      label: "refreshTokenTimeToLive",
      children: [
        {
          value: "java.time.Duration",
          label: "Duration",
          children: [
            {
              value: 3600,
              label: "1h"
            },
            {
              value: 18000,
              label: "5h"
            },
            {
              value: 36000,
              label: "10h"
            }
          ]
        }
      ]
    },
    {
      value: "settings.token.access-token-format",
      label: "accessTokenFormat",
      children: [
        {
          value: "@class",
          label: "@class",
          children: [
            {
              value: "org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat",
              label: "OAuth2TokenFormat"
            }
          ]
        },
        {
          value: "value",
          label: "value",
          children: [
            {
              value: "self-contained",
              label: "self-contained"
            }
          ]
        },
      ]
    },
    {
      value: "settings.token.reuse-refresh-tokens",
      label: "reuseRefreshTokens",
      children: [
        {
          value: "reuse-refresh-tokens-true",
          label: "true",
        },
        {
          value: "reuse-refresh-tokens-false",
          label: "false",
        }
      ]
    },
    {
      value: "settings.token.id-token-signature-algorithm",
      label: "idTokenSignatureAlgorithm",
      children: [
        {
          value: "org.springframework.security.oauth2.jose.jws.SignatureAlgorithm",
          label: "SignatureAlgorithm",
          children: [
            {
              value: "RS256",
              label: "RS256",
            }
          ]
        }
      ]
    },
]

const clientSettings = [
  {
    value: "@class",
    label: "@class",
    children: [
      {
        value: "java.util.Collections$UnmodifiableMap",
        label: "java.util.Collections$UnmodifiableMap"
      }
    ]
  },
  {
    value: "settings.client.require-proof-key",
    label: "requireProofKey",
    children: [    
      {
        value: "require-proof-key-true",
        label: "true",
      },
      {
        value: "require-proof-key-false",
        label: "false",
      },
    ]
  },  
  {
    value: "settings.client.token-endpoint-authentication-signing-algorithm",
    label: "signingAlgorithm",
    children: [
      {
        value: "RS256",
        label: "RS256"
      },
      {
        value: "RS384",
        label: "RS384"
      },
      {
        value: "RS512",
        label: "RS512"
      },
      {
        value: "ES256",
        label: "ES256"
      },
      {
        value: "ES384",
        label: "ES384"
      },
      {
        value: "ES512",
        label: "ES512"
      },
      {
        value: "PS256",
        label: "PS256"
      },
      {
        value: "PS384",
        label: "PS384"
      },
      {
        value: "PS512",
        label: "PS512"
      },
    ]
  },
  {
    value: "settings.client.jwk-set-url",
    label: "jwkSetUrl",
    children: [
      {
        value: "http://127.0.0.1:9000",
        label: "http://127.0.0.1:9000",
      },
      {
        value: "http://127.0.0.1:9000",
        label: "http://127.0.0.1:9000",
      }
    ]
  },
  {
    value: "settings.client.require-authorization-consent",
    label: "Consent",
    children: [
      {
        value: "require-authorization-consent-true",
        label: "true",
      },
      {
        value: "require-authorization-consent-false",
        label: "false",
      }
    ]
  },
]

// interface clientSettings {
//   requireProofKey: string
//   requireAuthorizationConsent: string
//   jwkSetUrl: string
//   tokenEndpointAuthenticationSigningAlgorithm: string
// }

// interface tokenSettings {
//   authorizationCodeTimeToLive: string
//   accessTokenTimeToLive: string
//   accessTokenFormat: string
//   reuseRefreshTokens: string
//   refreshTokenTimeToLive: string
//   idTokenSignatureAlgorithm: string
// }

let authorizationGrantTypes = ref([""]);
let clientSecretExpiresString = ref("");
const clientSettingList= ref(new Array());
const tokenSettingList= ref(new Array());

const isObject = (obj) => {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}

const isArray = (obj) => {
  return Array.isArray(obj) && obj !== null;
}

const pushKV = (key, obj, array) => {
  if (isObject(obj)) {
    Object.entries(obj).map(i => {
      array.push(i[0]);
      pushKV(key, i[1], array)
    })
  } else if (isArray(obj)) {
    array.push(obj[0]);
    array.push(obj[1])
  } else {
    array.push(convertToString(key, obj));
  }
}

const objToArray = (obj, array) => {
  Object.entries(obj).map(i=>{
    array.push(i[0])
    pushKV(i[0], i[1], array)
    return array;
  })
};


const convertToString = (k, v) => {
  if(k.includes(".")){
    const str = k.split(".");
    const length = str.length;
    if(true == v) {
      v = str[length-1] + "-true";
    }
    if(false == v) {
      v = str[length-1] + "-false";
    }
  }
  return v;
} 

const convertToBool = (s) => {
  const str = s.split("-");
  const length = str.length;
  const bool = s.split("-")[length-1];
  if("true" == bool) {
    s = true;
  }
  if("false" == bool) {
    s = false;
  }
  return s;
} 

function handleTokenSetting(data) {
  const map = new Map();
  data.map(i=>{
    if (i[0] == "settings.token.access-token-format" && i.length > 2) {
      if (!map.has(i[0])) {
        const submap = new Map();
        submap.set(i[1], i[2])  
        const obj = Object.fromEntries(submap);
        map.set(i[0], obj);
      } else {
        const obj1 = map.get(i[0]);
        const submap = new Map();
        submap.set(i[1], i[2])  
        const obj2 = Object.fromEntries(submap);
        const obj = Object.assign(obj1, obj2)
        map.set(i[0], obj);
      }
    } else if (i.length > 2) {
      const array = new Array();
      array.push(i[1]);
      array.push(i[2]);
      map.set(i[0], array);
    } else if (i.length = 2)  {
      map.set(i[0], convertToBool(i[1]));
    }
  })
  const obj1 = Object.fromEntries(map);
  var json1 = JSON.stringify(obj1);  
  clientForm.tokenSettings = json1;
}

function handleClientSetting(data) {
  const map = new Map();
  data.map(i=>{
    if (i.length > 2){
      const submap = new Map();
      submap.set(i[1], i[2])
      const obj = Object.fromEntries(submap);
      map.set(i[0], obj);
    } else {
      map.set(i[0], convertToBool(i[1]));
    }
  })
  const obj1 = Object.fromEntries(map);
  var json1 = JSON.stringify(obj1);  
  clientForm.clientSettings = json1;
}

const DeleteClient = (index: number, row: AuthClient) => {
  const option = {
    baseURL: env.apiUrl,
    url: "/auth/client/delete",
    method: "DELETE",
    params: {
      "clientId": row.clientId
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    var count = response.data;
    if (count > 0) {
      data.authclient.splice(index, 1);
    }
  })
}

function clientAdd() {
  const option = {
        baseURL: env.apiUrl,
        url: "/auth/client/add",
        method: "POST",
        data: clientForm,
        headers: {
          'Authorization': 'Bearer '+ access.access_token,
          "Content-Type": "application/json"
        },
      }
  clientForm.authorizationGrantTypes = authorizationGrantTypes.value.toString();
  if (!clientForm.clientSecret.startsWith("{bcrypt}")){
    bcrypt.hash(clientForm.clientSecret, 10).then(function(hash) {
      clientForm.clientSecret = '{bcrypt}' + hash ;
      axios(option).then(function (response) {
        if(response.data.length > 0) {
          visible.authClientForm = false ;
          authClientList();
        }
      })
    });
  } else {
      axios(option).then(function (response) {
        if(response.data.length > 0) {
          visible.authClientForm = false ;
          authClientList();
        }
      })
  }
}

function authClientList() {
  visible.authClientTable = true;
  const option = {
    baseURL: env.apiUrl,
    url: "/auth/client/list",
    method: "GET",
    // params: {
    //   "param": search.value,
    //   "pageNumber": recordPage.pageNumber-1,
    //   "pageSize": recordPage.pageSize
    // },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    data.authclient=response.data;
  })
}

function openClientAdd() {
  if (selectAuthId.length > 1) {
    ElMessageBox.alert("dont support batch update")
  } else if (selectAuthId.length == 1){
    const authClient = multipleAuthSelect.value[0];
    const clientset = JSON.parse(authClient.clientSettings);
    const tokenset = JSON.parse(authClient.tokenSettings);
    const clientArray = new Array();
    const tokenArray = new Array();
    objToArray(clientset, clientArray);
    objToArray(tokenset, tokenArray);
    clientSettingList.value = clientArray;
    tokenSettingList.value = tokenArray;
    clientSecretExpiresString.value = dayjs.unix(parseInt(authClient.clientSecretExpiresAt, 10)).format("YYYY-MM-DDTHH:mm:ss[Z]");    
    authorizationGrantTypes.value = authClient.authorizationGrantTypes.split(",");
    clientForm = multipleAuthSelect.value[0];
    visible.authClientForm = true ;
  } else {
    clientForm.clientId = "";
    visible.authClientForm = true ;
  }
}

const multipleAuthSelect = ref<AuthClient[]>([])

const handleAuthSelectChange = (val: AuthClient[]) => {
  multipleAuthSelect.value = val ;
  selectAuthId.splice(0, selectAuthId.length);
  for(let i of multipleAuthSelect.value) {
    selectAuthId.push(i.clientId);
  }
}

const authClientPageChange = (newPage: number) => {
  authPage.pageNumber = newPage;
  // if (search.value != '') {
    // filterByParam(recordPage.pageNumber, recordPage.pageSize);
  // } else {
    authClientList();
  // }
}

const authClientPageSizeChange = (newPage: number) => {
  // recordPage.pageSize = newPage;
  // if (search.value != '') {
    // filterByParam(recordPage.pageNumber, recordPage.pageSize);
  // } else {
    authClientList();
  // }
}

const selectAuthId:string[] = [];
 
function issusedTimestamp(row:AuthClient) {
  const dateString = dayjs.unix(parseInt(row.clientIdIssuedAt, 10)).format("YYYY-MM-DDTHH:mm:ss[Z]");
  return dateString;
}

function expiredTimestamp(row:AuthClient) {
  const dateString = dayjs.unix(parseInt(row.clientSecretExpiresAt, 10)).format("YYYY-MM-DDTHH:mm:ss[Z]");
  return dateString;
}

defineExpose({
  authClientList
})
</script>