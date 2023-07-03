<template>
  <el-dialog v-model="storageTable" title="Object"  width="80%">
    <el-button type="" @click="openUpload()">upload</el-button>
    <el-button type="" @click="s3Form = true">connect</el-button>
    <el-button type="" @click="s3InfoTable = true">load</el-button>
    <el-table :data="data.files">
      <el-table-column property="key" label="file" width="auto"/>
      <el-table-column property="timestamp" label="lastModified" :formatter="formatTimestamp" sortable/>
      <el-table-column property="size" label="size" :formatter="kb"/>
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteS3(scope.$index, scope.row)">Delete</el-button>
        <el-button size="small" type="primary" @click="downloadUrl(scope.row)">Download</el-button>
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
        action=https://storage.elpsykongroo.com/storage/object
        method="POST"
        :headers=uploadHeader
        name="data"
        :data=uploadInfo
        :auto-upload=true
        multiple
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="10"
        :on-success="refreshList"
        :http-request="upload"
        :on-exceed="continueUpload"
        >
        <el-button type="primary">Click to upload</el-button>
        <template #tip>
        <div class="el-upload__tip">
            upload anything
        </div>
        </template>
    </el-upload>
</el-dialog>

<el-dialog v-model="s3InfoTable" title="Object"  width="80%">
    <el-table :data="data.s3InfoList">
      <el-table-column property="accessKey" label="accessKey"/>
      <el-table-column property="accessSecret" label="accessSecret"/>
      <el-table-column property="endpoint" label="endpoint" />
      <el-table-column property="region" label="region" />
      <el-table-column property="platform" label="platform" />
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteS3Info(scope.$index, scope.row)">Delete</el-button>
        <el-button size="small" type="primary" @click="loadS3Info(scope.$index, scope.row)">select</el-button>
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

<el-dialog
    v-model="s3Form"
    title="Warning"
    width="80%"
    align-center>
    <span>need to connect to s3 from other platform?</span>
    <el-form :model="s3FormData">
        <el-form-item label="platform" :label-width=visible.formLabelWidth>
          <el-input v-model="s3FormData.platform" placeholder="default"/>       
        </el-form-item>
        <el-form-item label="accessKey" :label-width=visible.formLabelWidth>
          <el-input v-model="s3FormData.accessKey"/>       
        </el-form-item>
        <el-form-item label="accessSecret" :label-width=visible.formLabelWidth>
          <el-input v-model="s3FormData.accessSecret" />
        </el-form-item>
        <el-form-item label="endpoint" :label-width=visible.formLabelWidth>
          <el-input v-model="s3FormData.endpoint" />
        </el-form-item>
        <el-form-item label="region" :label-width=visible.formLabelWidth>
          <el-input v-model="s3FormData.region" />
        </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="storageTable = true, s3Form = false">Cancel</el-button>
        <el-button type="primary" @click="connect()">
          confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="saveS3Warning"
    title="Warning"
    width="80%"
    align-center>
    <span>need to save your s3 info on local device?</span>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="clearS3Info()">Cancel</el-button>
      <el-button type="primary" @click="saveS3InfoForm = true">
        Confirm
      </el-button>
    </span>
    </template>
</el-dialog>

<el-dialog
    v-model="saveS3InfoForm"
    title="Warning"
    width="80%"
    align-center>
    <span>need secret to load exist s3 Info</span>
    <el-form :model="s3FormData">
        <el-form-item label="secret" :label-width=visible.formLabelWidth>
          <el-input v-model="s3Secret"/>       
        </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="saveS3InfoForm = false, s3Secret = ''">Cancel</el-button>
        <el-button type="primary" @click="initS3Info()">load</el-button>
        <el-button type="primary" @click="saveS3Info()">save</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { axios } from '~/assets/ts/axio';
import { env } from '~/assets/ts/env';
import { access } from '~/assets/ts/access';
import { ElMessage, ElMessageBox, UploadFile, UploadProps, UploadRequestOptions, UploadUserFile } from 'element-plus';
import { dayjs } from 'element-plus';
import { visible } from '~/assets/ts/visible'
import { setObject, deleteObject, getObject, openDB } from '~/assets/ts/indexDB'
import { encryptData, decryptData } from '~/assets/ts/encrypt'

interface ListObject {
    "key": string
    "timestamp": number
    "size": number
}

interface s3Info {
  accessKey: string,
  accessSecret: string,
  endpoint: string,
  region: string,
  platform: string
}

const s3InfoTable = ref(false)
const saveS3Warning = ref(false)
const storageTable = ref(false)
const uploadForm = ref(false)
const s3Form = ref(false)
const s3Init = ref(false)
const saveS3InfoForm = ref(false)
const s3Secret = ref("")

let initS3FormData  = () => ({
  accessKey: "",
  accessSecret: "",
  endpoint: "",
  region: "",
  platform: "default"
})

let s3FormData = reactive(initS3FormData());

