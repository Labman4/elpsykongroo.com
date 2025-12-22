<template>
    <el-drawer v-model="visible.noticeDrawer" :show-close="true" :with-header="true" size="40%">
        <el-timeline  >
            <el-timeline-item
            v-for="(notification, index) in data.notification"
            :key="index"
            :timestamp="notification.timestamp"
            placement='top'
            >
            <el-card @click="openTitle(notification.imageUrl, notification.body)">
                <p>{{notification.title}}</p>
            </el-card>
            </el-timeline-item>
        </el-timeline>
    </el-drawer>
    
  <el-dialog
    v-model="noticeDialog"
    :width=visible.dialogWidth
    align-center>
    <el-image :src="noticeImg"/>
    {{ noticeBody }}
  </el-dialog>

  <el-dialog
    v-model="notificationDialog"
    :width=visible.dialogWidth
    align-center>
    <el-form>
        <el-form-item label="title" :label-width=visible.labelWidth>
            <el-input v-model="noticeForm.title" />
        </el-form-item>
        <el-form-item label="body" :label-width=visible.labelWidth>
            <el-input v-model="noticeForm.body" />
        </el-form-item>
        <el-form-item label="imageUrl" :label-width=visible.labelWidth>
            <el-input v-model="noticeForm.imageUrl" />
        </el-form-item>
        <el-form-item label="timestamp" :label-width=visible.labelWidth>
            <!-- <el-col :span="9"> -->
          <el-date-picker
            ref="datePicker"
            v-model=noticeForm.timestamp
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
            format="YYYY-MM-DDTHH:mm:ss[Z]"
            />
         <!-- </el-col>        -->
        </el-form-item>
        <el-form-item label="draft" :label-width=visible.labelWidth>
            <el-radio-group v-model="noticeForm.draft" class="ml-4">
                <el-radio label="true">true</el-radio>
                <el-radio label="false">false</el-radio>
            </el-radio-group>        
        </el-form-item>
        <el-form-item label="topic" :label-width=visible.labelWidth>
            <el-select
            v-model="noticeForm.topic"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="Please enter a keyword"
            remote-show-suffix
            :remote-method="topicList"
            :loading="visible.topicLoad">
            <el-option
                v-for="item in data.topics"
                :key="item.name"
                :label="item.name"
                :value="item.name"
            />
            </el-select>        
        </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="notificationDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addNotice()" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="topicDialog"
    :width=visible.dialogWidth
    align-center>
    <el-form>
        <el-form-item label="name" :label-width=visible.labelWidth>
            <el-input v-model="topicForm.name" />
        </el-form-item>
        <el-form-item label="users" :label-width=visible.labelWidth>
        <el-select
            v-model="topicForm.users"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="Please enter a keyword"
            remote-show-suffix
            :remote-method="userList"
            :loading="userLoad">
            <el-option
                v-for="item in data.users"
                :key="item.username"
                :label="item.username"
                :value="item.username"
            />
        </el-select>
        </el-form-item>
        <el-form-item label="registers" :label-width=visible.labelWidth>
            <el-input v-model="topicForm.registers" />
        </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="topicDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addTopic()" >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog 
    v-model="visible.topicTable"
    :width=visible.dialogWidth
    align-center>
    <el-button type="" @click="topicDialog = true">Add</el-button>
    <el-table :data="data.topics" @selection-change="">
      <el-table-column type="selection"/>
      <el-table-column property="name" label="name"/>
      <el-table-column property="registers" label="registers" />
      <el-table-column property="users" label="users" />
      <el-table-column>
      <template #default="scope">
        <el-button
          size="small"
          type="danger"
          @click="deleteTopic(scope.$index, scope.row)"
          >Delete</el-button>
      </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog 
    v-model="visible.noticeTable"
    :width=visible.dialogWidth
    align-center>
    <el-button type="" @click="notificationDialog = true">Add</el-button>
    <el-table :data="data.notifications" @selection-change="">
      <el-table-column type="selection"/>
      <!-- <el-table-column property="id" label="id"/> -->
      <el-table-column property="title" label="title"/>
      <el-table-column property="body" label="body" />
      <el-table-column property="imageUrl" label="imageUrl" />
      <el-table-column property="timestamp" label="timestamp" />
      <el-table-column property="topic" label="topic" />
      <el-table-column property="draft" label="draft" />
      <el-table-column>
      <!-- <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search"  @keyup.enter="" />
      </template> -->
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteNotice(scope.$index, scope.row)">Delete</el-button>
        <el-button size="small" type="danger" @click="pushNotice(scope.$index, scope.row)" v-if="scope.row.draft">Push</el-button>
      </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { env } from '~/assets/ts/env';
