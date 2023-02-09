<template>
  <el-dialog v-model="visible.ipTable" title="address">
    <el-button type="" @click="openIpAdd">Add</el-button>
    <el-table :data="data.ips">
      <el-table-column property="address" label="address" width="300px"/>
      <el-table-column property="black" label="black"/>
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button
          size="small"
          type="danger"
          @click="DeleteIP(scope.$index, scope.row)"
          >Delete</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next, sizes" :total="50" 
      :current-page="ipPage.pageNumber"  
      :page-size="ipPage.pageSize"
      @update:current-page="ipPageChange"
      @update:page-size="ipPageSizeChange"/>
  </el-dialog>
  <el-dialog v-model="visible.ipForm" title="">
    <el-form :model="ipForm">
        <el-form-item label="type" :label-width="visible.ipFormLabelWidth">
        <el-select v-model="ipForm.black" placeholder="">
          <el-option label="white" value="false" />
          <el-option label="black" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="address" :label-width="visible.ipFormLabelWidth">
        <el-input v-model="ipForm.address" autocomplete="off" @keyup.enter="ipListAdd" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible.ipForm = false">Cancel</el-button>
        <el-button type="primary" @click="ipListAdd" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>

import { env } from '~/assets/js/env';
import { access } from '~/assets/js/access';
import { visible } from '~/assets/js/visible';
import { axios } from '~/assets/js/axio';
import { ElDialog, ElButton, ElTable, ElTableColumn, ElPagination, ElForm, ElFormItem, ElSelect, ElOption, ElInput } from 'element-plus';

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
};

const ipForm =  reactive({
  "address": "",
  "black": ""
})

function openIpAdd() {
  visible.ipForm = true ;
}

function ipListAdd() {
    visible.ipForm = false ;
    const option = {
    baseURL: env.apiUrl,
    url: "/ip/manage/add",
    method: "PUT",
    params: {
      black: ipForm.black,
      address: ipForm.address,
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    const len = response.data.data.length;
    if (len > 0) {
      ipList();   
    }
  })
}

const ipList = () => {
  visible.ipTable = true;
  const option = {
    baseURL: env.apiUrl,
    url: "/ip/manage/list",
    method: "GET",
    params: {
      black: "",
      pageNumber: ipPage.pageNumber-1,
      pageSize: ipPage.pageSize
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    data.ips=response.data.data;
  })
}

const DeleteIP = (index: number, row: IP) => {
  const option = {
    baseURL: env.apiUrl,
    url: "/ip/manage/patch",
    method: "PATCH",
    params: {
      "address": "",
      "black": row.black,
      "id": row.id
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    var count = response.data.data;
    if (count == "done") {
      data.ips.splice(index, 1);
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

defineExpose({
  ipList
})
</script>