const files = [{}];
const s3InfoList:s3Info[] = [];
const data = reactive({files, s3InfoList});

const fileList = ref<UploadUserFile[]>([])

const uploadInfo: Record<string, string> = {
    bucket: access.sub,
    idToken: access.id_token,
    mode: "stream"
}

const uploadHeader: Record<string, string> = {
    "Authorization": 'Bearer '+ access.access_token
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
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const refreshList = (response: any, uploadFile: UploadFile) => {
    listObject();
}

const continueUpload:UploadProps['onExceed'] = (files: File[], uploadFiles: UploadUserFile[]) => {
    const option = {
        baseURL: env.storageUrl,
        url: "/storage/object",
        method: "POST",
        data: {
            data: files[0],
            bucket: access.sub,
            mode: "stream",
            idToken: access.id_token,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "multipart/form-data"
        }
    }
    axios(option).then(function (response) {
    })   
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

function chunkedUpload(options: UploadRequestOptions, chunkSize) {
    const option = {
        baseURL: env.storageUrl,
        url: "/storage/object",
        method: options.method,
        data: {
            bucket: access.sub,
            key: options.file.name,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform,
            idToken: access.id_token
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "application/json"
        }
    }
    axios(option).then(function (response) {    
        const uploadId = response.data;
        var partCount = Math.ceil(options.file.size / chunkSize);
        var start = 0;
        var end = Math.min(chunkSize, options.file.size);
        var chunkIndex = 0;  
        while (start < options.file.size) {
            var chunk = options.file.slice(start, end);
            const option = {
                baseURL: env.storageUrl,
                url: "/storage/object",
                method: "POST",
                data: {
                    data: chunk,
                    bucket: access.sub,
                    key: options.file.name,
                    partCount: partCount,
                    partNum: chunkIndex,
                    idToken: access.id_token,
                    uploadId: uploadId,
                    mode: "stream",
                    accessKey: access.accessKey,
                    accessSecret: access.accessSecret,
                    endpoint: access.endpoint, 
                    region: access.region,
                    platform: access.platform
                },
                headers: {
                    'Authorization': 'Bearer '+ access.access_token,
                    "Content-Type": "multipart/form-data"
                }
            }
            axios(option);   
            start = end;
            end = Math.min(end + chunkSize, options.file.size);
            chunkIndex++;
        }
        listObject();
    })
}    

const upload = async (options: UploadRequestOptions) => {
    if (options.file.size > 1024*1024*100) {
        chunkedUpload(options, 1024*1024*5);
    } else {
        const option = {
            baseURL: env.storageUrl,
            url: "/storage/object",
            method: "POST",
            data: {
                data: options.file,
                bucket: access.sub,
                mode: "stream",
                idToken: access.id_token,
                accessKey: access.accessKey,
                accessSecret: access.accessSecret,
                endpoint: access.endpoint, 
                region: access.region,
                platform: access.platform
            },
            headers: {
                'Authorization': 'Bearer '+ access.access_token,
                "Content-Type": "multipart/form-data"
            }
        }
        await axios(option);   
   }
}

const connect = () => {
    if (s3FormData.accessSecret != "") {
        saveS3Warning.value = true;
        // return;
    } else {
      s3Form.value = false
    }
    if (s3FormData.platform == "default") {
      access.platform = ""
    } else {
      access.platform = s3FormData.platform
    }
    access.accessKey = s3FormData.accessKey
    access.accessSecret = s3FormData.accessSecret
    access.endpoint = s3FormData.endpoint
    access.region = s3FormData.region   
    listObject()
    storageTable.value = true
}

const saveS3Info = async() => {
  if (s3FormData.platform == "default") {
    ElMessageBox.alert("please load first")
    return;
  } 
  saveS3Warning.value = false
  const db = await openDB('s3', 1, ['s3',"aes"]);
  const resp = await encryptData(s3FormData.accessSecret, s3Secret.value);
  s3FormData.accessSecret = resp.ciphertext
  const ciphertext = await setObject(db, "aes", "ciphertext-" + s3FormData.platform, resp.ciphertext, "readwrite", "");
  const iv = await setObject(db, "aes", "iv-" + s3FormData.platform, resp.iv, "readwrite", "");
  const s3 = await setObject(db, "s3", s3FormData.platform, JSON.stringify(s3FormData), "readwrite", "put");
  saveS3InfoForm.value = false
  s3Form.value = false
  storageTable.value = true
  Object.assign(s3FormData, initS3FormData());
}

const loadS3Info = async(index:number, row: s3Info) => {
  access.accessKey = row.accessKey
  access.endpoint = row.endpoint
  access.region = row.region       
  access.platform = row.platform 
  await initS3Info();
}

const clearS3Info = async() => {
  saveS3Warning.value = false;
  s3Form.value = false;
  access.accessKey = s3FormData.accessKey
  access.endpoint = s3FormData.endpoint
  access.region = s3FormData.region       
  access.platform = s3FormData.platform 
  await initS3Info();
  Object.assign(s3FormData, initS3FormData());
}

const deleteS3Info = async(index:number, row: s3Info) => {
  const db = await openDB('s3', 1);
  const ciphertext = await deleteObject(db, "aes", "ciphertext-" + row.platform, "readwrite");
  const iv = await deleteObject(db, "aes", "iv-" + row.platform, "readwrite");
  const s3 = await deleteObject(db, "s3", row.platform, "readwrite");
  data.s3InfoList.splice(index, 1)
}

const initS3Info = async() => {
  //for local s3 dev
  // access.id_token = ""
  const db = await openDB('s3', 1, ['s3',"aes"]);
  const s3Infos = await getObject(db, "s3", "", "readwrite", "all");
  var replacedStr = JSON.stringify(s3Infos).replace(/"{/g, '{').replace(/}"/g, '}').replace(/\\/g, '');
  const s3 = JSON.parse(replacedStr);
  data.s3InfoList = s3
  if (data.s3InfoList.length > 0) {
    if (access.platform == "default") {
        access.platform = s3[0].platform 
    }
    console.log(access.platform)
    const ciphertext = await getObject(db, "aes", "ciphertext-" + access.platform, "readwrite", "");
    const iv = await getObject(db, "aes", "iv-" + access.platform, "readwrite", "");
    if (ciphertext != undefined && ciphertext != "") {
      try {
        if (s3Secret.value == "") {
          saveS3InfoForm.value = true
          return;
        }
        const resp = await decryptData(ciphertext, iv, s3Secret.value);
        if (resp != "") {
          saveS3InfoForm.value = false
          access.accessSecret = resp
        }     
        if (access.accessSecret != "") {   
            if (data.s3InfoList.length > 1) {
              if (!s3Init.value) {
                s3InfoTable.value = true;
                s3Init.value = true;
                return;
              } else {          
                saveS3InfoForm.value = false;
                s3InfoTable.value = false;
              }
            }
            if (data.s3InfoList.length == 1) {
              access.endpoint = s3[0].endpoint 
              access.region = s3[0].region 
              access.accessKey = s3[0].accessKey 
            }
        } 
        console.log(11)
        // s3Init.value = true;
        // storageTable.value = true
        // listObject()
      } catch (error) {
        if (s3Secret.value != "") {
          ElMessageBox.alert("incorrect secret, will open default s3, please try again later by load button")
          s3Secret.value = ""
          saveS3InfoForm.value = true  
        }
        if (!s3Init.value) {
          saveS3InfoForm.value = false  
        }
        storageTable.value = true
        listObject()    
      }
    }
  } else if (access.platform == "default") {
    s3Form.value = true
    access.platform = "";
  } else {
    storageTable.value = true
    listObject()
    s3Form.value = false
  }
}
  
const initS3 = async() => {
  if (!s3Init.value) {
    await initS3Info()
  } else {
    storageTable.value = true
    listObject()
  }
}

const listObject = () => {
  const option = {
      baseURL: env.apiUrl,
      url: "/storage/object/list",
      method: "POST",
      data: {
          bucket: access.sub,
          idToken: access.id_token,
          accessKey: access.accessKey,
          accessSecret: access.accessSecret,
          endpoint: access.endpoint, 
          region: access.region,
          platform: access.platform
      },
      headers: {
          'Authorization': 'Bearer '+ access.access_token,
          "Content-Type": "application/json"
      }
  }
  axios(option).then(function (response) {
      data.files = response.data;
  })   
}

const deleteS3 = (index:number, row: ListObject) => {
    const option = {
        baseURL: env.apiUrl,
        url: "/storage/object/delete",
        method: "POST",
        data: {
            bucket: access.sub,
            key: row.key,
            idToken: access.id_token,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "application/json"
        }
    }
    axios(option).then(function (response) {
        if (response.status == 200) {
            data.files.splice(index, 1);
        }    
    })   
}

function downloadUrl (row: ListObject) {
    const url = env.storageUrl + "/storage/object?bucket=" + access.sub + "&key=" + row.key + "&idToken=" + access.id_token;
    const aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = url;
      aLink.download = row.key;
    //   aLink.target = '_parent';
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); 
}

function downloadObject (row: ListObject)  {
    axios({
        method: 'POST',
        url: env.storageUrl + "/storage/object/download" ,
        responseType: 'blob',
        data: {    
            bucket: access.sub,
            key: row.key,
            idToken: access.id_token,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform
        },   
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "application/json"
        },
    }).then(async function(response){
        // fileDownload(response.data, row.key);
        const url = URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = row.key;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    })
    // await axios.post(env.apiUrl+ "/storage/object/download", data, {});  
}

function formatTimestamp(row:ListObject) {
    return dayjs(row.timestamp*1000).format("YYYY-MM-DD HH:mm:ss");
}

defineExpose({
  initS3
})
</script>