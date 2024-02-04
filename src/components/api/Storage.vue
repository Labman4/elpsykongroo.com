<template>
  <el-dialog v-model="storageTable" :width=visible.dialogWidth>
    <el-button type="danger" @click="DeleteSelect()">DeleteSelect</el-button>
    <el-button type="" @click="uploadForm = true">upload</el-button>
    <el-button type="" @click="s3Form = true">connect</el-button>
    <el-button type="" @click="s3InfoTable = true">load</el-button>
    <el-button @click="listObject()">refresh</el-button>
    <el-button type="success" @click="isDirect = false" v-if="isDirect">mode: direct </el-button>
    <el-button type="primary" @click="isDirect = true" v-if="!isDirect">mode: proxy </el-button>
    <el-table :data="data.files" @selection-change="handleSelectChange">
      <el-table-column type="selection"/>
      <el-table-column property="key" label="file" width="auto"/>
      <el-table-column property="timestamp" label="lastModified" :formatter="formatTimestamp" sortable/>
      <el-table-column property="size" label="size" :formatter="kb"/>
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteS3(scope.$index, scope.row)">Delete</el-button>
        <el-button size="small" type="primary" @click="download(scope.row, false)">Download</el-button>
        <el-button size="small" type="primary" v-if='scope.row.key.endsWith("mp4")' @click="download(scope.row, true), videoDialog = true">Preview</el-button>

      </template>
      </el-table-column>
    </el-table>

  </el-dialog>

  <el-dialog v-model="uploadForm" :width=visible.dialogWidth>
    <el-upload
        v-model:file-list="fileList"
        class="upload-demo"
        :headers=uploadHeader
        name="data"
        :data=uploadInfo
        :auto-upload=true
        multiple
        :before-upload="encryptOrNot"	
        :before-remove="beforeRemove"
        :limit="10"
        :on-success="refreshList"
        :http-request="upload"
        >
        <el-button type="primary">Click to upload</el-button>
        <template #tip>
        <div class="el-upload__tip">
            upload anything
        </div>
        </template>
    </el-upload>
</el-dialog>

<el-dialog v-model="s3InfoTable" :width=visible.dialogWidth>
    <el-button type="" @click="getS3Info()">refresh</el-button>
    <el-table :data="data.s3InfoList">
      <el-table-column property="accessKey" label="accessKey"/>
      <el-table-column property="accessSecret" label="accessSecret"/>
      <el-table-column property="endpoint" label="endpoint" />
      <el-table-column property="region" label="region" />
      <el-table-column property="platform" label="platform" />
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteS3Info(scope.$index, scope.row)">Delete</el-button>
        <el-button size="small" type="primary" @click="loadS3Info(scope.row)" v-if = "access.accessKey != scope.row.accessKey">select</el-button>
        <el-button size="small" type="info" v-if = "access.accessKey == scope.row.accessKey" @click="listObject(), storageTable = true, s3InfoTable = false">open</el-button>
        <el-button size="small" type="primary" @click="corsFlag = false, saveS3InfoForm = true" >change bucket</el-button>
      </template>
      </el-table-column>
    </el-table>
  </el-dialog>

<el-dialog
    v-model="s3Form"
    :width=visible.dialogWidth
    align-center>
    <span>need to connect to s3 from other platform?</span>
    <el-form :model="s3FormData">
        <el-form-item label="platform" :label-width=visible.labelWidth>
          <el-select v-model="s3FormData.platform" placeholder="default" :allow-create=true :filterable=true>
            <el-option label="cloudflare R2" value="cloudflare" />
            <el-option label="synology C2" value="c2" />
            <el-option label="oracle" value="oracle" />
            <el-option label="minio" value="minio" />
          </el-select>      
        </el-form-item>
        <el-form-item label="accessKey" :label-width=visible.labelWidth>
          <el-input v-model="s3FormData.accessKey"/>       
        </el-form-item>
        <el-form-item label="accessSecret" :label-width=visible.labelWidth>
          <el-input v-model="s3FormData.accessSecret" />
        </el-form-item>
        <el-form-item label="endpoint" :label-width=visible.labelWidth>
          <el-input v-model="s3FormData.endpoint" />
        </el-form-item>
        <el-form-item label="region" :label-width=visible.labelWidth>
          <el-input v-model="s3FormData.region" />
        </el-form-item>
        <!-- <el-form-item label="bucket" :label-width=visible.formLabelWidth v-if="s3FormData.platform != 'default'">
          <el-input v-model="access.bucket" />
        </el-form-item> -->
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
    :width=visible.dialogWidth
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
    :width=visible.dialogWidth
    align-center>
    <span>need secret to load exist s3 Info</span>
    <el-form :model="s3FormData" ref="secretformRef">
        <el-form-item label="secret" :label-width=visible.labelWidth :required=true>
          <el-input v-model="s3Secret"/>       
        </el-form-item>
        <el-form-item label="bucket" :label-width=visible.labelWidth :required=true>
          <el-input v-model="access.bucket" />       
        </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelLoad()">Cancel</el-button>
        <el-button type="primary" @click="initS3Info(access.accessKey, secretformRef)">load</el-button>
        <el-button type="primary" @click="saveS3Info()">save</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="videoDialog"
    :width=visible.dialogWidth
    align-center>
    <el-button type="info" @click="reload()">reload</el-button>
    <video-player ref="player" ></video-player>
  </el-dialog>
