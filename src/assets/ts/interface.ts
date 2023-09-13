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
export type { user, notification, topic, group, authority };
