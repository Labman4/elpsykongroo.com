import { defineStore } from 'pinia';
import Peer from 'peerjs';
import { env } from '~/assets/ts/env';
import { visible } from '~/assets/ts/visible';
import { data } from '~/assets/ts/dataInterface'
import { access } from '~/assets/ts/access';

export const usePeerStore = defineStore('peerStore', {
  state: () => ({
    peerInstance: null as Peer | null,
    peerId: '' as string | null,
    isFirst: true as boolean | false 
  }),
  actions: {
    async initPeer() {
      if (!this.peerInstance) {
        try {

          // this.peerInstance = new Peer();
          this.peerInstance = new Peer(null, {
            host: env.peerServerUrl,
            port: 443,
            path: '/app',
            secure: true,
            debug: 0,
            // config: {
            //   iceServers: []  // 不使用 STUN/TURN 服务器
            // }
          });

          this.peerInstance.on('open', (id: string) => {
            this.peerId = id;
            this.isFirst = false;
          });

          this.peerInstance.on('connection', (conn) => {
            console.log('New connection established');
            this.handleConnection(conn);
          });

          this.peerInstance.on('error', (err: any) => {
            if (this.isFirst) {
              this.peerInstance = null;
            } 
            console.error('Peer connection error:', err);
          });
          this.peerInstance.on('disconnected', () => {
            console.log('Disconnected from the signaling server');
            if (!this.isFirst) {
              this.peerInstance.reconnect()
            }
          }); 
        } catch (error) {
          console.error('Failed to initialize PeerJS instance:', error);
        }
      }
    },
    handleConnection(conn: any) {
      access.connectId = conn.peer;
      conn.on('open', function() {
        conn.on('data', function(datas) {
          const d = datas.split("*");
          const time = Number(d[2]);
          visible.isDotMessage = true;
          data.messages.push({
            text: d[0],
            sender: "received",
            timestamp: time,
            user: d[1]
          })
        });
      });
      conn.on('close', () => {
        console.log('Connection closed');
      });

      conn.on('error', (err: any) => {
        console.error('Connection error:', err);
      });
    },
    getPeer() {
      return this.peerInstance;
    },
  },
});