</template>

<script lang="ts" setup>
import { axios } from '~/assets/ts/axio';
import { env } from '~/assets/ts/env';
import { access } from '~/assets/ts/access';
import { dayjs, ElMessageBox, ElNotification, FormInstance } from 'element-plus';
import type { UploadFile, UploadRawFile, UploadProps, UploadUserFile, UploadRequestOptions } from 'element-plus'
import { visible } from '~/assets/ts/visible'
import { setObject, deleteObject, getObject, openDB } from '~/assets/ts/indexDB'
import { encryptData, decryptData, computeFileSHA256, arrayBufferToBase64, base64ToArrayBuffer, generateFixedKey } from '~/assets/ts/encrypt'
import { uploadPartDirect, initS3Client, getObjectSignedUrl, createMultipartUpload, listBucketsCommand,
   listObjectsCommand, deleteObjectsCommand, deleteObjectCommand, uploadObjectCommand } from '~/assets/ts/s3'
import { ListObject } from '~/assets/ts/interface'
import VideoPlayer from '~/components/VideoPlayer.vue';
const player = ref<InstanceType<typeof VideoPlayer> | null>(null)
const secretformRef = ref<FormInstance>()

interface s3Info {
  accessKey: string,
  accessSecret: string,
  endpoint: string,
  region: string,
  platform: string
}

const videoDialog = ref(false)
const s3InfoTable = ref(false)
const saveS3Warning = ref(false)
const storageTable = ref(false)
const uploadForm = ref(false)
const s3Form = ref(false)
const s3Init = ref(false)
const saveS3InfoForm = ref(false)
const s3Secret = ref("")
const isDirect = ref(true)
const isEncrypt = ref(false)
const isStream = ref(false)
const password = ref("")

let initS3FormData  = () => ({
  accessKey: "",
  accessSecret: "",
  endpoint: "",
  region: "",
  platform: "default",
})

let s3FormData = reactive(initS3FormData());

const files:ListObject[] = [];
const s3InfoList:s3Info[] = [];
const data = reactive({files, s3InfoList});

const fileList = ref<UploadUserFile[]>([])

const uploadInfo: Record<string, string> = {
    bucket: access.bucket,
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

const refreshList = (response: any, uploadFile: UploadFile) => {
    if (response) {
      listObject();
    }
}

const encryptOrNot: UploadProps['beforeUpload'] = async(rawFile: UploadRawFile) => {
  await ElMessageBox.prompt("keep the below empty if not", 'need encrypt by yourself?',{
      inputValue: "",
      confirmButtonText: "continue",
      showCancelButton: false
    }).then(({ value, action }) => {
        isEncrypt.value = true;
        password.value = value;
    })
  // if (isEncrypt.value && password.value != "") {
  //   await safeEncrypt()
  // }
};

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}

const getUploadId = async (fileName, sha256, partCount, partNum) => {
    let uploadId
    if (isDirect.value) {
      uploadId = await createMultipartUpload(access.bucket, fileName)
    } else {
      const option = {
        baseURL: env.storageUrl,
        url: "/storage/object",
        method: "POST",
        data: {
            bucket: access.bucket,
            key: fileName,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform,
            idToken: access.id_token,
            sha256: sha256,
            partCount: partCount,
            partNum: partNum,
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "application/json"
        }
      }
    await axios(option).then(function(resp) {
      uploadId = resp.data
    })
  }
  return uploadId
}

