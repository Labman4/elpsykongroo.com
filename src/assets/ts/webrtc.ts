import { Peer } from "peerjs";

let peerInstance = null;

function getPeerInstance() {
    if (!peerInstance) {
        peerInstance = new Peer(null, {
            host: "127.0.0.1",
            port: 9091,
            path: "/app",
            secure: false // 如果是自建服务器，且不使用 HTTPS
        });
    }
    return peerInstance;
}

async function connect() {
    // const peer = new Peer();
    const peer = new Peer(null, {
        host: "127.0.0.1",
        port: 9091,
        path: "/app",
        secure: false // 如果是自建服务器，且不使用 HTTPS
    });
    return new Promise((resolve, reject) => {
        peer.on('open', (id) => {
            resolve(id); // 当连接建立时，返回 Peer ID
        });

        peer.on('error', (err) => {
            reject(err); // 发生错误时拒绝 Promise
        });
    });
}

export { connect, getPeerInstance }