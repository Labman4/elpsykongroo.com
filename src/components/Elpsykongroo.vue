<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    :collapse="false">
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>Gateway
      </template>
      <el-menu-item-group>
        <el-menu-item index="1-1" click="ipList">ip</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-2">
        <template #title><span>record</span></template>
        <el-menu-item index="1-2-1" @click="recordList(recordPage.pageNumber,recordPage.pageSize,'1')" >Asc</el-menu-item>
        <el-menu-item index="1-2-2" @click="recordList(recordPage.pageNumber,recordPage.pageSize,'0')" >Desc</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item>
      <el-icon><setting /></el-icon>
      <template #title v-if="access.grant_type !='authorization_code'">{{access.expires_in}}s</template>
    </el-menu-item>
  </el-menu>

  <el-dialog v-model="ipTableVisible" title="address">
    <el-button type="" @click="openIpAdd">Add</el-button>
    <el-table :data="datas.ips">
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

  <el-dialog v-model="ipFormVisible" title="">
    <el-form :model="form">
        <el-form-item label="type" :label-width="ipFormLabelWidth">
        <el-select v-model="form.black" placeholder="">
          <el-option label="white" value="false" />
          <el-option label="black" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="address" :label-width="ipFormLabelWidth">
        <el-input v-model="form.address" autocomplete="off" @keyup.enter="ipListAdd" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="ipFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="ipListAdd" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="recordTableVisible" title="records" style="width: 70%">
    <el-button type="danger" click="DeleteSelect">DeleteSelect</el-button>
    <el-table :data="datas.records" @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column property="sourceIP" label="address" width="130px" >
      </el-table-column>
      <el-table-column property="accessPath" label="path"  width="170px">
      </el-table-column>
      <el-table-column property="userAgent" label="userAgent"  width="300px">
      </el-table-column>
      <el-table-column property="timestamp" label="date" :formatter="timestamp" sortable/>
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
import axios from 'axios';
import { access } from '../access';
import { reactive, ref } from 'vue'
import moment  from 'moment';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import {
  Location,
  Setting,
} from '@element-plus/icons-vue'

const ips = [{}];
const records:Record[]= [];
const recordPage = {
  "pageNumber": 1,
  "pageSize": 10,
  "order": "0"
};

const ipPage = {
  "pageNumber": 1,
  "pageSize": 20,
  "order": "0"
};

const form =  reactive({
  "address": "",
  "black": ""
})

const datas = reactive({ips, records});
const ipTableVisible=ref(false);
const recordTableVisible=ref(false);
const ipFormVisible=ref(false)
const ipFormLabelWidth="100px";
const baseURL='https://api.elpsykongroo.com/';
// const baseURL='http://localhost:8080/';

interface Record {
  timestamp: string
  id: string
  accessPath: string
  sourIP: string
  userAgent: string
}

interface IP {
  address: string
  black: string
  id: string
}

const search = ref('')

function filterByParam(pageNumber:number, pageSize:number) {
  const option = {
    baseURL: baseURL,
    url: "/record/filter",
    method: "POST",
    params: {
      "param": search.value,
      "pageNumber": recordPage.pageNumber-1,
      "pageSize": recordPage.pageSize
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    datas.records=response.data.data;
  })
 }

function openIpAdd() {
  ipFormVisible.value = true ;
}

function ipListAdd() {
    ipFormVisible.value = false ;
    const option = {
    baseURL: baseURL,
    url: "/ip/manage/add",
    method: "PUT",
    params: {
      black: form.black,
      address: form.address,
    },
    headers: {
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    const len = response.data.data.length;
    if (len > 0) {
      ipList(ipPage.pageNumber, ipPage.pageSize, ipPage.order);   
    }
  })

}
function ipList(pageNumber:number, pageSize:number, order:string) {
  ipTableVisible.value = true;
  const option = {
    baseURL: baseURL,
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
    datas.ips=response.data.data;
  })
}

const DeleteIP = (index: number, row: IP) => {
  const option = {
    baseURL: baseURL,
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
      datas.ips.splice(index, 1);
    }
  }) 
}

function recordList(pageNumber:number, pageSize:number, order:string) {
  recordTableVisible.value = true;
  recordPage.order = order;
  const option = {
    baseURL: baseURL,
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
  datas.records = response.data.data;
  })
}
const ipPageChange = (newPage: number) => {
  ipPage.pageNumber = newPage;
  ipList(ipPage.pageNumber, ipPage.pageSize, ipPage.order);
}

const ipPageSizeChange = (newPage: number) => {
  ipPage.pageSize = newPage;
  ipList(ipPage.pageNumber, ipPage.pageSize, ipPage.order);
}

const recordPageChange = (newPage: number) => {
  recordPage.pageNumber = newPage;
  if (search.value != '') {
    filterByParam(recordPage.pageNumber, recordPage.pageSize);
  } else {
    recordList(recordPage.pageNumber, recordPage.pageSize, recordPage.order);
  }
}

const recordPageSizeChange = (newPage: number) => {
  recordPage.pageSize = newPage;
  if (search.value != '') {
    filterByParam(recordPage.pageNumber, recordPage.pageSize);
  } else {
    recordList(recordPage.pageNumber, recordPage.pageSize, recordPage.order);
  }
}

const multipleSelection = ref<Record[]>([])

const selectRecord:string[] = [];

const handleSelectionChange = (val: Record[]) => {
  multipleSelection.value = val;
  selectRecord.splice(0, selectRecord.length);
  for(let i of multipleSelection.value) {
    selectRecord.push(i.id);
  }
}

const DeleteSelect= (index: number) => {
  const option = {
    baseURL: baseURL,
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
        datas.records.forEach(function(i, ind){
            if (item === i.id) {
              datas.records.splice(ind, 1)
            }
        }) 
      });
      if (datas.records.length == 0) {
        if (search.value != '') {
          filterByParam(recordPage.pageNumber, recordPage.pageSize);
        } else {
          recordList(recordPage.pageNumber, recordPage.pageSize, recordPage.order);
        }
      } 
    }
    // if (count == selectRecord.length) {
    //   for (let r of Array.prototype.values.call(record.values)) {
    //     const flag = selectRecord.indexOf(r.id);
    //     console.log(r.id)
    //     if (flag > -1) {
    //       const index = datas.records.findIndex((i) => i.id = r.id);
    //       console.log(index);
    //       datas.records.splice(index, 1);
    //     }
    //   }
    //   recordTable.value!.clearSelection()
    // }

  })
    
}

const DeleteRecord = (index: number, row: Record) => {
  const option = {
    baseURL: baseURL,
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
      datas.records.splice(index, 1);
    }
  })
}

function timestamp(row:Record, column:TableColumnCtx<Record>) {
  return moment(row.timestamp).format("YYYY-MM-DD HH:mm:ss");

}
</script>
<style scoped>
/* .example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
} */
/* .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 200px;
} */
</style>