async function chunkedUpload(options: UploadRequestOptions, chunkSize) {
    await uploadMode()
    let fileName = options.file.name;
    let uploadId;
    const upload = await getUploadId(fileName, "", "", "");
    uploadId = upload;
    if (uploadId) {
      var partCount = Math.ceil(options.file.size / chunkSize);
      if (isEncrypt.value && password.value != "" ) {
        fileName = "encrypt-" + options.file.name
        uploadId = await abortMultiPart(fileName, uploadId)
      }
      let completeSize = 0;
      for (const { index, chunk } of chunks(options.file, chunkSize)) {
        chunk.arrayBuffer().then(async function(arrayBuffer) {
          let checkUpload
          if (isStream.value) {
            const sha256 = await computeFileSHA256(arrayBuffer)
            checkUpload = await getUploadId(fileName, sha256, partCount, index)
            if (checkUpload == "" || checkUpload == undefined) {
                completeSize ++;
            } else if (access.platform != "" && access.platform != "default" && access.platform != "cloudflare" && uploadId != checkUpload) {
              return 
            }
            if (completeSize == partCount) {
              uploadPart(chunk, options.file.name, partCount, index, uploadId, "")
            }
          } 
          if (isEncrypt.value && password.value != "") {
            const cipher = await encryptBydecryptMethod(arrayBuffer, options.file.name)
            uploadPart(cipher, "encrypt-"+ options.file.name, partCount, index, uploadId, "")
          } else { 
            uploadPart(chunk, options.file.name, partCount, index, uploadId, "")
          }            
      }) 
    }
  }
}    

const downloadMethod = async() => {
  isDirect.value = false;
  await ElMessageBox.confirm('please choose download method',{
    confirmButtonText: 'proxy',
    cancelButtonText: 'direct',
  })
  .then(() => {
    isDirect.value = false;
  })
  .catch(() => {
    isDirect.value = true;
  })
}

// const safeEncrypt = async() => {
//   await ElMessageBox.confirm('if the data is important and needs to be kept intact, choose manual and need decrypt by manual after',
//     "please select decrypt method",{
//       confirmButtonText: 'manual',
//       cancelButtonText: 'auto',
//     })
//     .then(() => {
//       isSafe.value = true;
//     })
//     .catch(() => {
//       isSafe.value = false;
//     })
// }

const downloadWithDecrypt = async() => {
    password.value = ""
    await ElMessageBox.prompt("enter the secret you used when uploading before ", 'the file upload with secret?',{
      inputValue: "",
      confirmButtonText: "continue",
      showCancelButton: false
    }).then(({ value, action }) => {
        password.value = value;
    })
}

const uint8ArrayToFile = (uint8Array, fileName, mimeType = 'application/octet-stream') => {
  const blob = new Blob([uint8Array], { type: mimeType });
  const file = new File([blob], fileName, { type: mimeType });
  return file;
}

const uploadPart = async(chunk, filename, partCount, partNum, uploadId, offset) => {
    if (isDirect.value) {
      try {
        uploadPartDirect(chunk, access.bucket, filename, uploadId, partNum, partCount)
      } catch {
        await ElMessageBox.confirm('something wrong with upload throgh direct, u can choose proxy and try again after login')
        .then(() => {
          isDirect.value = false;
        })
        .catch(() => {
          isDirect.value = true;
        })      
      } 
    } else {
      uploadPartProxy(chunk, filename, partCount, partNum, uploadId, offset)
    }
}

const uploadMode = async() => {
  isStream.value = false;
  if (!isDirect.value) {
    await ElMessageBox.confirm("please select upload mode, stream mode can keep upload process(need login)", {
    confirmButtonText: 'stream',
    cancelButtonText: 'direct',
    })
    .then(() => {
      isStream.value = true;
    })
    .catch(() => {
      isStream.value = false;
    })
  }
}

