  interface User {
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
export type { User, notification, topic };