import { access } from '~/assets/ts/access';
import { visible } from '~/assets/ts/visible';
import { axios } from '~/assets/ts/axio';
import { listUser, findUser, noticeList, topicList} from '~/assets/ts/commonApi';
import { data } from '~/assets/ts/dataInterface'

const userLoad = ref(true)
const noticeDialog = ref(false)
const notificationDialog = ref(false)
const topicDialog = ref(false)
const noticeBody = ref("")
const noticeImg = ref("")

let initNoticeForm  = () => ({
    title: "",
    body: "",
    imageUrl: "",
    timestamp: "",
    topic: "",
    draft: "true"
})

let noticeForm = reactive(initNoticeForm());

let initTopicForm  = () => ({
    name: "",
    users: [],
    registers: [],
})

let topicForm = reactive(initTopicForm());

const openTitle = (img, body) => {
    noticeBody.value = body
    noticeImg.value = img
    noticeDialog.value = true
}

const userList = async() => {
   data.users = await listUser(0, 10, 0)
   userLoad.value = false
}

const userfilter = async() => {
   data.users = await findUser("")
}

const addNotice = () => {
    const option = {
      baseURL: env.messageUrl,
      url: "notice",
      method: "PUT",
      data: {
        topic: noticeForm.topic,
        title: noticeForm.title,
        body: noticeForm.body,
        imageUrl: noticeForm.imageUrl,
        draft: noticeForm.draft,
      },
      headers: {
        'Authorization': 'Bearer '+ access.access_token
      },
  }
  axios(option).then(function(response){
    if (response.status == 200) {
        notificationDialog.value = false
        noticeList([], "")
    }
  })
}

const addTopic = () => {
    const option = {
      baseURL: env.messageUrl,
      url: "notice/topic",
      method: "PUT",
      data: {
        name: topicForm.name,
        users: topicForm.users,
        registers: topicForm.registers
      },
      headers: {
        'Authorization': 'Bearer '+ access.access_token
      },
  }
  axios(option).then(function(response){
    if (response.status == 200) {
        topicDialog.value = false
        topicList()
    }
  })
}

const deleteTopic = (index, row) => {
    const option = {
      baseURL: env.messageUrl,
      url: "notice/topic",
      method: "DELETE",
      params: {
        topic: row.name,
      },
      headers: {
        'Authorization': 'Bearer '+ access.access_token
      },
  }
  axios(option).then(function(response){
    data.topics.splice(index, 1);
  })
}

const deleteNotice = (index, row) => {
    const option = {
      baseURL: env.messageUrl,
      url: "notice",
      method: "DELETE",
      params: {
        ids: row.id,
      },
      headers: {
        'Authorization': 'Bearer '+ access.access_token
      },
  }
  axios(option).then(function(response){
    data.notifications.splice(index, 1);
  })
}

const pushNotice = (index, row) => {
    const option = {
      baseURL: env.messageUrl,
      url: "notice/push",
      method: "POST",
      data: {
        id: row.id,
        topic: row.topic,
        title: row.title,
        body: row.body,
        imageUrl: row.imageUrl,
        draft: !row.draft,
      },
      headers: {
        'Authorization': 'Bearer '+ access.access_token
      },
  }
  axios(option).then(function(response){
    noticeList([], "")
  })
}

</script>