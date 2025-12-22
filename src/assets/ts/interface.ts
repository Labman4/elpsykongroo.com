interface user {
  id: string
  email: string
  nickName: string
  username: string
  password: string
  createTime: string
  updateTime: string
  locked: string
}

interface notification {
  id: string
  title: string
  body: string
  imageUrl: string
  timestamp: string
  topic: string[]
  draft: boolean
}

interface topic {
  registers: string[]
  users: string[]
  name: string
}

interface group {
  groupName: string
  id: string
}

interface authority {
    authority: string
    id: string
}

interface ListObject {
  key: string
  timestamp: number
  size: number
}

interface pid {
  _id: string
  username: string
  lastActive: string
  peerId: string
  status: string
}

interface message  {
  text: string
  timestamp: number
  sender: string,
  user: string
}

export type { user, notification, topic, group, authority, ListObject, pid, message };
