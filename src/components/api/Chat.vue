<template>
     <el-input
      placeholder="Search..."
      v-model="searchText"
      @input="searchPeer(searchText)"
      prefix-icon="el-icon-search"
    ></el-input>
    <el-table :data="data.peers">
      <el-table-column prop="username" label="user" />
      <el-table-column prop="peerId" label="peerId" />
      <el-table-column prop="status" label="status" />
      <el-table-column prop="lastActive" label="lastActive" :formatter="formatTimestamp" sortable />
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button  @click="chat(scope.row.peerId)"> 
          <span v-if="scope.row.status == 'online'">chat</span>
          <span v-if="scope.row.status == 'offline'">message</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { ElButton, ElTable, ElInput } from 'element-plus';
import { env } from '~/assets/ts/env';
import { axios } from '~/assets/ts/axio';
import { peer } from '~/assets/ts/interface';
import { dayjs } from 'element-plus';
import { getPeerInstance } from '~/assets/ts/webrtc';

const peers:peer[] = [];
const data = reactive({peers});
const searchText = ref("");

function formatTimestamp(row:peer) {
  if (row.lastActive) {
    return dayjs(row.lastActive).format("YYYY-MM-DD HH:mm:ss");
  } 
}

const chat = (peerId) => {
  const peer = getPeerInstance();
  var conn = peer?.connect(peerId);
  conn.on('open', function() {
	// Receive messages
	conn.on('data', function(data) {
	  console.log('Received', data);
	});

	// Send messages
	conn.send('Hello!');
  });
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
    console.log(response.data)
    if (response.data.peerId) {
      pid = response.data.peerId;
    }
    data.peers = [];
    data.peers.push(response.data);
    const option = {
      baseURL: env.peerUrl,
      url: "/online/",
      method: "GET",
      headers: {
        "content-type": "application/json"
      }, 
    }
    await axios(option).then(async function(response) {
        console.log(response.data)
        const pIds = response.data;
        data.peers[0].status = "offline";
        for (let i = 0; i < response.data.length; i++) {
            if (pIds[i] === pid) {
              data.peers[0].status = "online"
              break;
            }
          
        }
    });
  });
}
</script>
  