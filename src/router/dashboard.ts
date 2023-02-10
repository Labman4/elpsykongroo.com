const dashboard = {
    path: '/dashboard',
    children:[
        {
            path: "kubernetes",
            name: "kubernetes",
            component: () => import('../components/dashboard/Kubernetes.vue'), // 注意这里要带上 文件后缀.vue 
        },
        {
            path: "linkerd",
            name: "linkerd",
            component: () => import('../components/dashboard/Linkerd.vue'), // 注意这里要带上 文件后缀.vue 
        },
        {
            path: "kibana",
            name: "kibana",
            component: () => import('../components/dashboard/Kibana.vue'), // 注意这里要带上 文件后缀.vue 
        },
        {
            path: "harbor",
            name: "harbor",
            component: () => import('../components/dashboard/Harbor.vue'), // 注意这里要带上 文件后缀.vue 
        }
    ]   
}
export default dashboard