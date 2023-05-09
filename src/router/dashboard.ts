const dashboard = {
    path: '/',
    children:[
        {
            path: "kubernetes",
            name: "kubernetes",
            component: () => import('../components/dashboard/Kubernetes.vue'), 
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
            path: "kafka",
            name: "kafka",
            component: () => import('../components/dashboard/Kafka.vue'),
        }
    ]   
}
export default dashboard