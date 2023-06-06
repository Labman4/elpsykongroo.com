<template>
  <el-dialog v-model="storageForm" title="Object"  width="80%">
    <el-button type="" @click="openUpload()">upload</el-button>
    <el-table :data="data.files">
      <el-table-column property="key" label="file" width="auto"/>
      <el-table-column property="timestamp" label="lastModified" :formatter="formatTimestamp" sortable/>
      <el-table-column property="size" label="size" :formatter="kb"/>
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteObject(scope.$index, scope.row)">Delete</el-button>
        <el-button size="small" type="primary" @click="downloadObject(scope.row)">Download</el-button>
      </template>
      </el-table-column>
    </el-table>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible.userInfoForm = false">Cancel</el-button>
        <el-button type="primary" @click="updateUserInfo()" >Confirm</el-button>
        <el-button type="primary" @click="resetUseInfo(userInfoTableData.username)" >Reset</el-button> 
        
      </span>
    </template> -->
  </el-dialog>

  <el-dialog v-model="uploadForm" title="upload"  width="80%">
    <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        action=https://api.elpsykongroo.com/storage/object
        method="PUT"
        name="data"
        :data=uploadInfo
        :auto-upload=true
        multiple
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="10"
        :on-exceed="handleExceed"
        :on-success="refreshList"
    >
        <el-button type="primary">Click to upload</el-button>
        <template #tip>
        <div class="el-upload__tip">
            upload anything
        </div>
        </template>
    </el-upload>
</el-dialog>

</template>

<script lang="ts" setup>
import { axios } from '~/assets/ts/axio';
import fileDownload from 'js-file-download';
import { env } from '~/assets/ts/env';
import { access } from '~/assets/ts/access';
import { ElMessage, ElMessageBox, UploadProps, UploadUserFile } from 'element-plus';
import { dayjs } from 'element-plus';


interface ListObject {
    "key": string
    "timestamp": number
    "size": number
}

const storageForm = ref(false)
const uploadForm = ref(false)

const files = [{}];
const data = reactive({files});

const fileList = ref<UploadUserFile[]>([])

const uploadInfo: Record<string, string> = {
    bucket: "test",
    idToken: access.id_token
}
const kb = (row: ListObject) => {
    let size = row.size/1024
    if (size > 1024) {
        size = size/1024
        if (size > 1024) {
            size = size/1024
            return size.toFixed(1) + "GB"

        } else {
            return size.toFixed(1) + "MB"
        }
    } else {
            return size.toFixed(1) + "kb"
    }
   
}
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const refreshList: UploadProps['onExceed'] = (files, uploadFiles) => {
    listObject();
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}

const openUpload = () => {
    uploadForm.value = true;
}

const listObject = () => {
    storageForm.value = true
    const option = {
        baseURL: env.apiUrl,
        url: "/storage/object/list",
        method: "POST",
        data: {
            bucket: "test",
            idToken: access.id_token
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token
        }
    }
    axios(option).then(function (response) {
        data.files = response.data;
    })   
}

const deleteObject = (index:number, row: ListObject) => {
    const option = {
        baseURL: env.apiUrl,
        url: "/storage/object/delete",
        method: "POST",
        data: {
            bucket: "test",
            key: row.key,
            idToken: access.id_token
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token
        }
    }
    axios(option).then(function (response) {
        if (response.status == 200) {
            data.files.splice(index, 1);
        }    
    })   
}

async function downloadObject (row: ListObject)  {
    const option = {
        baseURL: env.apiUrl,
        url: "/storage/object/download",
        method: "POST",
      
        headers: {
            'Authorization': 'Bearer '+ access.access_token
        },
        // responseType: 'blob',
        onDownloadProgress: function (axiosProgressEvent) {
            /*{
            loaded: number;
            total?: number;
            progress?: number;
            bytes: number; 
            estimated?: number;
            rate?: number; // download speed in bytes
            download: true; // download sign
            }*/
        }
    }
    axios({
        method: 'POST',
        url: env.apiUrl + "/storage/object/download",
        responseType: 'blob',
        data: {    
            bucket: "test",
            key: row.key,
            idToken: access.id_token
        },   
        headers: {
            'Authorization': 'Bearer '+ access.access_token
        },
    }).then(function(response){
        fileDownload(response.data, row.key);
    })


    // await axios.post(env.apiUrl+ "/storage/object/download", data, {});  
}

function formatTimestamp(row:ListObject) {
    return dayjs(row.timestamp*1000).format("YYYY-MM-DD HH:mm:ss");
}

defineExpose({
    listObject
 })
</script>