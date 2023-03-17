const dashboard = {
    path: '/',
    children:[
        {
            path: "kubernetes",
            name: "kubernetes",
            component: () => import('../components/dashboard/Kubernetes.vue'), 
        },
        {
            path: "linkerd",
            name: "linkerd",
            component: () => import('../components/dashboard/Linkerd.vue'), 
        },
        {
            path: "kibana",
            name: "kibana",
            component: () => import('../components/dashboard/Kibana.vue'),
        },
        {
            path: "harbor",
            name: "harbor",
            component: () => import('../components/dashboard/Harbor.vue'),
        },
        {
            path: "minio",
            name: "minio",
            component: () => import('../components/dashboard/Minio.vue'),
        }
    ]   
}
export default dashboard