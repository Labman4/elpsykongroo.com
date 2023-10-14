<template>
  <el-dialog v-model="storageTable" :width=visible.dialogWidth>
    <el-button type="danger" @click="DeleteSelect()">DeleteSelect</el-button>
    <el-button type="" @click="uploadForm = true">upload</el-button>
    <el-button type="" @click="s3Form = true">connect</el-button>
    <el-button type="" @click="s3InfoTable = true">load</el-button>
    <el-button @click="listObject()">refresh</el-button>
    <el-table :data="data.files" @selection-change="handleSelectChange">
      <el-table-column type="selection"/>
      <el-table-column property="key" label="file" width="auto"/>
      <el-table-column property="timestamp" label="lastModified" :formatter="formatTimestamp" sortable/>
      <el-table-column property="size" label="size" :formatter="kb"/>
      <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteS3(scope.$index, scope.row)">Delete</el-button>
        <el-button size="small" type="primary" @click="download(scope.row)">Download</el-button>
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

  <el-dialog v-model="uploadForm" :width=visible.dialogWidth>
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
        <el-button size="small" type="primary" @click="loadS3Info(scope.row)">select</el-button>
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
    <el-form :model="s3FormData">
        <el-form-item label="secret" :label-width=visible.labelWidth>
          <el-input v-model="s3Secret"/>       
        </el-form-item>
        <el-form-item label="bucket" :label-width=visible.labelWidth>
          <el-input v-model="access.bucket"/>       
        </el-form-item>
      </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelLoad()">Cancel</el-button>
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
import { ElMessageBox, ElNotification, UploadFile, UploadProps, UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus';
import { dayjs } from 'element-plus';
import { visible } from '~/assets/ts/visible'
import { setObject, deleteObject, getObject, openDB } from '~/assets/ts/indexDB'
import { encryptData, decryptData, computeFileSHA256, encryptDataCombineIv, decryptDataWithoutIv } from '~/assets/ts/encrypt'

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
const isZip = ref(false)
const isEncrypt = ref(false)
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
    listObject();
}

const encryptOrNot: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.prompt("keep the below empty if not", 'need encrypt by yourself?',{
      inputValue: "",
      confirmButtonText: "continue",
      showCancelButton: false
    }).then(({ value, action }) => {
        isEncrypt.value = true;
        password.value = value;
        resolve();
    })
  });
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
    return axios(option).then(function(resp) {
      return resp.data
   })
}

async function chunkedUpload(options: UploadRequestOptions, chunkSize) {
    let fileName = options.file.name;
    let tagList, tag, result;
    if (isZip.value) {
      fileName = options.file.name + ".zip"
    }
    var uploadId;
    if (access.platform != "" && access.platform != "default") {
      const upload = await getUploadId(fileName, "", "", "");
      uploadId = upload;
    }
    var partCount = Math.ceil(options.file.size / chunkSize);
    if (isEncrypt.value && password.value != "" ) {
      tagList = new Map()
      tag = new Uint8Array(16) 
      abortMultiPart(options.file.name, uploadId)
      const upload = await getUploadId(fileName, "", "", "");
      uploadId = upload;
    }
    // const sortedChunksArray = await sortChunks(options.file, chunkSize);
    var completeSize = 0;
    for (const { index, chunk } of chunks(options.file, chunkSize)) {
          chunk.arrayBuffer().then(async function(arrayBuffer) {  
          const sha256 = await computeFileSHA256(arrayBuffer)
          var checkUpload = await getUploadId(fileName, sha256, partCount, index)
          if (checkUpload == "" || checkUpload == undefined) {
              completeSize ++;
          } else if (access.platform != "" && access.platform != "default" && access.platform != "cloudflare" && uploadId != checkUpload) {
              listObject()
          } else if (isZip.value) {
              // const zip = new JSZip()
              // zip.file(options.file.name + (index + 1) + ".zip", chunk); 
              // zip.generateAsync({type:"blob"}).then(function(content) {
                // uploadPart(content, options.file.name + ".zip", partCount, index, uploadId, "")
              // });
          } else if (isEncrypt.value && password.value != "") {
              const byteData = await readFileAsArrayBuffer(chunk);
              const cipherResp = await encryptDataCombineIv(byteData, password.value)
              // if (index == 0) {
              //   tagList.set(index, cipherResp.tag)
              // } else {
              //   tagList.set(index, new Uint8Array(cipherResp.tag))
              // }
              // if (index === partCount - 1) {
                // console.log("last", tagList)
                // const sortedArray = Array.from(tagList.entries());
                // sortedArray.sort((a, b) => a[0] - b[0]);
                // const sortedMap = new Map(sortedArray);                
                // for (let i = 0; i < sortedMap.size - 1; i++) {
                //   const tag = await bitwiseXOR(sortedMap.get(i), sortedMap.get(i+1))
                //   sortedMap.set(i+1, new Uint8Array(tag))
                // }
                // console.log("after", sortedMap)
                // result = new Uint8Array(cipherResp.ciphertext.byteLength + 16);
                // result.set(new Uint8Array(cipherResp.ciphertext))
                // result.set(sortedMap.get(index), cipherResp.ciphertext.byteLength)
                // uploadPart(result, options.file.name, partCount, index, uploadId, "")
              // } else {
                // console.log("first", tagList)
                uploadPart(cipherResp.cipher, options.file.name, partCount, index, uploadId, "")
              // }
          }
           else {   
            uploadPart(chunk, options.file.name, partCount, index, uploadId, "")
          }
          if (completeSize == partCount) {
            uploadPart(chunk, options.file.name, partCount, index, uploadId, "")
          }
        })
    }  
}    