const uploadPartProxy = (chunk, filename, partCount, partNum, uploadId, offset) => {
      const option = {
        baseURL: env.storageUrl,
        url: "/storage/object",
        method: "POST",
        data: {
            data: chunk,
            bucket: access.bucket,
            key: filename,
            partCount: partCount,
            partNum: partNum,
            idToken: access.id_token,
            uploadId: uploadId,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform,
            offset: offset,
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "multipart/form-data"
        }
      }
      if (isStream.value) {
        option.data["mode"] = "stream"
      }
      axios(option).catch(function(error) {
        axios(option).catch(function(error){
          axios(option).catch(function(error){
            ElNotification({
              title: 'Network Error',
              message: 'please click upload and retry',
              duration: 3000,
            })
          })
        });
      });
}

function* chunks(file, chunkSize) {
  let offset = 0;
  let index = 0;
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    yield { index, chunk };    
    offset += chunkSize;
    index++;
  }
}

const upload = async (options: UploadRequestOptions) => {
    if (options.file.size > 1024*1024*5) {
      await chunkedUpload(options, 1024*1024*5);
      // be careful minio must big than 5mb and oracle no limit
      // if (access.platform == "" || access.platform == "default" || access.platform == "cloudflare" || access.platform == "c2" ) {
      // }
    } else {
      let fileData;
      if (isEncrypt.value && password.value != "") {
        // const sha256origin = await computeFileSHA256(options.file)
        // console.log("origin", sha256origin)
        await options.file.arrayBuffer().then(async function(arrayBuffer) {
          // const sha256array = await computeFileSHA256(arrayBuffer)
          // console.log("sha256array", sha256array)
          const cipher = await encryptBydecryptMethod(arrayBuffer, options.file.name)
          fileData = uint8ArrayToFile(cipher, "encrypt-" + options.file.name)
        })
      } else {
        fileData = options.file
      }
      if (isDirect.value) {
        uploadObjectCommand(access.bucket, options.file.name, fileData)
      } else {
        uploadFileDirect(fileData, "")
      }
   }
}

let corsFlag
let corsCount

const checkEndpointCors = async() => {
  let flag 
  await axios.get(access.endpoint).then(function(response) {
    if(response.headers["access-control-allow-origin"] == "*" || response.headers["access-control-allow-origin"] == env.redirectUrl) {
      flag = true
    }
  }).catch (() => {})
  return flag
}

const checkCors = async() => {
  if (corsCount > 1) {
    return false
  }
  if (!corsFlag) {
    if (await checkEndpointCors()) {
      return true
    }
    corsCount ++
    try {
      const CORSRules = await getCorsRule(access.bucket);
      if (CORSRules && CORSRules.data && CORSRules.data.length > 0) {
        for(let rule of CORSRules.data) {
          if (rule["allowedOrigins"] && rule["allowedOrigins"].includes(env.redirectUrl)) {
            corsFlag = true
          }    
        }
      }
    } catch (error) {
      console.error(error)
      corsFlag = false
    }
  }
  if (!corsFlag) {
    corsCount ++
    const corsOption = {
        baseURL: env.storageUrl,
        url: "/storage/object/cors",
        method: "PUT",
        data: {
            bucket: access.bucket,
            idToken: access.id_token,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform,
            corsRules: [{
                allowedHeaders: ["*"],
                allowedMethods: ["GET", "PUT", "POST", "DELETE"],
                allowedOrigins: [env.redirectUrl],
                exposeHeaders: ["ETag"],
                maxAgeSeconds: 3600,
            }]  
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
        }
    }
    await axios(corsOption).then(function (response) {
      if (response.status == 200) {
        corsFlag = true
      }
    })
  }
  return corsFlag
}

const getCorsRule = async(bucket) => {
    const corsOption = {
        baseURL: env.storageUrl,
        url: "/storage/object/cors",
        method: "POST",
        data: {
            bucket: bucket,
            idToken: access.id_token,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform,
        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
        }
    }
    return await axios(corsOption)
}

const encryptBydecryptMethod = async(arrayBuffer, fileName) => {
  let cipher
  // if (isSafe.value) {
    const cipherResp = await encryptData(arrayBuffer, password.value, "AES-GCM")
    cipher = cipherResp.cipher
    // console.log(cipherResp.iv)
    // console.log(cipherResp.tag)
//   } else {
//     const cipherResp = await encryptData(arrayBuffer, password.value, "AES-CTR")
//     cipher = cipherResp.ciphertext
//  // console.log(cipherResp.iv)
//     // console.log(cipherResp.tag)    // if (iv == null) {
//     //   iv = cipherResp.iv
//     //   // console.log("upload iv")
//     //   const ivfile = uint8ArrayToFile(cipherResp.iv,  "iv-encrypt-" + fileName )
//     //   uploadFileDirect(ivfile, "")
//     // }
//   }
  return cipher
}

