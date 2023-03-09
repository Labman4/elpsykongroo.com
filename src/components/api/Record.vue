<template>
    <el-dialog v-model="visible.recordTable" title="records" width="70%">
    <el-button type="danger" @click="DeleteSelect()">DeleteSelect</el-button>
    <el-table :data="data.records" @selection-change="handleRecordSelectChange">
      <el-table-column type="selection"/>
      <el-table-column property="sourceIP" label="address" width="130px" />
      <el-table-column property="accessPath" label="path"  width="170px"/>
      <el-table-column property="userAgent" label="userAgent"  width="300px"/>
      <el-table-column property="timestamp" label="date" :formatter="recordTimestamp" sortable/>
      <el-table-column  align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search"  @keyup.enter="filterByParam" />
      </template>
      <template #default="scope">
        <el-button
          size="small"
          type="danger"
          @click="DeleteRecord(scope.$index, scope.row)"
          >Delete</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next, sizes" :total="50" 
      :current-page="recordPage.pageNumber"  
      :page-size="recordPage.pageSize"
      @update:current-page="recordPageChange"
      @update:page-size="recordPageSizeChange"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import { axios } from '~/assets/ts/axio';
import { dayjs } from 'element-plus';
import { access } from '~/assets/ts/access';
import { env } from '~/assets/ts/env';
import { visible } from '~/assets/ts/visible';

const records:Record[]= [];

const data = reactive({records})

const recordPage = {
  "pageNumber": 1,
  "pageSize": 10,
  "order": "0"
};

interface Record {
  timestamp: string
  id: string
  accessPath: string
  sourIP: string
  userAgent: string
}

const handleRecordSelectChange = (val: Record[]) => {
  multipleRecordSelect.value = val;
  selectRecord.splice(0, selectRecord.length);
  for(let i of multipleRecordSelect.value) {
    selectRecord.push(i.id);
  }
}

const multipleRecordSelect = ref<Record[]>([])

const selectRecord:string[] = [];

const DeleteSelect= () => {
  const option = {
    baseURL: env.apiUrl,
    url: "/record/delete",
    method: "DELETE",
    params: {
      "sourceIP": "",
      "id": selectRecord.toString(),
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    var count = response.data.data;
    if (count == selectRecord.length) {
      selectRecord.forEach(function(item, index){
        data.records.forEach(function(i, ind){
            if (item === i.id) {
              data.records.splice(ind, 1)
            }
        }) 
      });
      if (data.records.length == 0) {
        if (search.value != '') {
          filterByParam();
        } else {
          recordList(recordPage.order);
        }
      } 
    }
    // if (count == selectRecord.length) {
    //   for (let r of Array.prototype.values.call(record.values)) {
    //     const flag = selectRecord.indexOf(r.id);
    //     console.log(r.id)
    //     if (flag > -1) {
    //       const index = data.records.findIndex((i) => i.id = r.id);
    //       console.log(index);
    //       data.records.splice(index, 1);
    //     }
    //   }
    //   recordTable.value!.clearSelection()
    // }

  })
    
}

const DeleteRecord = (index: number, row: Record) => {
  const option = {
    baseURL: env.apiUrl,
    url: "/record/delete",
    method: "DELETE",
    params: {
      "sourceIP": "",
      "id": row.id,
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    var count = response.data.data;
    if (count > 0) {
      data.records.splice(index, 1);
    }
  })
}

function recordTimestamp(row:Record) {
  return dayjs(row.timestamp).format("YYYY-MM-DD HH:mm:ss");
}
  
  
function recordList(order:string) {
  visible.recordTable = true;
  recordPage.order = order;
  const option = {
    baseURL: env.apiUrl,
    url: "/record/access",
    method: "GET",
    params: {
      "pageNumber": recordPage.pageNumber-1,
      "pageSize": recordPage.pageSize,
      "order": recordPage.order
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  } 
  axios(option).then(function (response) {
  data.records = response.data.data;
  })
}

const recordPageChange = (newPage: number) => {
  recordPage.pageNumber = newPage;
  if (search.value != '') {
    filterByParam();
  } else {
    recordList(recordPage.order);
  }
}

const recordPageSizeChange = (newPage: number) => {
  recordPage.pageSize = newPage;
  if (search.value != '') {
    filterByParam();
  } else {
    recordList(recordPage.order);
  }
}
const search = ref('')

function filterByParam() {
  const option = {
    baseURL: env.apiUrl,
    url: "/record/filter",
    method: "POST",
    data: {
      "param": search.value,
      "pageNumber": recordPage.pageNumber-1,
      "pageSize": recordPage.pageSize
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token,
      "Content-Type": "application/x-www-form-urlencoded"
    },
  }
  axios(option).then(function (response) {
    data.records=response.data.data;
  })
 }

 defineExpose({
  recordList
})
</script>