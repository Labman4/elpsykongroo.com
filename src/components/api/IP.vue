<template>
  <el-dialog v-model="ipTable" title="address" width="75%">
    <el-button type="" @click="openIpAdd">Add</el-button>
    <el-table :data="data.ips">
      <el-table-column property="address" label="address" width="auto"/>
      <el-table-column property="black" label="black" width="100px"/>
      <el-table-column property="timestamp" label="date" sortable width="auto"/>
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" type="danger" @click="block(scope.$index, scope.row)"> 
         <span v-if="!scope.row.black">block</span>
         <span v-if="scope.row.black">unblock</span>
        </el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next, sizes" :total="50" 
      :current-page="ipPage.pageNumber"  
      :page-size="ipPage.pageSize"
      @update:current-page="ipPageChange"
      @update:page-size="ipPageSizeChange"/>
  </el-dialog>
  <el-dialog v-model="ipForm" title="" width="75%">
    <el-form :model="ipFormData">
        <el-form-item label="type" :label-width="visible.ipFormLabelWidth">
        <el-select v-model="ipFormData.black" placeholder="">
          <el-option label="white" value="false" />
          <el-option label="black" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="address" :label-width="visible.ipFormLabelWidth">
        <el-input v-model="ipFormData.address" autocomplete="off" @keyup.enter="addIp" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="ipForm = false">Cancel</el-button>
        <el-button type="danger" @click="DeleteIP">delete</el-button>
        <el-button type="primary" @click="addIp" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>

import { env } from '~/assets/ts/env';
import { access } from '~/assets/ts/access';
import { visible } from '~/assets/ts/visible';
import { axios } from '~/assets/ts/axio';
import { ElDialog, ElButton, ElTable, ElTableColumn, ElPagination, ElForm, ElFormItem, ElSelect, ElInput } from 'element-plus';

const ipForm = ref(false);
const ipTable =ref(false);

const ips = [{}];
const data = reactive({ips});

interface IP {
  address: string
  black: string
  id: string
}

const ipPage = {
  "pageNumber": 1,
  "pageSize": 20,
  "order": 0
};

const ipFormData =  reactive({
  "address": "",
  "black": ""
})

function openIpAdd() {
  ipForm.value = true ;
}

function addIp() {
    ipForm.value = false ;
    const option = {
    baseURL: env.apiUrl,
    url: "/ip",
    method: "PUT",
    params: {
      black: ipFormData.black,
      address: ipFormData.address,
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
      ipList();   
    
  })
}

const ipList = () => {
  ipTable.value = true;
  const option = {
    baseURL: env.apiUrl,
    url: "/ip",
    method: "GET",
    params: {
      black: "",
      pageNumber: ipPage.pageNumber-1,
      pageSize: ipPage.pageSize,
      order: ipPage.order
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    data.ips=response.data;
  })
}

const DeleteIP = () => {
  const option = {
    baseURL: env.apiUrl,
    url: "/ip",
    method: "PATCH",
    params: {
      black: "",
      address: ipFormData.address,
      id: "",
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    if (response.status == 200) {
      ipForm.value = false
      ipList()
    }
  }) 
}

const ipPageChange = (newPage: number) => {
  ipPage.pageNumber = newPage;
  ipList();
}

const ipPageSizeChange = (newPage: number) => {
  ipPage.pageSize = newPage;
  ipList();
}

const block = (index: number, row: IP) => {
  const option = {
    baseURL: env.apiUrl,
    url: "/ip",
    method: "PATCH",
    params: {
      "address": "",
      "black": !row.black,
      "id": row.id
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    ipList()
  }) 
}
defineExpose({
  ipList
})
</script>