const uploadByteDirect = (byteData, key) => {
  const option = {
      baseURL: env.storageUrl,
      url: "/storage/object",
      method: "POST",
      data: {
          byteData: byteData,
          key: key,
          bucket: access.bucket,
          idToken: access.id_token,
          accessKey: access.accessKey,
          accessSecret: access.accessSecret,
          endpoint: access.endpoint, 
          region: access.region,
          platform: access.platform
      },
      headers: {
          'Authorization': 'Bearer '+ access.access_token,
          "Content-Type": "application/octet-stream"
      }
  }
  axios(option);  
}

const uploadFileDirect = (data, key) => {
  const option = {
      baseURL: env.storageUrl,
      url: "/storage/object",
      method: "POST",
      data: {
          data: data,
          key: key,
          bucket: access.bucket,
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
  axios(option);  
}

const connect = async() => {
    if (s3FormData.platform == "default") {
      access.platform = ""
    } else {
      access.platform = s3FormData.platform
    }
    access.accessKey = s3FormData.accessKey
    access.accessSecret = s3FormData.accessSecret
    access.endpoint = s3FormData.endpoint
    if (s3FormData.platform == "cloudflare") {
      access.region = "auto"
      s3FormData.region = "auto"
    } else {
      access.region = s3FormData.region   
    }
    if (s3FormData.accessSecret != "") {
      if (access.sub != "") {
        corsFlag = false
        if (!await checkCors()) {
          ElMessageBox.alert("can not auto config cors, please try to config by maunal")
          return
        }
      } else {
        if (!await checkEndpointCors()) {
          ElMessageBox.alert("the bucket is not support cors, please try to config by maunal or login for auto config")
          return
        }
      }
      if (access.platform == "cloudflare") {
        access.endpoint = s3FormData.endpoint + "/" + access.sub
      }
      initS3Client(true)
      const result = await listBucketsCommand()
      if (result) {
        if (access.platform == "cloudflare") {
          access.endpoint = s3FormData.endpoint
          initS3Client(true)
        }
        saveS3Warning.value = true;
      } else {
        ElMessageBox.alert("check failed, please ensure and try again")
      }
        // return;
    } else {
      s3Form.value = false
      storageTable.value = true
      listObject()
    }
}

const saveS3Info = async() => {
  if (s3FormData.platform == "default") {
    ElMessageBox.alert("please load first")
    return;
  } 
  saveS3Warning.value = false
  const db = await openDB('s3', 1, ['s3',"aes"]);
  const resp = await encryptData(s3FormData.accessSecret, s3Secret.value, "AES-GCM");
  const cipher = arrayBufferToBase64(resp.cipher)
  s3FormData.accessSecret = cipher
  await setObject(db, "aes", "cipher-" + s3FormData.accessKey, cipher, "readwrite", "");
  await setObject(db, "s3", s3FormData.accessKey, JSON.stringify(s3FormData), "readwrite", "put");
  await getS3Info();
  saveS3InfoForm.value = false
  s3Form.value = false
  storageTable.value = true
  Object.assign(s3FormData, initS3FormData());
}

const loadS3Info = async(row: s3Info) => {
  if (s3Secret.value) {   
    initS3Info(row.accessKey, secretformRef)
  }
  access.endpoint = row.endpoint
  access.region = row.region
  access.platform = row.platform 
  access.accessKey = row.accessKey
  if (!access.accessSecret){
    s3Secret.value = ""
    saveS3InfoForm.value = true;
  }
}

const cancelLoad = () => {
  saveS3InfoForm.value = false;
  s3Secret.value = '';
  access.platform = ''
  listObject();
  storageTable.value = true;
} 

const clearS3Info = async() => {
  saveS3Warning.value = false;
  s3Form.value = false;
  access.accessKey = s3FormData.accessKey
  access.endpoint = s3FormData.endpoint
  access.region = s3FormData.region       
  access.platform = s3FormData.platform 
  await initS3Info("", secretformRef);
  Object.assign(s3FormData, initS3FormData());
}

const deleteS3Info = async(index:number, row: s3Info) => {
  const db = await openDB('s3', 1, ['s3',"aes"]);
  await deleteObject(db, "aes", "cipher-" + row.accessKey, "readwrite");
  await deleteObject(db, "s3", row.accessKey, "readwrite");
  data.s3InfoList.splice(index, 1)
}

const getS3Info = async() => {
  const db = await openDB('s3', 1, ['s3',"aes"]);
  const s3Infos = await getObject(db, "s3", "", "readwrite", "all");
  var replacedStr = JSON.stringify(s3Infos).replace(/"{/g, '{').replace(/}"/g, '}').replace(/\\/g, '');
  const s3 = JSON.parse(replacedStr);
  data.s3InfoList = s3
  return db
}

const initS3Info = async(accessKey, formEl: FormInstance | undefined) => {
  data.files = []
  if (!access.bucket) {
    access.bucket = access.sub
  }
  if (access.platform == "cloudflare") {
    if (!access.sub) {
      if (!await checkEndpointCors) {
        ElMessageBox.alert("the bucket is not support cors, please try to config by maunal or login for auto config")
        return
      }    
    }
  } 
  //for local s3 dev
  if (!formEl) return
  // const domain = window.location.hostname;
  // if (domain.split(":")[0] == "127.0.0.1" || domain.split(":")[0] == "localhost") {
  //   access.id_token = ""
  //   access.sub = "admin"
  // }
  if (formEl) {
    const db = await getS3Info();
    if (data.s3InfoList.length > 0) {
      if (access.platform == "default") {
          access.platform = data.s3InfoList[0].platform
          access.bucket = access.sub
      }
      let cipher
      if (!accessKey) {
        cipher = await getObject(db, "aes", "cipher-" + data.s3InfoList[0].accessKey, "readwrite", "")
      } else {
        cipher = await getObject(db, "aes", "cipher-" + accessKey, "readwrite", "");
      }
      if (cipher) {
        try {
          if (!s3Secret.value) {
            saveS3InfoForm.value = true
            access.accessSecret = ""
            return;
          }
          const resp = await decryptData(base64ToArrayBuffer(cipher), s3Secret.value, "AES-GCM");
          const secretData = new TextDecoder().decode(resp)
          if (secretData) {
            saveS3InfoForm.value = false
            access.accessSecret = secretData
          }     
          if (access.accessSecret) {
            if (data.s3InfoList.length > 1) {
              if (!s3Init.value) {
                access.accessKey = data.s3InfoList[0].accessKey
                access.platform = data.s3InfoList[0].platform
                access.endpoint = data.s3InfoList[0].endpoint
                access.region = data.s3InfoList[0].region
                s3InfoTable.value = true;
                s3Init.value = true;
                initS3Client(true)
                return;
              } else {         
                saveS3InfoForm.value = false;
                s3InfoTable.value = false;
              }
            }
            if (data.s3InfoList.length == 1) {
              access.accessKey = data.s3InfoList[0].accessKey
              access.platform = data.s3InfoList[0].platform
              access.endpoint = data.s3InfoList[0].endpoint
              access.region = data.s3InfoList[0].region
              s3InfoTable.value = false;
            }
          } else {
            access.platform = ""
            access.accessKey = ""
            access.endpoint = ""
            access.region = ""
          }
        } catch (error) {
          if (s3Secret.value) {
            ElMessageBox.alert("incorrect secret, will open default s3, please try again later by load button")
            s3Secret.value = ""
            saveS3InfoForm.value = true
            access.accessSecret = ""
            access.platform = ""
            access.accessKey = ""
            access.endpoint = ""
            access.region = ""
          }
          if (!s3Init.value) {
            saveS3InfoForm.value = false  
          }
          storageTable.value = true
          listObject()
          return;
        }
      }
      s3Init.value = true;
      storageTable.value = true
      listObject()
      initS3Client(true)
    } else if (access.platform == "default") {
      s3Form.value = true
      access.platform = "";
    } else {
      storageTable.value = true
      listObject()
      s3Form.value = false
    }
  }
}
 
const initS3 = async() => {
  if (!s3Init.value) {
    await initS3Info("", secretformRef)
  } else {
    storageTable.value = true
    listObject()
  }
}

const listObject = async() => {
  let result
  if (isDirect.value) {
    const resp = await listObjectsCommand(access.bucket)
    if (resp && resp.length > 0) {
        const filterObject = resp.filter( obj => {
          return !obj.key.startsWith(access.bucket)
        })
        data.files = filterObject;
    }
    result = resp
  } else {
    const option = {
      baseURL: env.storageUrl,
      url: "/storage/object/list",
      method: "POST",
      data: {
          bucket: access.bucket,
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
  await axios(option).then(function(response) {
    if (response.data) {
      const listObjects:ListObject[] = response.data
      if (listObjects && listObjects.length > 0) {
        const filterObject = listObjects.filter( obj => {
          return !obj.key.startsWith(access.bucket)
        })
        data.files = filterObject;
      }
    }
    result = response.data
  })
  }
  return result
}

const abortMultiPart = async (name, uploadId) => {
  let upload
  const option = {
      baseURL: env.storageUrl,
      url: "/storage/object/abort",
      method: "POST",
      data: {
          bucket: access.bucket,
          key: name,
          idToken: access.id_token,
          accessKey: access.accessKey,
          accessSecret: access.accessSecret,
          endpoint: access.endpoint, 
          region: access.region,
          platform: access.platform,
          uploadId: uploadId
      },
      headers: {
          'Authorization': 'Bearer '+ access.access_token,
          "Content-Type": "application/json"
      }
  }
  await axios(option).then(async function () {
    upload = await getUploadId(name, "", "", "");
    // console.log("new uploadId",upload)
  })
  return upload
}

const deleteS3 = async (index:number, row: ListObject) => {
  if (isDirect.value) {
    const resp = await deleteObjectCommand(access.bucket, row.key)
    if (resp) {
      data.files.splice(index, 1);
    }
  } else {
    const option = {
      baseURL: env.storageUrl,
      url: "/storage/object/delete",
      method: "POST",
      data: {
          bucket: access.bucket,
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
}

const handleSelectChange = (val: ListObject[]) => {
  multipleSelect.value = val;
  selected.splice(0, selected.length);
  for(let i of multipleSelect.value) {
    selected.push(i.key);
  }
}

const multipleSelect = ref<ListObject[]>([])

const selected:string[] = [];

const DeleteSelect = async () => {
  if (isDirect.value) {
    let objs:any[] = []
    selected.map((c) => {
                const obj = {
                    Key: c,
                }
                objs.push(obj)
            });
   const resp = await deleteObjectsCommand(access.bucket, objs)
   if (resp.length == selected.length) {
    selected.forEach(function(item, index){
          data.files.forEach(function(i, ind){
              if (item === i.key) {
                data.files.splice(ind, 1)
              }
          }) 
        });
        if (data.files.length == 0) {
            listObject();
        } 
   };
  } else {
    const option = {
      baseURL: env.storageUrl,
      url: "/storage/object/delete",
      method: "POST",
      data: {
        bucket: access.bucket,
        key: selected.toString(),
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
    }
    axios(option).then(function (response) {
      var count = response.data;
      if (count == selected.length) {
        selected.forEach(function(item, index){
          data.files.forEach(function(i, ind){
              if (item === i.key) {
                data.files.splice(ind, 1)
              }
          }) 
        });
        if (data.files.length == 0) {
            listObject();
        } 
      }
    })
  }
  
}

const download = async(row: ListObject, preview) => {
  password.value = ""
  if (row.key.startsWith("encrypt-")) {
    await downloadWithDecrypt();
  }
  if (access.sub) {
    await downloadMethod()
  }
  let secret 
  if (password.value && !isDirect.value) {
    const option = {
        baseURL: env.apiUrl,
        url: "/public/key",
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },   
    }
    await axios(option).then(async function(response) {
      secret = response.data
      const key = crypto.getRandomValues(new Uint8Array(16))
      // console.log(key)
      // console.log(base64ToArrayBuffer(arrayBufferToBase64(key)))
      // console.log(arrayBufferToBase64(key))
      const cipherResp = await encryptData(password.value, key, "AES-GCM")
      // console.log(cipherResp.cipher)
      // console.log(arrayBufferToBase64(cipherResp.cipher))

      password.value = encodeURIComponent(arrayBufferToBase64(cipherResp.cipher))
      // const text = await decryptData(cipherResp.cipher, "", key, "AES-GCM")
      // console.log(text)

      const messageOption = {
        baseURL: env.messageUrl,
        url: "/message",
        method: "PUT",
        data: {
          key: secret,
          value: arrayBufferToBase64(key)
        },  
      }
      await axios(messageOption).then(async function (response) {
        if (response.status == 200) {
          await getObjectUrl(row, secret, preview);
        } 
      })
    })
  } else {
    await getObjectUrl(row, secret, preview);
  }
  // downloadObject(row)
}

const getObjectUrl = async (row: ListObject, secret, preview) => {
  let url
  if (isDirect.value) {
    if (password.value) {
      const db = await openDB('s3', 1, ['s3',"aes"]);
      // const keyBytes = await getObject(db, "aes", "key-" + row.key, "readwrite", "");
      // if (!keyBytes) {
      //   const key = await generateFixedKey(password.value, "AES-GCM")
      //   await setObject(db, "aes", "key-" + row.key, key, "readwrite", "");
      // }
      const key = await generateFixedKey(password.value, "AES-GCM")
      const keyBytes = await getObject(db, "aes", "key-" + row.key, "readwrite", "");
      if (keyBytes) {
        await deleteObject(db, "aes", "key-" + row.key, "readwrite");
      }
      await setObject(db, "aes", "key-" + row.key, key, "readwrite", "");
    }
    url = await getObjectSignedUrl(access.bucket, row.key)
  } else {
    await axios({
        method: 'POST',
        url: env.storageUrl + "/storage/object/url" ,
        data: {    
            bucket: access.bucket,
            key: row.key,
            idToken: access.id_token,
            accessKey: access.accessKey,
            accessSecret: access.accessSecret,
            endpoint: access.endpoint, 
            region: access.region,
            platform: access.platform,
            secret: secret
        },   
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "application/json"
        },
    }).then(async function(response){
      if (response.status == 200) {
        url = response.data
      }
    })
    if (url && password.value) {
      let algorithm = "AES-GCM"
      let offset = 1024*1024*5
      // if (isSafe.value) {
      //   algorithm = "AES-GCM"
      //   offset = 1024*1024*5
      // } else {
      //   offset = 1024*1024*5
      // }
      if (algorithm && algorithm != "AES-GCM") {
        url = url + "&secret=" + password.value + "&offset=" + offset + "&algorithm=" + algorithm
      } else {
        url = url + "&secret=" + password.value + "&offset=" + offset
      }
    }
  }
  if (url) {
    if (preview) {
      player.value?.src( {
            type: "video/mp4",
            src: url
          })
      player.value?.open()
      videoDialog.value = true
      return 
    } else {
      const aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.download = row.key;
      if (isDirect.value && password.value) {
        fetch(url).then(async function(response) {
          aLink.href = URL.createObjectURL(await response.blob());
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          URL.revokeObjectURL(url);
        })
        .catch(error => console.log(error))
      } else {
        aLink.href = url;
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      } 
    }
  }
}

const reload = () => {
  player.value?.open()
}

watch(videoDialog, (open) => {
  if(!open) {
    player.value?.pause()
  }
})

function downloadObject (row: ListObject)  {
    axios({
        method: 'POST',
        url: env.storageUrl + "/storage/object/download" ,
        responseType: 'arraybuffer',
        //responseType: 'blob',
        data: {    
            bucket: access.bucket,
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
      let url
      if (password.value) {
        const key = await generateFixedKey(password.value, "AES-GCM")
        // const iv = await getObjectBytes(access.bucket, "iv-" + row.key)
        console.log(response.data)
        console.log(key)
        const decryptedData = await decryptData(response.data, s3Secret.value, "AES-GCM");
        const file = uint8ArrayToFile(decryptedData, row.key)
        url = URL.createObjectURL(file);
      } else {
        url = URL.createObjectURL(response.data);
      }
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = row.key;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
}

function formatTimestamp(row:ListObject) {
    return dayjs(row.timestamp*1000).format("YYYY-MM-DD HH:mm:ss");
}

defineExpose({
  initS3
})
</script>