<template>
    <el-dialog  v-model="recordTable" :width=visible.dialogWidth>
      <el-button type="danger" @click="DeleteSelect()">DeleteSelect</el-button>
      <el-button type="" @click="recordForm = true">batch</el-button>
      <el-button type="" @click="recordList(recordPage.order)">refresh</el-button>
    <el-table :data="data.records" 
      :infinite-scroll-distance=30 
      :infinite-scroll-immediate=false 
      v-infinite-scroll=list @selection-change="handleRecordSelectChange">
      <el-table-column type="selection"/>
      <el-table-column property="accessPath" label="path"  width="170px"/>
      <el-table-column property="userAgent" label="userAgent"  width="300px"/>
      <el-table-column property="timestamp" label="date" :formatter="recordTimestamp" sortable/>
      <el-table-column property="sourceIP" label="address" width="130px" />
      <el-table-column  align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search"  @keyup.enter="filterByParam" />
      </template>
      <template #default="scope">
        <el-button size="small" type="" @click="openRecord(scope.row)">headers</el-button>
        <el-button size="small" type="danger" @click="DeleteRecord(scope.$index, scope.row)">Delete</el-button>
        <el-button size="small" type="danger" @click="block(scope.$index, scope.row.sourceIP, 'false', '')">lock</el-button>
      </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination layout="prev, pager, next, sizes" :total="50" 
      :current-page="recordPage.pageNumber"  
      :page-size="recordPage.pageSize"
      @update:current-page="recordPageChange"
      @update:page-size="recordPageSizeChange"/> -->
  </el-dialog>

  <el-dialog v-model="recordForm" :width=visible.dialogWidth>
    <el-form :model="recordFormData">
      <el-form-item label="address" :label-width="visible.labelWidth">
        <el-input v-model="recordFormData.sourceIP" autocomplete="off" @keyup.enter="DeleteCustom" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="recordForm = false">Cancel</el-button>
        <el-button type="danger" @click="DeleteCustom">delete</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="recordHeader" :width=visible.dialogWidth>
      <pre>{{ requestHeader }}</pre>
  </el-dialog>
  <IP ref="ip"></IP>

</template>

<script lang="ts" setup>
import { axios } from '~/assets/ts/axio';
import { visible } from '~/assets/ts/visible';
import { dayjs } from 'element-plus';
import { access } from '~/assets/ts/access';
import { env } from '~/assets/ts/env';
import IP from '~/components/api/IP.vue';
const recordForm = ref(false)
const recordHeader = ref(false)
const requestHeader = ref("")
const ip = ref<InstanceType<typeof IP> | null>(null)

const records:Record[]= [];

const recordTable =ref(false);

const data = reactive({records})

const recordFormData =  reactive({
  timestamp: "",
  id: "",
  accessPath: "",
  sourceIP: "",
  userAgent: "",
  requestHeader: {}
})

const recordPage = {
  "pageNumber": 1,
  "pageSize": 10,
  "order": "0"
};

interface Record {
  timestamp: string
  id: string
  accessPath: string
  sourceIP: string
  userAgent: string
  requestHeader: object
}

const handleRecordSelectChange = (val: Record[]) => {
  multipleRecordSelect.value = val;
  selectRecord.splice(0, selectRecord.length);
  for(let i of multipleRecordSelect.value) {
    selectRecord.push(i.id);
  }
}
 
const block = (index: number, address, black, id) => {
  ip.value?.ipBlock(index, address, black, id)
}

const multipleRecordSelect = ref<Record[]>([])

const selectRecord:string[] = [];

const DeleteSelect= () => {
  const option = {
    baseURL: env.apiUrl,
    url: "/record/" + selectRecord.toString(),
    method: "DELETE",
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    if (response.status == 200) {
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

const DeleteCustom = () => {
  const option = {
    baseURL: env.apiUrl,
    url: "/record/" + recordFormData.sourceIP,
    method: "DELETE",
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    if (response.status == 200) {
      ElMessageBox.alert("delete amount:" + response.data)
      recordList(recordPage.order)
    }
  })
}

const openRecord = (row) => {
    recordHeader.value = true
    requestHeader.value = JSON.stringify(row.requestHeader, null, 2)  
    // console.log(requestHeader.value)
}
const DeleteRecord = (index: number, row: Record) => {
  const option = {
    baseURL: env.apiUrl,
    url: "/record/" + row.id,
    method: "DELETE",
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  }
  axios(option).then(function (response) {
    if (response.status == 200) {
      data.records.splice(index, 1);
    }
  })
}

function recordTimestamp(row:Record) {
  return dayjs(row.timestamp).format("YYYY-MM-DD HH:mm:ss");
}

var scrollId

const recordList = async(order:string) => {
   recordPage.order = order
   list()
}

const list = async() => {
  recordTable.value = true;
  const option = {
    baseURL: env.apiUrl,
    url: "/record",
    method: "GET",
    params: {
      "pageNumber": recordPage.pageNumber-1,
      "pageSize": recordPage.pageSize,
      "order": recordPage.order,
      "id": scrollId
    },
    headers: {
      'Authorization': 'Bearer '+ access.access_token
    },
  } 
  await axios(option).then(function (response) {
    if (response.status == 200) {
      data.records = response.data["hits"]
      scrollId = response.data["scrollId"]
    }
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
  if (search.value != '') {
    const option = {
      baseURL: env.apiUrl,
      url: "/record",
      method: "POST",
      data: {
        "params": search.value,
        "pageNumber": recordPage.pageNumber-1,
        "pageSize": recordPage.pageSize,
        "order": recordPage.order
      },
      headers: {
        'Authorization': 'Bearer '+ access.access_token,
        "Content-Type": "application/x-www-form-urlencoded"
      },
    }
    axios(option).then(function (response) {
      data.records=response.data;
    })
  } else {
    recordList(recordPage.order);
  }
}

 defineExpose({
  recordList
})
</script>