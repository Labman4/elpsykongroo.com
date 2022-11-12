<template>
    <el-dropdown id="domainlist" v-if = "access.expires_in > 0">
      <span class="el-dropdown-link">
        <el-button size="small" @click="access.update(access.access_token, access.expires_in)">
         {{access.expires_in}}s
        </el-button>
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="ipList" >ip manage</el-dropdown-item>
          <el-dropdown-item @click="recordList" >access record</el-dropdown-item>
          <el-dropdown-item>Kubernetes-dashboard</el-dropdown-item>
          <el-dropdown-item>Linkerd</el-dropdown-item>
          <el-dropdown-item>Jaeger</el-dropdown-item>
          <!-- <el-dropdown-item divided>Action 5</el-dropdown-item> -->
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  <el-dialog v-model="ipTableVisible" title="address">
    <el-button type="" @click="openIpAdd">Add</el-button>
    <el-table :data="datas.ips">
      <el-table-column property="address" label="address" width="300px"/>
      <el-table-column property="black" label="black"/>
      <el-table-column label="Operations">
      <template #default="scope">
        <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button> -->
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
  <el-dialog v-model="recordTableVisible" title="records">
    <el-button type="danger" @click="DeleteSelect">DeleteSelect</el-button>
    <el-table :data="datas.records" @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column property="sourceIP" label="address" />
      <el-table-column property="accessPath" label="path"  width="300px"/>
      <el-table-column property="userAgent" label="userAgent"/>
      <el-table-column property="timestamp" label="date" :formatter="timestamp" sortable/>
      <el-table-column label="Operations">
      <template #default="scope">
        <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button> -->
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
  <el-dialog v-model="ipFormVisible" title="">
      <el-form :model="form">
         <el-form-item label="type" :label-width="ipFormLabelWidth">
          <el-select v-model="form.black" placeholder="white">
            <el-option label="white" value="true" />
            <el-option label="black" value="false" />
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
  </template>
  
<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import axios from 'axios';
import { access } from '../access';
import { reactive, ref } from 'vue'
import moment  from 'moment';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
const ips = [{}];
const records:Record[]= [];
const record:Record[] = []

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
  "address": '',
  "black": "true"
})
const datas = reactive({ips, records});
const ipTableVisible=ref(false);
const recordTableVisible=ref(false);
const ipFormVisible=ref(false)
const ipFormLabelWidth="100px";
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

function openIpAdd() {
  ipFormVisible.value = true ;

}


function ipListAdd() {
    ipFormVisible.value = false ;
    const option = {
    url: "/ip/manage/add",
    method: "PUT",
    params: {
      black: form.black,
      address: form.address,
    },
    headers: {
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'POST',
    // 'Access-Control-Allow-Headers': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function(response){
    console.log(response.data);
    if (response.data.length > 0) {
      console.log(1)
      ipList(ipPage.pageNumber, ipPage.pageSize, ipPage.order);
      
    }
  })
}
function ipList(pageNumber:number, pageSize:number, order:string) {
  ipTableVisible.value = true;
  const option = {
    url: "/ip/manage/list",
    method: "GET",
    params: {
      black: "",
      pageNumber: ipPage.pageNumber-1,
      pageSize: ipPage.pageSize
    },
    headers: {
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'POST',
    // 'Access-Control-Allow-Headers': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    datas.ips=response.data.data.content;
  })
}

function recordList(pageNumber:number, pageSize:number, order:string) {
  recordTableVisible.value = true;
  const option = {
    url: "/record/access",
    method: "GET",
    params: {
      "pageNumber": recordPage.pageNumber-1,
      "pageSize": recordPage.pageSize,
      "order": recordPage.order
    },
    headers: {
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'POST',
    // 'Access-Control-Allow-Headers': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer '+ access.access_token
  },
}
axios(option).then(function (response) {
  record.values = response.data.data.content;
  datas.records = response.data.data.content;
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
  recordList(recordPage.pageNumber, recordPage.pageSize, recordPage.order);
}

const recordPageSizeChange = (newPage: number) => {
  recordPage.pageSize = newPage;
  recordList(recordPage.pageNumber, recordPage.pageSize, recordPage.order);
}

const multipleSelection = ref<Record[]>([])

const selectRecord:string[] = [];

const handleSelectionChange = (val: Record[]) => {
  multipleSelection.value = val;
  selectRecord.splice(0, selectRecord.length);
  for(let i of multipleSelection.value) {
    selectRecord.push(i.id);
  }
  console.log(selectRecord);
}

const DeleteSelect= (index: number) => {
  const option = {
    url: "/record/delete",
    method: "DELETE",
    params: {
      "sourceIP": "",
      "id": selectRecord.toString(),
    },
    headers: {
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'POST',
    // 'Access-Control-Allow-Headers': 'application/x-www-form-urlencoded',
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
        recordList(recordPage.pageNumber, recordPage.pageSize, recordPage.order);
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
    url: "/record/delete",
    method: "DELETE",
    params: {
      "sourceIP": "",
      "id": row.id,
    },
    headers: {
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'POST',
    // 'Access-Control-Allow-Headers': 'application/x-www-form-urlencoded',
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
const DeleteIP = (index: number, row: IP) => {
  const option = {
    url: "/ip/manage/patch",
    method: "PATCH",
    params: {
      "address": "",
      "black": "",
      "id": row.id
    },
    headers: {
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'POST',
    // 'Access-Control-Allow-Headers': 'application/x-www-form-urlencoded',
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






function timestamp(row:Record, column:TableColumnCtx<Record>) {
  return moment(row.timestamp).format("YYYY-MM-DD HH:mm:ss");

}
</script>
<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

/* #domainlist {
  position: absolute;left: 0px; top: 50px;
} */
</style>
