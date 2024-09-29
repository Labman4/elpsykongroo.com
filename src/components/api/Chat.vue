<template>
    <el-dialog v-model="visible.chatTable" :width=visible.dialogWidth>
      <el-button @click="visible.chatDrawer = true">recent</el-button>
      <el-input
        placeholder="Search..."
        v-model="searchText"
        @keyup.enter.prevent=searchPeer(searchText)
        prefix-icon="el-icon-search"
      ></el-input>
    <el-table :data="datas.peers">
      <el-table-column prop="username" label="user" />
      <el-table-column prop="peerId" label="peerId" />
      <el-table-column prop="status" label="status" />
      <el-table-column prop="lastActive" label="lastActive" :formatter="formatTimestamp" sortable />
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button  @click="visible.chatDrawer = true, access.connectId = scope.row.peerId"> 
          <span v-if="scope.row.status == 'online'">chat</span>
          <span v-if="scope.row.status == 'offline'">message</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>
    <el-dialog v-model="connectPeer" :width=visible.dialogWidth>
        <el-form>
            <el-form-item label="id" :label-width=visible.labelWidth>
                <el-input v-model="peerId" />
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="">Cancel</el-button>
            <el-button type="primary" @click="access.connectId = peerId" >
            Confirm
            </el-button>
        </span>
        </template>
    </el-dialog>

    <el-drawer
      v-model="visible.chatDrawer">
      <div class="messages" ref="messageList">
        <div
          v-for="(message, index) in data.messages"
          :key="index"
          :class="['chatMessage', message.sender === 'me' ? 'sent' : 'received']"
        >
        <div class="message-username">
          <strong>{{ message.user }}</strong>
        </div>
          <div class="message-content">
            <span>{{ message.text.split("*")[0] }}</span>
          </div>
          <div class="message-time">
            <small>{{ formatMessageTimestamp(message.timestamp) }}</small>
          </div>
        </div>
      </div>

      <!-- 输入框和发送按钮 -->
      <div class="chat-controls">
        <el-input
          v-model="inputMessage"
          placeholder="Type a message..."
          @keyup.enter="chat()"
        ></el-input>
        <el-button type="primary" @click="chat()">Send</el-button>
      </div>
    </el-drawer>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { ElButton, ElTable, ElInput } from 'element-plus';
import { env } from '~/assets/ts/env';
import { axios } from '~/assets/ts/axio';
import { pid } from '~/assets/ts/interface';
import { dayjs } from 'element-plus';
import { usePeerStore } from '~/assets/ts/webrtc';
import { visible } from '~/assets/ts/visible';
import { access } from '~/assets/ts/access';
import { data } from '~/assets/ts/dataInterface'

const connectPeer = ref(false);
const peers:pid[] = [];
const datas = reactive({peers});
const searchText = ref("");
const peerId = ref("");
const inputMessage = ref("");

function formatTimestamp(row:pid) {
  if (row.lastActive) {
    return dayjs(row.lastActive).format("YYYY-MM-DD HH:mm:ss");
  } 
}

function formatMessageTimestamp(row) {
  return dayjs(row).format("YYYY-MM-DD HH:mm");
}

const chat = () => {
  const peerStore = usePeerStore();
  const peer = peerStore.getPeer();
  var conn = peer?.connect(access.connectId);
  if (conn) {
    conn?.on('open', function() {
      const time = new Date().getTime();
      let sender = "anonymous"
      if (access.sub) {
        sender = access.sub
      }
      const text = inputMessage.value + "*" + sender + "*" + time;
      conn?.send(text);
      data.messages.push({
        text: text,
        sender: "me",
        timestamp: time,
        user: sender
      });
      conn?.on('error', function(err) {
        console.error('Connection error:', err);
      });
    });
  }
}

const searchPeer = async(username) => {
  const option = {
      baseURL: env.peerUrl,
      url: "/user/" + username,
      method: "GET",
      headers: {
        "content-type": "application/json"

      }, 
  }
  let pid;
  await axios(option).then(async function(response) {
    if (response.data && response.data.peerId) {
      pid = response.data.peerId;
    }
    datas.peers = [];
    datas.peers.push(response.data);
    const option = {
      baseURL: env.peerUrl,
      url: "/online/",
      method: "GET",
      headers: {
        "content-type": "application/json"
      }, 
    }
    if (pid) {
      await axios(option).then(async function(response) {
        const pIds = response.data;
        if (pIds != "") {
          datas.peers[0].status = "offline";
          for (let i = 0; i < response.data.length; i++) {
              if (pIds[i] == pid) {
                if (datas.peers[0]) {
                  datas.peers[0].status = "online";
                }
                break;
              }     
          }
        }
      });
    }
  });
}
</script>
<style>
.messages {
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.chatMessage {
  max-width: 60%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
}

/* 发送的消息靠右对齐 */
.sent {
  background-color: #d1e7dd;
  margin-left: auto;
  text-align: right;
}

/* 接收的消息靠左对齐 */
.received {
  background-color: #f5f5f5;
  margin-right: auto;
  text-align: left;
}

.message-time {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
}

.chat-controls {
  display: flex;
  margin-top: 10px;
}

.message-username {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

</style>