// async function sortTagList(tagList) {
//   return new Promise((resolve, reject) => {
//     const sortedArray = Array.from(tagList.entries());
//     sortedArray.sort((a, b) => a[0] - b[0]);
//     const sortedMap = new Map(sortedArray);
//     resolve(sortedMap);
//   });
// }

// async function sortChunks(file, chunkSize) {
//   return new Promise((resolve, reject) => {
//     const chunksArray = Array.from(chunks(file, chunkSize));
//     const sortedChunksArray = chunksArray.sort((a, b) => a.index - b.index);
//     resolve(sortedChunksArray);
//   });
// }

// async function bitwiseXOR(arr1, arr2) {
//   return new Promise((resolve, reject) => {
//     const result = new Uint8Array(arr1.length);
//     for (let i = 0; i < arr1.length; i++) {
//       result[i] = arr1[i] ^ arr2[i];
//     }
//     resolve(result);
//   });
// }
  
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      resolve(event.target?.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function uint8ArrayToFile(uint8Array, fileName, mimeType = 'application/octet-stream') {
  const blob = new Blob([uint8Array], { type: mimeType });
  const file = new File([blob], fileName, { type: mimeType });
  return file;
}

const uploadPart = (chunk, filename, partCount, partNum, uploadId, offset) => {
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
            mode: "stream"

        },
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "multipart/form-data"
        }
      }
      axios(option).catch(function(error) {
        console.log(error)
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
      // be careful minio must big than 5mb 
      if (access.platform == "" || access.platform == "default" || access.platform == "cloudflare" || access.platform == "c2" ) {
        chunkedUpload(options, 1024*1024*5);
      } else {
        chunkedUpload(options, 1024*1024*2);
      }
    } else {
      let fileData;
      if (isEncrypt.value && password.value != "") {
        const byteData = await readFileAsArrayBuffer(options.file);
        const cipherResp = await encryptDataCombineIv(byteData, password.value)
        fileData = uint8ArrayToFile(cipherResp.cipher, options.file.name)
      } else {
        fileData = options.file
      }
      const option = {
          baseURL: env.storageUrl,
          url: "/storage/object",
          method: "POST",
          data: {
              data: fileData,
              bucket: access.bucket,
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
      axios(option);   
   }
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
    access.region = s3FormData.region   
    if (s3FormData.accessSecret != "") {
        const result = await listObject()
        if (result != "" && result != undefined ) {
          saveS3Warning.value = true;
        } else {
          ElMessageBox.alert("check failed, please ensure and try again")
        }
        // return;
    } else {
      s3Form.value = false
    }
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
  await setObject(db, "aes", "ciphertext-" + s3FormData.platform, resp.ciphertext, "readwrite", "");
  await setObject(db, "aes", "iv-" + s3FormData.platform, resp.iv, "readwrite", "");
  await setObject(db, "s3", s3FormData.platform, JSON.stringify(s3FormData), "readwrite", "put");
  await getS3Info();
  saveS3InfoForm.value = false
  s3Form.value = false
  storageTable.value = true
  Object.assign(s3FormData, initS3FormData());
}

const loadS3Info = async(row: s3Info) => {
  access.accessKey = row.accessKey
  access.endpoint = row.endpoint
  access.region = row.region
 if (access.platform == row.platform && s3Init.value) {
    listObject()
    saveS3Warning.value = false
    storageTable.value = true
  } else {
    access.platform = row.platform      
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
  await initS3Info();
  Object.assign(s3FormData, initS3FormData());
}

const deleteS3Info = async(index:number, row: s3Info) => {
  const db = await openDB('s3', 1, ['s3',"aes"]);
  await deleteObject(db, "aes", "ciphertext-" + row.platform, "readwrite");
  await deleteObject(db, "aes", "iv-" + row.platform, "readwrite");
  await deleteObject(db, "s3", row.platform, "readwrite");
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

const initS3Info = async() => {
  //for local s3 dev
  const domain = window.location.hostname;
  if (domain.split(":")[0] == "127.0.0.1" || domain.split(":")[0] == "localhost") {
    access.id_token = ""
    access.sub = "admin"
  }
  if (access.bucket == "") {
    access.bucket = access.sub
  }
  const db = await getS3Info();
  if (data.s3InfoList.length > 0) {
    if (access.platform == "default") {
        access.platform = data.s3InfoList[0].platform
        access.bucket = access.sub
    }
    const ciphertext = await getObject(db, "aes", "ciphertext-" + access.platform, "readwrite", "");
    const iv = await getObject(db, "aes", "iv-" + access.platform, "readwrite", "");
    if (ciphertext != undefined && ciphertext != "") {
      try {
        if (s3Secret.value == "") {
          saveS3InfoForm.value = true
          access.accessSecret = ""
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
              access.endpoint = data.s3InfoList[0].endpoint 
              access.region = data.s3InfoList[0].region 
              access.accessKey = data.s3InfoList[0].accessKey
              s3InfoTable.value = false;
            }
        } 
      } catch (error) {
        if (s3Secret.value != "") {
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

const listObject = async() => {
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
  const listObject:ListObject[] = await axios(option)
  if (listObject != undefined && listObject.length > 0 ) {
    const filterObject = listObject.filter( obj => {
        return !obj.key.startsWith(access.bucket)
    })
    data.files = filterObject;
    return listObject
  } else {
    return ""
  }
}

const abortMultiPart = (name, uploadId) => {
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
  axios(option)
}

const deleteS3 = (index:number, row: ListObject) => {
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

const handleSelectChange = (val: ListObject[]) => {
  multipleSelect.value = val;
  selected.splice(0, selected.length);
  for(let i of multipleSelect.value) {
    selected.push(i.key);
  }
}

const multipleSelect = ref<ListObject[]>([])

const selected:string[] = [];

const DeleteSelect = () => {
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

const download = (row: ListObject) => {
  if (access.platform == "" || access.platform == "default") {
    downloadUrl(row);
  } else {
    getObjectUrl(row);
    // downloadObject(row);
  }
}
const getObjectUrl = (row: ListObject) =>{
  axios({
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
            platform: access.platform
        },   
        headers: {
            'Authorization': 'Bearer '+ access.access_token,
            "Content-Type": "application/json"
        },
    }).then(async function(response){
      const url = response.data;
      const aLink = document.createElement('a');
      aLink.style.display = 'none';
      aLink.href = url;
      aLink.download = row.key;
    //   aLink.target = '_parent';
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); 
    }) 
}

function downloadUrl (row: ListObject) {
    const url = env.storageUrl + "/storage/object?bucket=" + access.bucket + "&key=" + row.key + "&idToken=" + access.id_token;
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
        // const bytedata = await readFileAsArrayBuffer(response.data)
        // const byteArray = await decryptDataWithoutIv(bytedata, "1")
        // const file = uint8ArrayToFile(bytedata, row.key)
        // const url = URL.createObjectURL(file);
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